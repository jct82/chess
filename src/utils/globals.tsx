import { game, EnPassant } from './Models';
import { toBoard } from './fentoboard';

export let gameMap: game = toBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');

/**
 * Squares contain space if empty or letter corresponding to piece type.
 * Uppercase for White, lowercase for black
 * @returns chessboard squares array of string
 */
export function getGame() {
	return gameMap;
}

/**
 * Update squares array game
 * @param game new chessboard squares array of string
 */
export function setGame(game: game) {
	gameMap = game.map(line => [...line.map(square => square.slice())]);
}

/**
 * The pawn that can possibly be eaten by en passant move.
 * is: is there a pawn of the opponent in a position that allows him to perform en passant
 * pos: position of pawn threaten by en passant move
 */
export let enPassant: EnPassant = {
	is: false,
	pos: {x:8, y:8}
}

/**
 * After pawn performed two squares move, show that it can possibly be eaten by en passant move
 * @param ep 
 */
export const setEnPassant = (ep: EnPassant) => {
	enPassant = {...ep}
}
