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

function addEmptySquare (ch:string) {
	let charArray = [];
	let loop = Number(ch);
	while (loop > 0) {
		charArray.push(' ');
		loop--;
	}
	return charArray;
}

export function toFen(chessBoard:Array<string[]>) {
	 const fenLines = chessBoard.map(line => parseFen(line));
	 const fenBoard = fenLines.join('/');
	// return fenBoard;
}

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