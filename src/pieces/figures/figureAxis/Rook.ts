import { getGame } from '@/utils/fentoboard';
import { PiecePos, game } from '../../../utils/Models';
import FigureAxis from './FigureAxis';
/**
 * @param{PiecePos} pos - 
 * @param{boolean} isWhite - 
 * @param{PiecePos[]} allowedSquares -
 */
 export default class Rook extends FigureAxis {
	constructor(pos: PiecePos, isWhite: boolean) {
		super(pos, isWhite);
	}

	/**
	 * Set allowed square moves
	 */
	checkMove = ({y, x} :PiecePos = {y: this.pos.y, x: this.pos.x}) => {
		const game: game = getGame();
		this.allowedSquares = [];
		let axisLeftRight: Array<number[]>  = game[y].map((sq, idx) => [y, idx]);
        this.getMovesOnAxis(axisLeftRight, [y, x], game);

        let axisTopBottom: Array<number[]>  = game.map((line, idx) => [idx, x]);
        this.getMovesOnAxis(axisTopBottom, [y, x], game);
    }
}