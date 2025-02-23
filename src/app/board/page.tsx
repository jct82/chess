'use client'
import { memo, useEffect, useState } from 'react';
import { getGame, setGame } from '@/utils/globals';
import { courseToJSX } from '@/utils/writePos';

import Game from '@/Game';
import Piece from '@/pieces/Piece';
import King from '@/pieces/figures/figureAxis/King';

import ChessBoard from '@/components/ChessBoard';
import PiecesBoard from '@/components/PiecesBoard';
import PositionBoard from '@/components/PositionBoard';

let currentPosDown: number[] = [0, 0];
let currentPosUp: number[] = [0, 0];
let clickedInBoard = false;
let game: Game = new Game(getGame(), {} as Piece, true, false, false);

export default function AddBoard() {
    const [gameCourse, setgameCourse] = useState<string>('');
    const player = game.whitePlayin ? game.white : game.black;
    const opponent = game.whitePlayin ? game.black : game.white;
    setGame(game.squares);
	const unit = 500 / 8;

    useEffect(() => {
        game.isPat((player.find(p => p instanceof King) as King), player);
        game.isPat((opponent.find(p => p instanceof King) as King), opponent);
	}, []);

    /**
     * Get position of mouse when clicked down then poster optional squares
     * @param e mouseDown event
     */
	const checkPosDown = (e: React.MouseEvent<Element, MouseEvent>) : boolean => {
        currentPosDown = [Math.floor(e.clientX / unit), Math.floor(e.clientY / unit)];
        if (!checkPieceMoves()) return false;
        clickedInBoard = true;
        return true;
	}

    /**
     * Get position of mouse when click release then apply move to board if authorised
     * @param e mouseUp event
     */
	const checkPosUp = (e: React.MouseEvent<Element, MouseEvent>) : void => {
        if (!clickedInBoard) return;
		currentPosUp = [Math.floor(e.clientX / unit), Math.floor(e.clientY / unit)];
        movePiece();
        clickedInBoard = false;
	}
    
    // async function getNextMove(formData: FormData, url = 'https://stockfish.online/api/s/v2.php', conf = 'rn1q1rk1/pp2b1pp/2p2n2/3p1pB1/3P4/1QP2N2/PP1N1PPP/R4RK1 b - - 1 11') {
    //     'use server'
    //     fetch(`${url}?fen=${conf}&depth=12`).then(response => response.json()).then(response => console.log('OOOOOOOOOOOOO', response));
    // }

    /**
     * Get clicked piece on board if it's color turn
     * @returns boolean = true if valid click on allowed piece
     */
    const checkPieceMoves = () => {
        const clicked = player.find(p => `${p.pos.y}${p.pos.x}` === `${currentPosDown[1]}${currentPosDown[0]}`)!;
        if (!clicked || clicked.allowedSquares.length === 0) return false;
        game.selected = clicked;
        return true;
    }

    /**
     * Move piece and update chessboard if square move allowed, than pieces positions and game situation
     */
    const movePiece = () => {
        const newX = currentPosUp[0];
        const newY = currentPosUp[1];
        if (game.selected.allowedSquares.map(a => `${a.y}${a.x}`).indexOf(`${newY}${newX}`) >= 0) {
            game.updateGame(newY, newX);
            setgameCourse(gameCourse + `${gameCourse.length > 0 ? '_' : ''}${game.selected.constructor.name}.${currentPosDown[1]}${currentPosDown[0]}-${newY}${newX}`);
        }
    }
    
    return(
        <>
        <div className='chess-page'>
            memo(<ChessBoard/>);
            <PositionBoard game={game} clickDown={checkPosDown}  clickUp={checkPosUp}/>
            <PiecesBoard pieces={game.squares} />
            {game.mat && <div className="mat">
                MAT
                <div className="winner">{game.whitePlayin ? 'Les noirs' : 'Les blancs'} ont gagné</div>
            </div>}
            {game.pat && <div className="mat">
                PAT
                <div>Match nul</div>
            </div>}
        </div>
        <div className="course">{courseToJSX(gameCourse)}</div>
        </>
    )
}