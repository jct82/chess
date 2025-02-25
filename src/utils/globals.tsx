import { game, EnPassant } from './Models';
import { toBoard } from './fentoboard';

export let gameMap: game = toBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');
// export let gameMap: game = [];

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
	pos: {y:8, x:8}
}

/**
 * After pawn performed two squares move, show that it can possibly be eaten by en passant move
 * @param ep 
 */
export const setEnPassant = (ep: EnPassant) => {
	enPassant = {...ep}
}

/**
 * Update squares array game
 * @param game new chessboard squares array of string
 */
 export function parseCastles(castle: string) {
	let i = 0;
	let txt = castle;
	let newCastles = ['00', '00'];
	while (i < castle.length) {
		const c = txt.charAt(i);
		if (c === 'K') newCastles[0] = '1' + newCastles[0].slice(-1);
		else if (c === 'Q') newCastles[0] = newCastles[0].slice(0, 1) + '1';
		else if (c === 'k') newCastles[1] = '1' + newCastles[1].slice(-1);
		else if (c === 'q') newCastles[1] = newCastles[1].slice(0, 1) + '1';
		i++;
	};
	return newCastles;
}
