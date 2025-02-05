import {describe, expect} from '@jest/globals';
import Knight from "@/pieces/figures/Knight";
import { setGame } from '@/utils/fentoboard';

describe('Pawn', () => {
	// Setup pieces
	const knight = new Knight({y:4, x:4}, true);	  
	setGame([
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 0
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 1
		[' ', ' ', ' ', 'p', ' ', 'p', ' ', ' '], // Row 2
		[' ', ' ', 'p', ' ', ' ', ' ', 'p', ' '], // Row 3
		[' ', ' ', ' ', ' ', 'N', ' ', ' ', ' '], // Row 4
		[' ', ' ', 'p', ' ', ' ', ' ', 'p', ' '], // Row 5
		[' ', ' ', ' ', 'p', ' ', 'p', ' ', ' '], // Row 6 (White pawn start)
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']  // Row 7
	  ]);

	it(`should allow moves of one square vertically for two squares horizontally, and vice versa, in any direction
	`, () => {
		knight.checkMove();
	  expect(knight.allowedSquares).toEqual([{ y: 3, x: 2 }, { y: 2, x: 3 }, { y: 2, x: 5 },{ y: 3, x: 6 }, { y: 5, x: 6 }, { y: 6, x: 5 }, { y: 6, x: 3 }, { y: 5, x: 2 }]);
	});
  });

