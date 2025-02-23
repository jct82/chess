import {describe, expect} from '@jest/globals';
import Rook from "@/pieces/figures/figureAxis/Rook";
import { getGame, setGame } from '@/utils/globals';

describe('Axis figure', () => {
	// Setup pieces
	const rook = new Rook({y:4, x:4}, true);	  
	setGame([
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 0
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 1
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 2
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 3
		[' ', 'P', ' ', ' ', 'R', ' ', 'p', ' '], // Row 4
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 5
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 6
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']  // Row 7
	  ]);
	  const game = getGame();
	  rook.getMovesOnAxis([[4,0], [4,1], [4,2], [4,3], [4,4], [4,5], [4,6], [4,7]], [4, 4], game);

	it(`Should return index of array inside array of array`, () => {
		expect(rook.getSquareIdx([[4,0], [4,1], [4,2], [4,3]], [4, 2])).toBe(2);
	});

	it(`Should return allowed squares on axis to move on :
	squares between rook and first piece,
	and piece's square itself if it's an adversary piece`, () => {
		expect(rook.allowedSquares).toEqual([{y:4,x:3}, {y:4,x:2}, {y:4,x:5}, {y:4,x:6}]);
	});
  });

