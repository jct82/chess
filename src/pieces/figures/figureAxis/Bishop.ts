import { getGame } from '@/utils/fentoboard';
import { PiecePos, game } from '../../../utils/Models';
import FigureAxis from './FigureAxis';
/**
 * @param{PiecePos} pos - 
 * @param{boolean} isWhite - 
 * @param{PiecePos[]} allowedSquares -
 */
 export default class Bishop extends FigureAxis {
	constructor(pos: PiecePos, isWhite: boolean) {
		super(pos, isWhite);
		super.allowedSquares;
	}

	/**
	 * Set allowed square moves
	 */
	checkMove = ({y, x} :PiecePos = {y: this.pos.y, x: this.pos.x}) => {
		const game: game = getGame();
		this.allowedSquares = [];
        let axisLeftTopToRight: Array<number[]> = game.map((line, idx) => [idx, (x - y + idx)]).filter(sq => (sq[1] >= 0 && sq[1] < 8));
        this.getMovesOnAxis(axisLeftTopToRight, [y, x], game);

        let axisLeftBottomToRight: Array<number[]> = game.map((line, idx) => [idx, (x + y - idx)]).filter(sq => (sq[1] >= 0 && sq[1] < 8));
        this.getMovesOnAxis(axisLeftBottomToRight, [y, x], game);
    }
}