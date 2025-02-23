import { useState } from 'react';
import { game } from '@/utils/Models';
import Game from '@/Game';
type PlayerProps = { 
    game: Game,
    clickDown: (e: React.MouseEvent<Element, MouseEvent>) => boolean,
    clickUp: (e: React.MouseEvent<Element, MouseEvent>) => void
};

export default function PositionBoard({ game, clickDown, clickUp }: PlayerProps) {
    const positions = game?.selected?.allowedSquares;
    const pieces: game = game.squares.map(l => l.map(sq => sq));
    positions && positions.forEach(sq => {pieces[sq.y][sq.x] = 't'});
    const [showPos, setShowPos] = useState(false);
    const enablePosBord = (e: React.MouseEvent<Element, MouseEvent>) => {
        if (clickDown(e)) setShowPos(true);
    }
    const disablePosBord = (e: React.MouseEvent<Element, MouseEvent>) => {
        clickUp(e);
        setShowPos(false);
    }
	return (<div className={`position-board board ${showPos ? 'on' : ''}`}
            onMouseDown={enablePosBord} 
            onMouseUp={disablePosBord}>
        {pieces.map( (line, id) => (
            <div key={`line${id}`} className="position-line line">
                {line.map((square, ids) => (<div  key={`square${ids}`} className={`${square === 't' ? square : ''} square`}></div>))}
            </div>)
        )}
    </div>)
}
