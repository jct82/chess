import {describe, expect} from '@jest/globals';
import Knight from "@/pieces/figures/Knight";
import { setGame } from '@/utils/globals';

describe('Pawn', () => {
	// Setup pieces
	const knight = new Knight({y:5, x:7}, true);	  
	setGame([
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 0
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 1
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 2
		[' ', ' ', ' ', ' ', ' ', ' ', 'q', ' '], // Row 3
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 4
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', 'N'], // Row 5
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 6 (White pawn start)
		[' ', ' ', ' ', ' ', ' ', ' ', 'Q', ' ']  // Row 7
	  ]);

	it(`should allow moving on free squares,
	or squares occupied by adversary pieces only, in order to capture,
	not out of the chessboard
	`, () => {
		knight.checkMove();
	  expect(knight.allowedSquares).toEqual([{ y: 4, x: 5 }, { y: 3, x: 6 }, { y: 6, x: 5 }]);
	});
  });

