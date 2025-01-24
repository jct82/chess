import { getGame } from '@/utils/fentoboard';
import { PiecePos, game } from '../../utils/Models';
import Figure from './Figure';
/**
 * @param{PiecePos} pos - 
 * @param{boolean} isWhite - 
 */
 export default class Knight extends Figure {
	constructor(pos: PiecePos, isWhite: boolean) {
		super(pos, isWhite);
		super.allowedSquares;
	}

	/**
	 * Set allowed square moves of this knight
	 * @param pos piece position on chessboard => y: (1-8) x: (A-H) 
	 */
	checkMove = ({y, x} :PiecePos = {y: this.pos.y, x: this.pos.x}) => {
		this.allowedSquares = [];
		let leftTop = {y:y - 1, x:x - 2};
		if (this.validateMove(leftTop)) this.allowedSquares.push(leftTop);
		let topLeft = {y:y - 2, x:x - 1};
		if (this.validateMove(topLeft)) this.allowedSquares.push(topLeft);
		let topRight = {y:y - 2, x:x + 1};
		if (this.validateMove(topRight)) this.allowedSquares.push(topRight);
		let rightTop = {y:y - 1, x:x + 2};
		if (this.validateMove(rightTop)) this.allowedSquares.push(rightTop);
		let rightBottom = {y:y + 1, x:x + 2};
		if (this.validateMove(rightBottom)) this.allowedSquares.push(rightBottom);
		let bottomRight = {y:y + 2, x:x + 1};
		if (this.validateMove(bottomRight)) this.allowedSquares.push(bottomRight);
		let bottomLeft = {y:y + 2, x:x - 1};
		if (this.validateMove(bottomLeft)) this.allowedSquares.push(bottomLeft);
		let leftBottom = {y:y + 1, x:x - 2};
		if (this.validateMove(leftBottom)) this.allowedSquares.push(leftBottom);
	}
}