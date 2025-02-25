'use client'
import { memo, useEffect, useState } from 'react';
import { getGame, setGame, setEnPassant, parseCastles } from '@/utils/globals';
import { fenToGame } from '@/utils/fentoboard';

import Game from '@/Game';
import Piece from '@/pieces/Piece';
import King from '@/pieces/figures/figureAxis/King';

import ChessBoard from '@/components/ChessBoard';
import PiecesBoard from '@/components/PiecesBoard';
import PositionBoard from '@/components/PositionBoard';
import TransformStripe from '@/components/TransformStripe';
import WritePos from '@/components/WritePos';

let currentPosDown: number[] = [0, 0];
let currentPosUp: number[] = [0, 0];
let clickedInBoard = false;
const {squares, color, castles, enPassant, lastHit, moves} = fenToGame('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 0');
let game: Game = new Game(squares, {} as Piece, color, false, false, lastHit, moves);
if (enPassant !== '-') setEnPassant({is: true, pos:{y:Number(enPassant.charAt(1)), x:Number(enPassant.charCodeAt(1)) - 97}});
const newCastles = parseCastles(castles);

export default function AddBoard() {
    const [gameCourse, setgameCourse] = useState<string>('');
    const player = game.whitePlayin ? game.white : game.black;
    const opponent = game.whitePlayin ? game.black : game.white;
    setGame(game.squares);
	const unit = 500 / 8;

    useEffect(() => {
        const myKing = player.find(p => p instanceof King) as King;
        const king = opponent.find(p => p instanceof King) as King;
        myKing.initCastling(newCastles[0]);
        king.initCastling(newCastles[1]);
        game.isPat(myKing, player);
        game.isPat(king, opponent);
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
    
    // getNextMove();
    // async function getNextMove(url = 'https://stockfish.online/api/s/v2.php', conf = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq - 0 0', depth = 2) {
    //     fetch(`${url}?fen=${conf}&depth=${depth}`).then(response => response.json()).then(response => console.log('OOOOOOOOOOOOO', response));
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

    /**
     * Transform pawn arrived on last line in piece type selected 
     * @param e  mouseClick event
     */
    const transformPawn = (e: React.MouseEvent<Element, MouseEvent>) => {
        const pieceType: string = Array.from((e.target as HTMLInputElement).classList).filter(c => (c!== 'piece'))[0];
        const king = opponent.find(p => p instanceof King) as King;
        const oldPos = {y: Number(gameCourse.slice(-4, -3)), x:Number(gameCourse.slice(-5, -4))};
        const newPos = {y: Number(gameCourse.slice(-2, -1)), x:Number(gameCourse.slice(-1))};
        game.pawnToPiece(player, pieceType);
        game.setNextRound(opponent, king, newPos, !!king.fulfillThreat(oldPos));
        setgameCourse(gameCourse + `=${pieceType}`);
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
            {game.transform && <TransformStripe colorWhite={game.whitePlayin} selectPiece={transformPawn}/>}
        </div>
        {gameCourse.length > 0 && <WritePos course={gameCourse} />}
        </>
    )
}