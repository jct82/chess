import { PiecePos, game, Threat, pieceTranslate } from '@/utils/Models';
import { setGame, setEnPassant, enPassant } from '@/utils/globals';

import Piece from '@/pieces/Piece';
import King from '@/pieces/figures/figureAxis/King';
import Queen from '@/pieces/figures/figureAxis/Queen';
import Bishop from '@/pieces/figures/figureAxis/Bishop';
import Knight  from '@/pieces/figures/Knight';
import Rook from '@/pieces/figures/figureAxis/Rook';
import Pawn from '@/pieces/Pawn';
import { games } from 'googleapis/build/src/apis/games';

type players = {
    white: Piece[],
	black: Piece[]
};

export default class Game {
	squares: game;
	selected: Piece;
	whitePlayin: boolean;
	mat: boolean;
	pat: boolean;
	white: Piece[];
	black: Piece[];
	transform: boolean;
	captureCount: number;
	count: number;
	constructor(
		squares: game, 
		selected: Piece, 
		whitePlayin: boolean, 
		mat: boolean, 
		pat: boolean, 
		captureCount = 0, 
		count = 0
		) {
		this.squares = squares;
		this.selected = selected;
		this.whitePlayin = whitePlayin;
		this.mat = mat;
		this.pat = pat;
		this.white = [];
		this.black = [];
		this.transform = false;
		this.captureCount = captureCount;
		this.count = count;
		this.init();
	}

	/**
	 * Set white and black players at first round
	 */
	 init = () => {    
		this.squares.forEach((line, lIdx) => line.forEach((square, sqIdx) => {
			if (square !== ' ') {
				const isWhite = square === square.toUpperCase() ? true : false;
				switch (square.toUpperCase()) {
					case 'R':
						isWhite ? 
						this.white.push(new Rook({y: lIdx, x: sqIdx}, true)) :
						this.black.push(new Rook({y: lIdx, x: sqIdx}, false)) ;
						break;
					case 'N':
						isWhite ? 
						this.white.push(new Knight({y: lIdx, x: sqIdx}, true)) :
						this.black.push(new Knight({y: lIdx, x: sqIdx}, false)) ;
						break;
					case 'B':
						isWhite ? 
						this.white.push(new Bishop({y: lIdx, x: sqIdx}, true)) :
						this.black.push(new Bishop({y: lIdx, x: sqIdx}, false)) ;
						break;
					case 'K':
						isWhite ? 
						this.white.push(new King({y: lIdx, x: sqIdx}, true)) :
						this.black.push(new King({y: lIdx, x: sqIdx}, false)) ;
						break;
					case 'Q':
						isWhite ? 
						this.white.push(new Queen({y: lIdx, x: sqIdx}, true)) :
						this.black.push(new Queen({y: lIdx, x: sqIdx}, false)) ;
						break;
					case 'P':
						isWhite ? 
						this.white.push(new Pawn({y: lIdx, x: sqIdx}, true)) :
						this.black.push(new Pawn({y: lIdx, x: sqIdx}, false)) ;
						break;
					default:
				}
			}
		}));
	}

	/**
	 * Operations to fullfil to update game state each time a players moves a piece.
	 * @param newY abcissa position of last piece move
	 * @param newX ordinate position of last piece move
	 */
	updateGame = (newY: number, newX: number) => {
		const prevX = this.selected.pos.x;
        const prevY = this.selected.pos.y;
		const player = this.whitePlayin ? this.white : this.black;
		const opponent = this.whitePlayin ? this.black : this.white;
		const myKing: King = player.find(p => p instanceof King) as King;
		const king: King = opponent.find(p => p instanceof King) as King;
		// If was in chess, cancel chess
		if (myKing.chess) myKing.chess = !myKing.chess;
		// If chess threat piece moves, remove corresponding chess threat
		king.removeThreat(this.squares[prevY][prevX].toUpperCase(), {y: prevY, x: prevX});
		// Remove eaten piece and corresponding chess threat
		this.captureCount++;
		this.removeEaten(opponent, myKing, {y: newY, x: newX});
		// Does piece's move fulfills check threat of another piece ?
		const threatFulfilled = king.fulfillThreat({y:prevY, x: prevX});
		if (this.selected instanceof Pawn) {
			// convert pawn
			if (newY === (this.whitePlayin ? 0 : 7)) this.transform = true;
			// en passant
			if (enPassant.is) this.checkEnPassant(player, opponent, {y: newY, x: newX});
			if (Math.abs(prevY - newY) === 2) setEnPassant({is: true, pos:{y: newY, x: newX}});
		}
		//castle
		if (myKing.castling.length > 0) this.castling(player, {y: newY, x: newX});
		// Update positions array
		this.squares[newY][newX] = this.squares[prevY][prevX];
		this.squares[prevY][prevX] = ' ';
		// Update moved piece position
		this.updatePiecePos(player, {y: newY, x:newX});
		setGame(this.squares);

		this.selected instanceof King && this.selected.kingChess();
		!this.transform && this.setNextRound(opponent, king, {y:newY, x:newX}, !!threatFulfilled);
	}

	/**
	 * Set next round : allowed squares of opponent's pieces. Is there check, mat or pat?
	 * @param opponent adversary player 
	 * @param king adversary king
	 * @param position of piece just moved 
	 * @param threatFulfilled has last piece move freed axis for a piece to check opponent king
	 */
	setNextRound = (opponent: Piece[], king: King, {y, x}: PiecePos, threatFulfilled: boolean) => {
		const isChess = king.checkChess({y:y, x:x});
		(threatFulfilled || isChess) ?
		this.mat = this.isMat(king, opponent) ? true : false :
		this.pat = this.isPat(king, opponent) ? true : false ;
		this.whitePlayin = !this.whitePlayin;
		this.whitePlayin && this.count++;
	}

	/**
	 * Remove eaten piece from player
	 * @param player which player belongs the eaten piece
	 * @param king king of player that just ate a piece
	 * @param position of eaten piece 
	 */
	removeEaten = (player: Piece[], king: King, {y, x}: PiecePos) => {
		player.find((p, idx) => {
			if (`${p.pos.y}${p.pos.x}` === `${y}${x}`) {
				player.splice(idx, 1);
				king.removeThreat(this.squares[y][x].toUpperCase(), {y: y, x: x});
				this.captureCount = 0;
				return p;
			}
		}); 
	}

	/**
	 * Update position of last piece moved
	 * @param player which player belongs the moved piece
	 * @param position arrival position of moved piece 
	 */
	updatePiecePos = (player: Piece[], {y, x}: PiecePos) => {
		player.find((p, idx) => {
			if (`${p.pos.y}${p.pos.x}` === `${this.selected.pos.y}${this.selected.pos.x}`) {
				player[idx].pos = {y:y, x:x};
				return p;
			}
		});
	}

	/**
	 * Transform pawn arrived at the end of the chessboard to the piece of player's choice
	 * @param player which player belongs the pawn about to transform in another piece
	 */
	pawnToPiece = (player: Piece[], pieceType: string) => {
		const newFigure = this.setNewFigure(pieceType)!;
        player.find((p, idx) => {
            if (`${p.pos.y}${p.pos.x}` === `${this.selected.pos.y}${this.selected.pos.x}`) {
                player.splice(idx, 1);
                return p;
            }
        });
        player.push(newFigure);
        this.selected = newFigure;
        this.squares[this.selected.pos.y][this.selected.pos.x] = this.whitePlayin ? pieceTranslate[pieceType].toUpperCase() : pieceTranslate[pieceType];
		setGame(this.squares);
		this.transform = false;
    }

	/**
	 * Transform the pawn in desired piece
	 * @param pieceType selected of newly transformed pawn
	 * @returns Piece object required
	 */
	setNewFigure = (pieceType: String) => {
		if (pieceType === 'Queen') return new Queen({y: this.selected.pos.y, x: this.selected.pos.x}, this.selected.isWhite);
		if (pieceType === 'Knight') return new Knight({y: this.selected.pos.y, x: this.selected.pos.x}, this.selected.isWhite);
		if (pieceType === 'Bishop') return new Bishop({y: this.selected.pos.y, x: this.selected.pos.x}, this.selected.isWhite);
		if (pieceType === 'Rook') return new Rook({y: this.selected.pos.y, x: this.selected.pos.x}, this.selected.isWhite);
	}

	/**
	 * Eat opponent pawn, performing en passant move
	 * @param player player able to perform en passant move
	 * @param opponent threaten pawn's player by en passant
	 * @param newPos position of pawn that can be eaten by en passant move
	 */
    checkEnPassant = (player: Piece[], opponent: Piece[], newPos: PiecePos) => {
        const eaten:PiecePos = {y: enPassant.pos.y, x:enPassant.pos.x};
        let king = player.find(p => (p instanceof King))!;
        if (`${newPos.y}${newPos.x}` === `${eaten.y + (this.whitePlayin ? -1 : 1)}${eaten.x}`) {
            opponent.find((p, idx) => {
                if (!(p instanceof Pawn)) return false;
                if (`${eaten.y}${eaten.x}` === `${p.pos.y}${p.pos.x}`) {
                    opponent.splice(idx, 1);
                    king.removeThreat(this.squares[eaten.y][eaten.x].toUpperCase(), {y: eaten.y, x: eaten.x});
                    this.squares[eaten.y][eaten.x] = ' ';
                    return p;
                }
            });
        }
        setEnPassant({is: false, pos: {x: 8, y: 8}});
    }

	/**
	 * Update castle king's possibility after move of the king or a rook
	 * @param player who just moved, of whom we check castle possibilites
	 * @param newPos arrival position of moved piece (rook or king)
	 */
    castling = (player: Piece[], newPos: PiecePos) => {
        let king = player.find(p => (p instanceof King))!;
        if (this.selected instanceof Rook) this.removeCastling(king);
        else if (this.selected instanceof King) {
            if (Math.abs(newPos.x - king.pos.x) > 1) this.performCastling(player, newPos, king);
            king.castling = [];
        }
    }

	/**
	 * Remove a possibility of castling after one rook moved
	 * @param king of player that just moved a piece
	 */
	removeCastling = (king: King) => {
		king.castling.find((t, id) => {
			if (`${t.y}${t.x}` === `${this.selected.pos.y}${this.selected.pos.x}`) {
				king.castling.splice(id,1);
				return t;
			}
		});
	}

	/**
	 * Castle than remove possibilities of castle
	 * @param player who just moved, of whom we check castle possibilites
	 * @param newPos arrival position of moved piece (rook or king)
	 * @param king  of player that just moved a piece
	 */
	performCastling = (player: Piece[], newPos: PiecePos, king: King) => {
		const posRook = (newPos.x - king.pos.x) > 0 ? 7 : 0;
		player.find((p, idx) => {
			if (`${p.pos.y}${p.pos.x}` === `${this.selected.pos.y}${posRook}`) {
				const newPosRook = newPos.x + (posRook === 0 ? 1 : -1);
				player[idx].pos = {y:newPos.y, x:newPosRook};
				this.squares[newPos.y][newPosRook] = this.squares[newPos.y][posRook];
				this.squares[newPos.y][posRook] = ' ';
				return p;
			}
		});
		king.kingChess();
	}

	/**
	 * Check if king of player is checkmate
	 * @param king 
	 * @param player 
	 */
	isMat = (king: King, player: Piece[]) => {
		let allowedToMove = false;
		king.chess = true;
		// oppose piece between
		let chessWays = king.threats.filter(th => th.fulfilled === true);
		if (chessWays.length <= 1) {
			let chessWay = [...chessWays[0]?.axis.map(pos => pos.join('')), chessWays[0]?.pos.join('')];
			for (const [idx,pl] of player.entries()) {
				if (pl instanceof King || king.fulfillThreat({y:pl.pos.y, x:pl.pos.x}, true)) continue;
				pl.checkMove();
				player[idx].allowedSquares = pl.allowedSquares.filter(pos => chessWay.indexOf(`${pos.y}${pos.x}`) >= 0);
				if (player[idx].allowedSquares.length > 0) allowedToMove = true;
			}
		}
		king.checkMove();
		return (!allowedToMove && king.allowedSquares.length === 0);
	}

	/**
	 * Check if stalemate
	 * @param king 
	 * @param player 
	 */
	isPat = (king: King, player: Piece[]) => {
		let allowedToMove = false;
		for (const [idx,pl] of player.entries()) {
			pl.checkMove();
			this.updateShieldPiece(king, pl);
			if (player[idx].allowedSquares.length > 0) allowedToMove = true;
		}
		return (!allowedToMove);
	}

	/**
	 * If this piece oppose check on own king, update its allowed moves
	 * @param king own king
	 * @param piece shield piece
	 * @returns nothing
	 */
	updateShieldPiece = (king: King, piece: Piece) => {
		if (piece instanceof King) return;
		const currentThreat = king.fulfillThreat({y:piece.pos.y, x:piece.pos.x}, true) as Threat;
		if (!currentThreat) return;
		let threatPos: Array<string> = [...currentThreat.axis, currentThreat.pos].map(sq => sq.join(''));
		piece.allowedSquares = piece.allowedSquares.filter(sq => threatPos.indexOf(`${sq.y}${sq.x}`) >= 0);
	}
}

