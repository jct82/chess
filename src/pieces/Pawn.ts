import { PiecePos, game } from '../utils/Models';
import { getGame } from '@/utils/fentoboard';
import Piece from './Piece';
/**
 * @param{PiecePos} pos - 
 * @param{Array<number[]>} game - 
 */
 export default class Pawn extends Piece {
	constructor(pos: PiecePos, isWhite: boolean) {
		super(pos, isWhite);
		super.allowedSquares;
	}

	/**
	 * Is move possible ? square empty and occupied by adversary
	 * @param pos pawn's eating moves position on chessboard => y: (1-8) x: (A-H) 
	 * @returns boolean
	 */
	validateMove(pos: PiecePos) {
		const piece = this.getSquare(pos);
		return !!piece && (piece !== ' ' && this.isAdversaryPiece(piece));
	}

	/**
	 * Set allowed square moves of this pawn
	 * @param pos piece position on chessboard => y: (1-8) x: (A-H) 
	 */
	checkMove = ({y, x} :PiecePos = {y: this.pos.y, x: this.pos.x}) => {
		let dir = this.isWhite ? -1 : 1;
		const game: game = getGame();
		this.allowedSquares = [];
		let allowedSquares = [];
		if (game[y + dir][x] === ' ') allowedSquares.push({y:y + dir, x:x});
		if (y === (this.isWhite ? 6 : 1) &&
		game[y + (dir * 2)][x] === ' ') allowedSquares.push({y:y + (dir * 2), x:x});
		const frontLeft: PiecePos = {y:y + dir, x:x - 1};
		if (this.validateMove(frontLeft)) allowedSquares.push({y:frontLeft.y, x:frontLeft.x});
		const frontRight: PiecePos = {y:y + dir, x:x + 1};
		if (this.validateMove(frontRight)) allowedSquares.push({y:frontRight.y, x:frontRight.x});
		this.allowedSquares = allowedSquares;
	}
}