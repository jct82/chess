import { PiecePos } from '../../utils/Models';
import Piece from '../Piece';
/**
 * @param{PiecePos} pos - 
 * @param{boolean} isWhite - 
 */
 export default abstract class Figure extends Piece {
	constructor(pos: PiecePos, isWhite: boolean) {
		super(pos, isWhite);
	}

	/**
	 * Is move possible ? square empty or occupied by adversary
	 * @param pos figure's moves position on chessboard => y: (1-8) x: (A-H) 
	 * @returns boolean
	 */
	validateMove(pos: PiecePos) {
		const piece = this.getSquare(pos);
		return !!piece && (piece === ' ' || this.isAdversaryPiece(piece));
	}
}