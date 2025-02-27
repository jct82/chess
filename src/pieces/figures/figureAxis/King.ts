import { getGame } from '@/utils/globals';
import { PiecePos, Threat, game } from '@/utils/Models';
import FigureAxis from './FigureAxis';
/**
 * @param{PiecePos} pos - 
 * @param{boolean} isWhite - 
 * @param{PiecePos[]} allowedSquares -
 */
export default class King extends FigureAxis {
	threats: Threat[];
	chess: boolean;
	castling: PiecePos[];
	constructor(pos: PiecePos, isWhite: boolean, chess: boolean = false, castling: PiecePos[] = [{y:pos.y, x: 0}, {y:pos.y, x: 7}]) {
		super(pos, isWhite);
		this.threats = [];
		this.chess = chess;
		this.castling = castling;
	}

	/**
	 * Set allowed square moves. King moves filtered of ckecked positions
	 */
	checkMove = ({y, x} :PiecePos = {y: this.pos.y, x: this.pos.x}) => {
		const game: game = getGame();
		this.allowedSquares = [];
		let kingMoves: PiecePos[] = [];
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let pos: PiecePos = {y:y + i, x:x + j};
                if (this.validateMove(pos)) kingMoves.push(pos);
            }
        }
		for (let km of kingMoves) {
            if (
                this.rookChess(this.isWhite ? 'r' : 'R', km, true) ||
                this.rookChess(this.isWhite ? 'q' : 'Q', km, true) ||
                this.knightChess(km, true) ||
                this.bishopChess(this.isWhite ? 'b' : 'B', km, true) ||
                this.bishopChess(this.isWhite ? 'q' : 'Q', km, true) ||
                this.pawnChess(km, true)
            ) continue;
            this.allowedSquares.push(km);
        }
		!this.chess && this.allowedSquares.push(...this.castle(game));
    }

	/**
	 * Check if king can castle than update its allowed position moves
	 * @param game the game pieces map on chess board
	 * @returns allowed positions of castle
	 */
	castle = (game: game) => {
		let castleSquares: PiecePos[] = [];
		for (let t of this.castling) {
			const diff = Math.abs(this.pos.x - t.x) - 1;
			const asc = this.pos.x < t.x;
			const line = game[this.pos.y];
			const posLine = line.map((_, id) => ({y: this.pos.y, x: id}));
			const fs = asc ? 
			posLine.filter((_, id) => (id > this.pos.x && id < t.x && line[id] === ' ')) :
			posLine.filter((_, id) => (id < this.pos.x && id > t.x && line[id] === ' '));
			if (fs.length !== diff) continue;
			const freeChecked = fs.find(s => (
				this.rookChess(this.isWhite ? 'r' : 'R', s, true) ||
				this.rookChess(this.isWhite ? 'q' : 'Q', s, true) ||
				this.knightChess(s, true) ||
				this.bishopChess(this.isWhite ? 'b' : 'B', s, true) ||
				this.bishopChess(this.isWhite ? 'q' : 'Q', s, true) ||
				this.pawnChess(s, true)
			));
			if (!!!freeChecked) castleSquares.push({y: this.pos.y, x: this.pos.x + (asc ? 2 : -2)});
		};
		return castleSquares;
	}

	initCastling = (pos: string) => {
		if (pos.charAt(1) === '0') this.castling.pop();
		if (pos.charAt(0) === '0') this.castling.shift();
	}

	/**
	 * Check if piece move checked king
	 * @param pos position of last piece moved
	 * @returns boolean checked 
	 */
	checkChess = (pos :PiecePos) => {
		const game: game = getGame();
		const pieceType = game[pos.y][pos.x].toUpperCase();
		if (pieceType === 'R') return this.rookChess(this.isWhite ? 'r' : 'R');
        if (pieceType === 'N') return this.knightChess();
        if (pieceType === 'B') return this.bishopChess(this.isWhite ? 'b' : 'B');
        if (pieceType === 'Q') return (this.bishopChess(this.isWhite ? 'q' : 'Q') || this.rookChess(this.isWhite ? 'q' : 'Q'));
        if (pieceType === 'P') return this.pawnChess();
        if (pieceType === 'K') this.kingChess();
		return false;
	}

	/**
	 * Does pawn chek king
	 * @param pos king's position / threatened position by pawn check
	 * @returns boolean checked
	 */
	pawnChess = ({y, x} :PiecePos = {y: this.pos.y, x: this.pos.x}, toCheck:boolean = false) => {
		const game: game = getGame();
        const dir = this.isWhite ? -1 : 1;
		const piece = this.isWhite ? 'p' : 'P';
		if (this.getSquare({y:y + dir, x:x - 1}) === piece) return toCheck ? true : this.addDirectThreat([y + dir, x - 1]);
		if (this.getSquare({y:y + dir, x:x + 1}) === piece) return toCheck ? true : this.addDirectThreat([y + dir, x + 1]);
        return false
    }

	/**
	 * Does knight chek king
	 * @param pos king's position / threatened position by knight check
	 * @returns boolean checked
	 */
	knightChess = ({y, x} :PiecePos = {y: this.pos.y, x: this.pos.x}, toCheck:boolean = false) => {
		const game: game = getGame();
		const piece = this.isWhite ? 'n' : 'N';
		if (this.getSquare({y:y - 1, x:x - 2}) === piece) return toCheck ? true : this.addDirectThreat([y - 1, x - 2]);
		if (this.getSquare({y:y - 2, x:x - 2}) === piece) return toCheck ? true : this.addDirectThreat([y - 2, x - 2]);
		if (this.getSquare({y:y - 2, x:x + 1}) === piece) return toCheck ? true : this.addDirectThreat([y - 2, x + 1]);
		if (this.getSquare({y:y - 1, x:x + 2}) === piece) return toCheck ? true : this.addDirectThreat([y - 1, x + 2]);
		if (this.getSquare({y:y + 1, x:x + 2}) === piece) return toCheck ? true : this.addDirectThreat([y + 1, x + 2]);
		if (this.getSquare({y:y + 2, x:x + 1}) === piece) return toCheck ? true : this.addDirectThreat([y + 2, x + 1]);
		if (this.getSquare({y:y + 2, x:x - 1}) === piece) return toCheck ? true : this.addDirectThreat([y + 2, x - 1]);
		if (this.getSquare({y:y + 1, x:x - 2}) === piece) return toCheck ? true : this.addDirectThreat([y + 1, x - 2]);
        return false;
    }

	/**
	 * Does bishop/queen chek king
	 * @param pieceType piece type that would check king : bishop or queen
	 * @param pos king's position / threatened position by bishop/queen check 
	 * @param toCheck check for king allowed moves or for piece check on king ?
	 * @returns boolean checked
	 */
	bishopChess = (pieceType: string, {y, x} :PiecePos = {y: this.pos.y, x: this.pos.x}, toCheck:boolean = false) => {
		const game: game = getGame();
		let axisLeftTopToRight: Array<number[]>  = game.map((line, idx) => [idx, (x - y + idx)]).filter(sq => (sq[1] >= 0 && sq[1] < 8));
        if (this.isChessOnAxis(axisLeftTopToRight, {y, x}, game, pieceType, toCheck)) return true;

        let axisLeftBottomToRight: Array<number[]>  = game.map((line, idx) => [idx, (x + y - idx)]).filter(sq => (sq[1] >= 0 && sq[1] < 8));
		if (this.isChessOnAxis(axisLeftBottomToRight, {y, x}, game, pieceType, toCheck)) return true;
        return false;
    }

	/**
	 * Does rook/queen chek king
	 * @param pieceType piece type that would check king : rook or queen
	 * @param pos king's position / threatened position by rook/queen check
	 * @param toCheck check for king allowed moves or for piece check on king ?
	 * @returns boolean checked
	 */
	rookChess = (pieceType: string, {y, x} :PiecePos = {y: this.pos.y, x: this.pos.x}, toCheck:boolean = false) => {
		const game: game = getGame();
		let axisLeftRight: Array<number[]>  = game[y].map((sq, idx) => [y, idx]);
        if (this.isChessOnAxis(axisLeftRight, {y, x}, game, pieceType, toCheck)) return true;

        let axisTopBottom: Array<number[]>  = game.map((line, idx) => [idx, x]);
		if (this.isChessOnAxis(axisTopBottom, {y, x}, game, pieceType, toCheck)) return true;
        return false;
    }

	/**
	 * Check if king is on piece axis
	 * @param squares squares array of coordinates number array [y, x] 
	 * @param pos king's position / threatened position by rook / bishop / queen check 
	 * @param game chessboard game - array of coordinates array
	 * @param pieceType piece type that would check king : rook / bishop / queen
	 * @param toCheck check for king allowed moves or for piece check on king ?
	 * @returns boolean checked
	 */
	isChessOnAxis = (squares: Array<number[]>, {y, x}: PiecePos, game: game, pieceType: string, toCheck:boolean = false) => {
		let isChess = false;
		squares.map(sq => game[sq[0]][sq[1]]).forEach((sq, idx) => {
			if (sq === pieceType && this.scanAxis(squares, idx, {y, x}, game, toCheck)) isChess = true;
		});
		return isChess;
	}

	/**
	 * Knowing that king is on piece axis, add piece to king's threat and check if threat is fulfilled => piece check king
	 * @param squares squares array of coordinates number array [y, x] 
	 * @param pieceIdx index of piece that would check king, in positions squares array
	 * @param pos king's position / threatened position by rook / bishop / queen
	 * @param game chessboard game - array of coordinates array
	 * @param toCheck check for king allowed moves or for piece check on king ?
	 * @returns boolean checked
	 */
	scanAxis = (squares: Array<number[]>, pieceIdx: number, {y, x}: PiecePos, game: game, toCheck:boolean = false) => {
		let targetIdx = squares.map(sq => sq.join('')).indexOf(`${y}${x}`);
		let range: Array<number[]> = targetIdx > pieceIdx ?
									squares.filter((_, idx) => idx >= pieceIdx && idx < targetIdx) :
									squares.filter((_, idx) => idx > targetIdx && idx <= pieceIdx);
		let king = this.isWhite ? 'K' : 'k';
		let isChess = (range.filter(sq => game[sq[0]][sq[1]] !== ' ' && game[sq[0]][sq[1]] !== king).length === 1) ? true : false;
		if (!toCheck) this.threats.push({pos: [squares[pieceIdx][0], squares[pieceIdx][1]], axis: targetIdx > pieceIdx ? range.slice(1) : range.slice(0, -1), fulfilled: isChess});
		return isChess;
	}

	/**
	 * Is king threaten => on axis of enemy figure axis (rook, bishop, queen) ?
	 */
	kingChess = () => {
		this.threats = [];
		this.rookChess(this.isWhite ? 'r' : 'R');
		this.rookChess(this.isWhite ? 'q' : 'Q');
		this.bishopChess(this.isWhite ? 'b' : 'B');
		this.bishopChess(this.isWhite ? 'q' : 'Q');
	}

	/**
	 * Add piece that check king to threats
	 * @param pos piece position that check king
	 */
	addDirectThreat = (pos: number[]) => {
		this.threats.push({pos, axis: [], fulfilled: true});
		return true;
	}

	/**
	 * Check if moved piece was on king threat axis, then check if its move has revealed check on king 
	 * @param pos piece position between king and threat piece
	 * @param toCheck check for potential piece allowed moves or if current move provoked chess ?
	 * @returns boolean revealed checked after piece move (tocheck false) or threat if piece can't move beacause protects king (tocheck true)
	 */
	fulfillThreat = ({y, x}: PiecePos, toCheck: boolean = false) => {
		if (this.threats.length === 0) return false;
		// check if piece about to move is on one of threats axis
		const currentThreats = this.threats.filter(th => th.axis.map(sq => sq.join('')).indexOf(`${y}${x}`) >= 0);
		if (currentThreats.length === 0) return false;
		const game: game = getGame();
		for (const th of currentThreats) {
			if (th.axis.map(sq => game[sq[0]][sq[1]]).filter(sq => sq !== ' ').length === 1) {
				if (!toCheck) th.fulfilled = true;
				return toCheck ? th : th.fulfilled;
			}
		}
		return false;
	}

	/**
	 * Check if moved piece was a threat to king, then remove it from king threats
	 * @param pieceType piece type of moved or eaten piece
	 * @param pos position of moved or eaten piece
	 */
	removeThreat = (pieceType: string, {y, x}: PiecePos) => {
		if (['R', 'B', 'Q'].indexOf(pieceType) >= 0) {
			this.threats.find((th, idx) => {
				if (th.pos.join('') === `${y}${x}`) {
					this.threats.splice(idx, 1);
					return th;
				}
			});
		}
	}
}