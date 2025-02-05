import {describe, expect} from '@jest/globals';
import Rook from "@/pieces/figures/figureAxis/Rook";
import { setGame } from '@/utils/fentoboard';

describe('Rook', () => {
	// Setup pieces
	const rook = new Rook({y:4, x:4}, true);	  
	setGame([
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 0
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 1
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 2
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 3
		[' ', ' ', ' ', ' ', 'R', ' ', ' ', ' '], // Row 4
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 5
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 6
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']  // Row 7
	  ]);

	it(`Should allow moves only on vertical axis or horizontal axis of rook position`, () => {
		rook.checkMove();
		rook.allowedSquares.forEach( as => {
			expect(as.y === rook.pos.y || as.x === rook.pos.x).toBeTruthy();
		});
	});
  });

