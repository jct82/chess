const designLine = (rank: number) => {
	let i = 0;
	let JSXBoardLine = [];
	while (i < 8) {
		let darked = i % 2 ? true : false;
		if (rank % 2) darked = !darked;
		JSXBoardLine.push(
			<div className={`chess-board-square square ${darked ? 'black' : 'white'}`}>
				{i === 0 && <span className="ordinate">{Math.abs(rank - 8)}</span>}
				{rank === 7 && <span className="abscissa">{String.fromCharCode(i + 65)}</span>}
			</div>
		);
		i++;
	}
	return JSXBoardLine;
}

export default function ChessBoard() {
	let i = 0;
	let JSXBoard = [];
	while (i < 8) {
		JSXBoard.push(<div className='chess-board-line line'>{designLine(i)}</div>);
		i++;
	}
	return (
		<div className='chess-board board'>
			{JSXBoard}
		</div>
	)
}
