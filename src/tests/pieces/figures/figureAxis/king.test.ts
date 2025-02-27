import {describe, expect} from '@jest/globals';
import King from "@/pieces/figures/figureAxis/King";
import { getGame, setGame } from '@/utils/globals';
import { game } from '@/utils/Models';

describe('Axis figure', () => {
	// Setup pieces
	const king = new King({y:4, x:4}, true);	  
	setGame([
		[' ', ' ', ' ', ' ', 'r', 'r', ' ', ' '], // Row 0
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 1
		[' ', ' ', 'p', ' ', ' ', ' ', ' ', ' '], // Row 2
		[' ', ' ', ' ', ' ', ' ', ' ', 'b', ' '], // Row 3
		[' ', 'P', ' ', ' ', 'K', ' ', 'p', ' '], // Row 4
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 5
		[' ', ' ', 'B', ' ', ' ', ' ', ' ', ' '], // Row 6
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ']  // Row 7
	  ]);
	  king.checkMove();

	it(`Should return allowed squares for king :
	all squares directly around king's position,
	but those which are chess threatened by adversary pieces`, () => {
		expect(king.allowedSquares).toEqual([{y:4,x:3}, {y:5,x:3}]);
	});

	it(`Would king be in chess by a pawn if moves to y:3, x:3`, () => {
		expect(king.pawnChess({y:3,x:3})).toBeTruthy();
	});

	it(`Would king be in chess by a bishop if moves to y:4, x:5`, () => {
		expect(king.bishopChess('b', {y:4,x:5}, true)).toBeTruthy();
	});

	it(`Would king be in chess by a rook if moves to y:4, x:5`, () => {
		expect(king.rookChess('r', {y:4,x:5}, true)).toBeTruthy();
	});

	it(`Is king in chess by a piece positioned on square y:0, x:4`, () => {
		expect(king.checkChess({y:0, x:4})).toBeTruthy();
	});

	it(`Is king in chess by a pawn`, () => {
		expect(king.pawnChess()).toBeFalsy();
	});

	it(`Is king in chess by a bishop`, () => {
		expect(king.bishopChess('b')).toBeFalsy();
	});

	it(`Is king in chess by a rook`, () => {
		expect(king.rookChess('r')).toBeTruthy();
	});

	it(`Is king in chess by a queen`, () => {
		expect(king.bishopChess('q') || king.rookChess('q')).toBeFalsy();
	});

	it(`Is king in chess by a knight`, () => {
		expect(king.bishopChess('n')).toBeFalsy();
	});
});

describe('King figure', () => {
	// Setup pieces
	const king = new King({y:7, x:4}, true, false, [{y:7, x: 0}, {y:7, x: 7}]);
	const castleGame = [
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 0
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 1
		[' ', ' ', ' ', ' ', 'r', ' ', ' ', ' '], // Row 2
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 3
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 4
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 5
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 6
		['R', ' ', ' ', ' ', 'K', ' ', ' ', 'R']  // Row 7
	  ]
	  const castleGame2 = [
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 0
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 1
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 2
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 3
		[' ', ' ', ' ', ' ', ' ', 'b', ' ', ' '], // Row 4
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 5
		[' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '], // Row 6
		['R', ' ', ' ', ' ', 'K', ' ', ' ', 'R']  // Row 7
	  ]

	it(`King shouldn't be able to castle`, () => {
		expect(king.castle(castleGame).length === 0).toBeTruthy();
	});

	it(`King should be able to castle on the right `, () => {
		const castlePositions = king.castle(castleGame2);
		expect(castlePositions).toEqual(expect.arrayContaining([{y:7, x: 6}]));
	});
});


