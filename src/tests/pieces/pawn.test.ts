import {describe, expect, test} from '@jest/globals';
import Pawn from "@/pieces/Pawn";
import { enPassant, setEnPassant, setGame } from '@/utils/globals';

describe('Pawn', () => {
	// Setup pieces
	setEnPassant({is: true, pos: {y:3, x:6}});
	const pawn = new Pawn({y:1, x:4}, false);	  
	const whitePawn = new Pawn({ y: 6, x: 1 }, true);  // White pawn at y=6, x=1
	const blackPawn = new Pawn({ y: 1, x: 1 }, false); // Black pawn at y=1, x=1
	const enPassantPawn = new Pawn({ y: 3, x: 5 }, true); // Black pawn at y=3, x=5
	setGame([
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 0
		[' ', 'p', ' ', ' ', ' ', ' ', ' ', ' '], // Row 1
		[' ', ' ', 'P', ' ', ' ', ' ', ' ', ' '], // Row 2
		[' ', ' ', ' ', ' ', ' ', 'P', 'p', ' '], // Row 3
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 4
		['b', ' ', 'B', ' ', ' ', ' ', ' ', ' '], // Row 5
		[' ', 'P', ' ', ' ', ' ', ' ', ' ', ' '], // Row 6 (White pawn start)
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']  // Row 7
	  ]);

	it(`should allow moving one square forward for a white pawn (bottom to top),
	should allow moving two squares forward from the starting position for a white pawn,
	should allow capturing diagonal but only adversary piece
	`, () => {
		whitePawn.checkMove();
	  expect(whitePawn.allowedSquares).toEqual([{ y: 5, x: 1 }, { y: 4, x: 1 }, { y: 5, x: 0 }]);
	});
  
	it(`should allow moving one square forward for a black pawn (top to bottom),
	should allow moving two squares forward from the starting position for a black pawn,
	should allow capturing diagonal but only adversary piece`, () => {
		blackPawn.checkMove();
	  expect(blackPawn.allowedSquares).toEqual([{ y: 2, x: 1 }, { y: 3, x: 1 },  { y: 2, x: 2 }]);
	});

	test("can't move on a square out of chessboard", () => {
		expect(pawn.validateMove({y:8, x:4})).toBeFalsy();
	});
	
	test("can't move diagonal on free square", () => {
		expect(pawn.validateMove({y:2, x:5})).toBeFalsy();
	});

	test("en passant move on y:6, x:2 should be proposed allow square", () => {
		enPassantPawn.checkMove();
		expect(enPassantPawn.allowedSquares).toEqual(expect.arrayContaining([{y: 2, x: 6}]));
	});
  });

