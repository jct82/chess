'use client'
import { useRef, useEffect, useState } from 'react';
import { getGame, setGame } from '@/utils/fentoboard';

import Piece from '@/pieces/Piece';
import King from '@/pieces/figures/figureAxis/King';
import Queen from '@/pieces/figures/figureAxis/Queen';
import Bishop from '@/pieces/figures/figureAxis/Bishop';
import Knight  from '@/pieces/figures/Knight';
import Rook from '@/pieces/figures/figureAxis/Rook';
import Pawn from '@/pieces/Pawn';

import ChessBoard from '@/components/ChessBoard';
import { JSX } from 'react/jsx-runtime';

export default function AddUser() {
    const boardRef: any = useRef(null);

    let [piecesArray, setPiecesArray] = useState<Array<string[]>>(getGame());
    let currentPiecesArray: Array<string[]> = piecesArray.map((line: string[]) => (line.map((square: string) => square)));

    let [whitePlayin, setWhitePlayin] = useState<boolean>(true);
    let [playerWhite, setPlayerWhite] = useState<Piece[]>([]);
    let [playerBlack, setPlayerBlack] = useState<Piece[]>([]);
    let [selected, setSelected] = useState<Piece>({} as Piece);
    let [mat, setMat] = useState<boolean>(false);
    let [pat, setPat] = useState<boolean>(false);
    let clickedPiece = selected;
    
    let [clickedInBoard, setClickedInBoard] = useState<boolean>(false);

    let currentPosDown: number[] = [0, 0];
	let [lastPosDown, setLastPosDown] = useState<number[]>([0, 0]);
	let currentPosUp: number[] = [0, 0];

	const unit = 500 / 8;

	useEffect(() => {
		boardRef.current.addEventListener('mousedown', checkPosDown);
		boardRef.current.addEventListener('mouseup', checkPosUp)
		return () => {
			boardRef.current.removeEventListener('mousedown', checkPosDown);
			boardRef.current.removeEventListener('mouseup', checkPosUp);
		};
	}, [clickedInBoard]);

    useEffect(() => {
        setPlayers();
        isPat((playerWhite.find(p => p instanceof King) as King), playerWhite);
        isPat((playerBlack.find(p => p instanceof King) as King), playerBlack);
	}, []);

    /**
     * Initialise players array with pieces
     */
    const setPlayers = () => {    
        let white = playerWhite;
        let black = playerBlack;
        piecesArray.forEach((line, lIdx) => line.forEach((square, sqIdx) => {
            if (square !== ' ') {
                const isWhite = square === square.toUpperCase() ? true : false;
                switch (square.toUpperCase()) {
                    case 'R':
                        isWhite ? 
                        white.push(new Rook({y: lIdx, x: sqIdx}, true)) :
                        black.push(new Rook({y: lIdx, x: sqIdx}, false)) ;
                        break;
                    case 'N':
                        isWhite ? 
                        white.push(new Knight({y: lIdx, x: sqIdx}, true)) :
                        black.push(new Knight({y: lIdx, x: sqIdx}, false)) ;
                        break;
                    case 'B':
                        isWhite ? 
                        white.push(new Bishop({y: lIdx, x: sqIdx}, true)) :
                        black.push(new Bishop({y: lIdx, x: sqIdx}, false)) ;
                        break;
                    case 'K':
                        isWhite ? 
                        white.push(new King({y: lIdx, x: sqIdx}, true)) :
                        black.push(new King({y: lIdx, x: sqIdx}, false)) ;
                        break;
                    case 'Q':
                        isWhite ? 
                        white.push(new Queen({y: lIdx, x: sqIdx}, true)) :
                        black.push(new Queen({y: lIdx, x: sqIdx}, false)) ;
                        break;
                    case 'P':
                        isWhite ? 
                        white.push(new Pawn({y: lIdx, x: sqIdx}, true)) :
                        black.push(new Pawn({y: lIdx, x: sqIdx}, false)) ;
                        break;
                    default:
                }
                setPlayerWhite(white);
                setPlayerBlack(black);
            }
        }));
    }

    /**
     * Get position of mouse when clicked down then poster optional squares
     * @param e mouseDown event
     */
	const checkPosDown = (e: MouseEvent) => {
        currentPosDown = [Math.floor(e.clientX / unit), Math.floor(e.clientY / unit)]
		setLastPosDown(currentPosDown);
        setClickedInBoard(true);
        checkPieceMoves();
	}

    /**
     * Get position of mouse when click release then apply move to board if authorised
     * @param e mouseUp event
     */
	const checkPosUp = (e: MouseEvent) => {
        if (!clickedInBoard) return;
		currentPosUp = [Math.floor(e.clientX / unit), Math.floor(e.clientY / unit)];
        movePiece();
        setClickedInBoard(false);
	}
    
    // async function getNextMove(formData: FormData, url = 'https://stockfish.online/api/s/v2.php', conf = 'rn1q1rk1/pp2b1pp/2p2n2/3p1pB1/3P4/1QP2N2/PP1N1PPP/R4RK1 b - - 1 11') {
    //     'use server'
    //     fetch(`${url}?fen=${conf}&depth=12`).then(response => response.json()).then(response => console.log('OOOOOOOOOOOOO', response));
    // }

    /**
     * Transcript pieces position on board with allowed square moves of selected piece
     * @returns JSX of positioned pieces on board
     */
    const designMoves = () : JSX.IntrinsicElements => {
        let orderedOptions = clickedPiece.allowedSquares.sort((a, b) => (a.y - b.y ||  a.x - b.x));
        let optionsId = 0;
        return currentPiecesArray.map( (line, idxY) => {
            let playableY = orderedOptions[optionsId]?.y === idxY ? true : false;
            return (
            <div key={idxY} className="pieces-line line">
                {line.map( (square, idxX) => {
                    let playable:boolean = playableY && orderedOptions[optionsId]?.x === idxX ? true : false;
                    if (playable) {
                        optionsId++;
                        playableY = orderedOptions[optionsId]?.y === idxY ? true : false
                    }
                    return (<div className={`${square} ${playable ? 'point' : ''} square`}></div>)
                })}
            </div>)}
        )
    }

    /**
     * Transcript pieces position on board
     * @returns JSX of positioned pieces on board
     */
    const designPieces = () => {
        return currentPiecesArray.map( line => (
            <div className="pieces-line line">
                {line.map(square => (<div className={`${square} square`}></div>))}
            </div>)
        )
    }

    const [chessPieces, setChessPieces]: any = useState(designPieces());

    /**
     * Get clicked piece on board if it's color turn
     * @returns nothing
     */
    const checkPieceMoves = () => {
        let currentPlayer: Piece[] = whitePlayin ? playerWhite : playerBlack;
        clickedPiece = currentPlayer.find(p => `${p.pos.y}${p.pos.x}` === `${currentPosDown[1]}${currentPosDown[0]}`)!;
        if (!clickedPiece) return;
        setSelected(clickedPiece);
        setChessPieces(designMoves());
    }

    /**
     * Check if king of player is checkmate
     * @param king 
     * @param player 
     */
    const isMat = (king: King, player: Piece[]) => {
        let allowedToMove = false;
        king.chess = true;
        // faire opposition
        let chessWays = king.threats.filter(th => th.fulfilled === true);
        if (chessWays.length <= 1) {
            let chessWay = [...chessWays[0].axis.map(pos => pos.join('')), chessWays[0].pos.join('')];
            for (const [idx,pl] of player.entries()) {
                if (pl instanceof King || king.fulfillThreat({y:pl.pos.y, x:pl.pos.x})) continue;
                pl.checkMove();
                player[idx].allowedSquares = pl.allowedSquares.filter(pos => chessWay.indexOf(`${pos.y}${pos.x}`) >= 0);
                if (player[idx].allowedSquares.length > 0) allowedToMove = true;
            }
        }
        king.checkMove();
        if (!allowedToMove && king.allowedSquares.length === 0) setMat(true);
    }

    /**
     * Check if stalemate
     * @param king 
     * @param player 
     */
    const isPat = (king: King, player: Piece[]) => {
        let allowedToMove = false;
        for (const [idx,pl] of player.entries()) {
            if (!(pl instanceof King) && king.fulfillThreat({y:pl.pos.y, x:pl.pos.x})) continue;
            pl.checkMove();
            if (player[idx].allowedSquares.length > 0) allowedToMove = true;
        }
        if (!allowedToMove) setPat(true);
    }

    /**
     * Move piece and update chessboard if square move allowed, than pieces positions and game situation
     */
    const movePiece = () => {
        const newX = currentPosUp[0];
        const newY = currentPosUp[1];
        const prevX = lastPosDown[0];
        const prevY = lastPosDown[1];
        if (selected.allowedSquares.map(a => `${a.y}${a.x}`).indexOf(`${newY}${newX}`) >= 0) {
            const currentPlayer: Piece[] = whitePlayin ? playerWhite : playerBlack; 
            const adversaryPlayer: Piece[] = whitePlayin ? playerBlack : playerWhite; 
            const myKing: King = currentPlayer.find(p => p instanceof King) as King;
            const king: King = adversaryPlayer.find(p => p instanceof King) as King;
            // If was in chess, cancel chess
            if (myKing.chess) myKing.chess = !myKing.chess;
            // If chess threat piece moves remove corresponding chess threat
            king.removeThreat(currentPiecesArray[prevY][prevY].toUpperCase(), {y: prevY, x: prevX});
            // Remove eaten piece and corresponding chess threat
            adversaryPlayer.find((p, idx) => {
                if (`${p.pos.y}${p.pos.x}` === `${newY}${newX}`) {
                    adversaryPlayer.splice(idx, 1);
                    myKing.removeThreat(currentPiecesArray[newY][newX].toUpperCase(), {y: newY, x: newX});
                    return p;
                }
            }); 
            // Update positions array
            currentPiecesArray[newY][newX] = currentPiecesArray[selected.pos.y][selected.pos.x];
            currentPiecesArray[prevY][prevX] = ' ';
            setGame(currentPiecesArray);
            setPiecesArray(currentPiecesArray);
            // Update position of moved piece
            currentPlayer.find((p, idx) => {
                if (`${p.pos.y}${p.pos.x}` === `${selected.pos.y}${selected.pos.x}`) {
                    currentPlayer[idx].pos = {y:newY, x:newX};
                    return p;
                }
            });

            if (selected instanceof King) selected.checkChess({y:newY, x:newX});

            const threatFulfilled = king.fulfillThreat({y:prevY, x: prevX}, false);
            const isChess = king.checkChess({y:newY, x:newX});
            (threatFulfilled || isChess) ? isMat(king, adversaryPlayer) : isPat(king, adversaryPlayer);
            setWhitePlayin(!whitePlayin);
        }
        setChessPieces(designPieces());
    }
    
    return(
        <div ref={boardRef} className='chess-page'>
            <ChessBoard/>
            <div className='pieces-board board'>
                {chessPieces}
            </div>
            {mat &&
                <div className="mat">
                    MAT
                    <div className="winner">{whitePlayin ? 'Les noirs' : 'Les blancs'} ont gagné</div>
                </div>
            }
            {pat &&
                <div className="mat">
                    PAT
                    <div>Match nul</div>
                </div>
            }
        </div>
    )
}