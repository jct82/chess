import { PiecePos, game } from '../utils/Models';
import { getGame } from '@/utils/globals';

/**
 * @param{PiecePos} pos - 
 * @param{isWhite} boolean
 */
export default abstract class Piece {
	pos: PiecePos;
	isWhite: boolean;
	allowedSquares: PiecePos[];
	constructor(pos: PiecePos, isWhite: boolean) {
		this.pos = pos;
		this.isWhite = isWhite;
		this.allowedSquares = [];  // Current allowed square moves of the piece
	}

	/**
	 * Set allowed square moves
	 */
	abstract checkMove() : void;

	/**
	 * Is square occupied by adversary piece
	 * @param square 
	 * @returns boolean
	 */
	isAdversaryPiece = (square: string) => {
        let squareColor = square === square.toUpperCase() ? true : false;
        return squareColor === this.isWhite ? false : true;
    }

	/**
	 * Get piece on chessboard position
	 * @param pos piece position on chessboard => y: (1-8) x: (A-H)
	 * @returns piece type at this position
	 */
	getSquare = (pos: PiecePos) => {
		const game: game = getGame();
		return (!game[pos.y] || !game[pos.y][pos.x]) ? undefined : game[pos.y][pos.x];
	}
	
}