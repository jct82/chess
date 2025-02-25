
export function fenToGame(fen:string) {
	let lines:string[] = fen.split(' ');
	const squares = lines[0];
	const color = lines[1];
	const castles = lines[2];
	const enPassant = lines[3];
	const lastHit = lines[4];
	const moves = lines[5];
	return({
		squares: toBoard(squares),
		color: color === 'b' ? true : false,
		castles,
		enPassant,
		lastHit: Number(lastHit),
		moves: Number(moves)
	});
}

export function toPlay(fen:string) {
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