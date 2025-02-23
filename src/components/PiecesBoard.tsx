type PlayerProps = { pieces: string[][] };

export default function PiecesBoard({pieces}: PlayerProps) {
	return (
		<div className='pieces-board board'>
			{pieces.map( (line, id) => (
				<div key={`line${id}`} className="pieces-line line">
					{line.map((square, ids) => (<div  key={`square${ids}`} className={`${square} square`}></div>))}
				</div>)
			)}
		</div>)
}
