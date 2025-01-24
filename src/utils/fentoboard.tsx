import { game } from './Models';

let gameMap: game = toBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');

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
 * Convert chess game from fen string to array characters array
 * @param fen string of characters corresponding to chessgame map
 * @returns squares array of string characters corresponding to chessgame map
 */
export function toBoard(fen:string) {
	let lines:string[] = fen.split('/');
	let lastLine:string = lines[lines.length - 1];
	if (lines[lines.length - 1].indexOf(' ') > 0) {
		lines[lines.length - 1] = lastLine.substring(0, lastLine.indexOf(' '));
		let partyInfo:string = lastLine.substring(lastLine.indexOf(' ') + 1);	
	}
	const chessBoard: Array<string[]> = lines.map(l => {
		const newLine = l.split('');
		let squareLine = [];
		for (const ch of newLine) {
			(ch.charCodeAt(0) > 48 && ch.charCodeAt(0) < 57) ? squareLine.push(...addEmptySquare(ch)) : squareLine.push(ch);
		}
		return squareLine
	});
	return chessBoard;
}

/**
 * convert empty squares in space characters
 * @param ch string character
 * @returns array of space character
 */
function addEmptySquare(ch:string) {
	let charArray = [];
	let loop = Number(ch);
	while (loop > 0) {
		charArray.push(' ');
		loop--;
	}
	return charArray;
}

/**
 * Convert chess game from array characters array to fen string
 * @param chessBoard array string characters array
 */
export function toFen(chessBoard:Array<string[]>) {
	 const fenLines = chessBoard.map(line => parseFen(line));
	 const fenBoard = fenLines.join('/');
	return fenBoard;
}

/**
 * Convert characters array corresponding to chessbord line of squares
 * @param boardLine string characters array
 * @returns fen string part corresponding to chessbord line of squares
 */
function parseFen(boardLine: string[]) {
	let fenString = '';
	let nbr = 0;
	for (const [i, square] of boardLine.entries()) {
		if (square === ' ') {
			nbr++;
			if (i === boardLine.length - 1) {
				fenString += nbr;
				nbr = 0;
			} 
		} else {
			if (nbr > 0) {
				fenString += nbr;
				nbr = 0;
			} 
			fenString += square;
		}
	}
	return fenString;
}