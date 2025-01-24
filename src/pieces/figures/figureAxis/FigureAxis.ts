import { PiecePos, game } from '../../../utils/Models';
import Figure from '../Figure';
/**
 * @param{PiecePos} pos - 
 * @param{boolean} isWhite - 
 */
 export default abstract class FigureAxis extends Figure {
	constructor(pos: PiecePos, isWhite: boolean) {
		super(pos, isWhite);
		super.allowedSquares;
	}

	/**
	 * Get square index in squares array
	 * @param squares squares array of coordinates number array [y, x]
	 * @param pos coordinates number array [y, x]
	 * @returns number
	 */
	getSquareIdx(squares: Array<number[]>, pos: number[]) {
		return squares.map(sq => sq.join('')).indexOf([pos[0],pos[1]].join(''));
	}

	/**
	 * Set allowed square moves on Pieces axis
	 * @param squares squares array of coordinates number array [y, x]
	 * @param pos coordinates number array [y, x]
	 * @param game chessboard game - array of coordinates array
	 */
	getMovesOnAxis = (squares: Array<number[]>, pos: [number, number], game: game) => {
        let pieceIdx = this.getSquareIdx(squares, pos);
		let downSquare: Array<number[]> = squares.slice(0, pieceIdx);
		let upSquare: Array<number[]> = squares.slice(pieceIdx + 1);
		[downSquare.reverse(), upSquare].forEach(arr => {
			for(const sq of arr) {
				let square = game[sq[0]][sq[1]];
				if (square !== ' ') {
					if (this.isAdversaryPiece(square)) this.allowedSquares.push({y: sq[0], x: sq[1]});
					break;
				} 
				this.allowedSquares.push({y: sq[0], x: sq[1]});
			}
		});
    }
}