import {describe, expect} from '@jest/globals';
import Bishop from "@/pieces/figures/figureAxis/Bishop";
import { setGame } from '@/utils/globals';

describe('Bishop', () => {
	// Setup pieces
	const bishop = new Bishop({y:4, x:4}, true);	  
	setGame([
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 0
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 1
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 2
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 3
		[' ', ' ', ' ', ' ', 'B', ' ', ' ', ' '], // Row 4
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 5
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 6
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']  // Row 7
	  ]);

	it(`Should allow moves only on diagonals axis of bishop position`, () => {
		bishop.checkMove();
		bishop.allowedSquares.forEach( as => {
			expect((as.y - as.x === bishop.pos.y - bishop.pos.x) || (as.y + as.x === bishop.pos.y + bishop.pos.x)).toBeTruthy();
		});
	});
  });

