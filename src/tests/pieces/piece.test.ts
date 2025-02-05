import {describe, expect, test} from '@jest/globals';
import Pawn from "@/pieces/Pawn";


const piece = new Pawn({y:1, x:4}, false);

test('position y:7 x:4 is equal to K', () => {
	expect(piece.getSquare({y:7, x:4})).toBe('K');
  });

  test('is white king adversary piece of black pawn ?', () => {
	const piece = new Pawn({y:1, x:4}, false);
	expect(piece.isAdversaryPiece('K')).toBeTruthy();
  });