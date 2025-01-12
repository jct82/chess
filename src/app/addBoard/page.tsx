'use client'
import { useRef, useEffect, useState } from 'react';
import { connectToDB } from '@/lib/mongo';
import { toBoard } from '@/components/fentoboard';

interface piecePos {
    y: number;
    x: number;
}

interface threat {
    pos: number[],          // position of piece that threats the king
    color: boolean,         // color of piece that threats the king
    axis: Array<number[]>   // positions of axis [y, x]
}

interface defeatChess {
    pos: number[],
    moves: Array<number[]>
}

export default function AddUser() {
    const boardRef: any = useRef(null);

    let [piecesArray, setPiecesArray] = useState<Array<string[]>>(toBoard('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'));
    let currentPiecesArray: Array<string[]> = piecesArray.map((line: string[]) => (line.map((square: string) => square)));;
    
    let [clickedInBoard, setClickedInBoard] = useState<boolean>(false);

    let [allowedSquares, setAllowedSquares] = useState<Array<number[]>>([]);
    let freeSquares: Array<number[]> = allowedSquares.map((coor: number[]) => (coor.map((pos: number) => pos)));

    let currentPosDown: number[] = [0, 0];
	let [lastPosDown, setLastPosDown] = useState<number[]>([0, 0]);
	let currentPosUp: number[] = [0, 0];
	let [lastPosUp, setLastPosUp] = useState<number[]>([0, 0]);

    let [threats, setThreats] = useState<threat[]>([]);
    let currentThreats: threat[] = threats;

    let [chessRange, setChessRange] = useState<Array<Array<number[]>>>([]);
    let currentChessRange: Array<Array<number[]>> = chessRange;

    let [inCheck, setInCheck] = useState<boolean>(false);
    let currentCheck: boolean = inCheck;

    let [checkOut, setCheckout] = useState<defeatChess[]>([]);
    let currentCheckOut = checkOut;

    const [isMat, setMat] = useState<boolean>(false);
    const [isPat, setPat] = useState<boolean>(false);
	const unit = 500 / 8;

	useEffect(() => {
		boardRef.current.addEventListener('mousedown', checkPosDown);
		boardRef.current.addEventListener('mouseup', checkPosUp)
		return () => {
			boardRef.current.removeEventListener('mousedown', checkPosDown);
			boardRef.current.removeEventListener('mouseup', checkPosUp);
		};
	}, [clickedInBoard]);

	const checkPosDown = (e:Event) => {
        currentPosDown = [Math.floor(e.clientX / unit), Math.floor(e.clientY / unit)]
		setLastPosDown(currentPosDown);
        setClickedInBoard(true);
        checkPieceMoves();
	}

	const checkPosUp = (e:Event) => {
        if (!clickedInBoard) return;
		currentPosUp = [Math.floor(e.clientX / unit), Math.floor(e.clientY / unit)];
        movePiece();
        setClickedInBoard(false);
        setAllowedSquares([]);
	}

    // Design chessboard
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

    const designBoard = () => {
        let i = 0;
        let JSXBoard = [];
        while (i < 8) {
            JSXBoard.push(<div className='chess-board-line line'>{designLine(i)}</div>);
            i++;
        }
        return JSXBoard;
    }
    
    // async function getNextMove(formData: FormData, url = 'https://stockfish.online/api/s/v2.php', conf = 'rn1q1rk1/pp2b1pp/2p2n2/3p1pB1/3P4/1QP2N2/PP1N1PPP/R4RK1 b - - 1 11') {
    //     'use server'
    //     fetch(`${url}?fen=${conf}&depth=12`).then(response => response.json()).then(response => console.log('OOOOOOOOOOOOO', response));
    // }

    // Transcript pieces position on board with allowed square moves of selected piece
    const designMoves = () => {
        setAllowedSquares(freeSquares);
        let orderedFreeSquares: Array<number[]> = freeSquares.map((coor: number[]) => (coor.map((pos: number) => pos)));
        orderedFreeSquares = orderedFreeSquares.sort((a, b) => (a[1] - b[1] ||  a[0] - b[0]));
        let isPlaying = orderedFreeSquares.length > 0;
        let selected = 0;
        return currentPiecesArray.map( (line, idxY) => {
            let playableY = isPlaying && orderedFreeSquares[selected] && orderedFreeSquares[selected][1] === idxY ? true : false;
            return (
            <div key={idxY} className="pieces-line line">
                {line.map( (square, idxX) => {
                    let playable:boolean = playableY && orderedFreeSquares[selected][0] === idxX ? true : false;
                    if (playable) {
                        selected++;
                        playableY = isPlaying && orderedFreeSquares[selected] && orderedFreeSquares[selected][1] === idxY ? true : false;
                    }
                    return (<div className={`${square} ${playable ? 'point' : ''} square`}></div>)
                })}
            </div>)}
        )
    }

    // Transcript pieces position on board
    const designPieces = () => {
        return currentPiecesArray.map( line => (
            <div className="pieces-line line">
                {line.map(square => (<div className={`${square} square`}></div>))}
            </div>)
        )
    }

    const [chessPieces, setChessPieces]: any = useState(designPieces());

    // Check if square is occupied by adversary or current player
    const isAdversaryPiece = (square: string, pieceColor:boolean) => {
        let squareColor = square === square.toUpperCase() ? true : false;
        return squareColor === pieceColor ? false : true;
    }

    // Check if piece can occupy or cross square => Scan axis (tower / bishop / queen)
    const filterFreeSquares = (squares: string[], color: boolean) => {
        let i = 0;
        let newSquares = [];
        while (squares[i] === ' ') {
            newSquares.push(squares[i]);
            i++;
        }
        if (squares[i] && isAdversaryPiece(squares[i], color)) newSquares.push(squares[i]);
        return newSquares;
    }

    // Check if pawn can move diagonally => eat move
    const validatePawnMove = (pos: piecePos, color:boolean) => {
        if (!currentPiecesArray[pos.y] || !currentPiecesArray[pos.y][pos.x]) return false;
        let square = currentPiecesArray[pos.y][pos.x];
        return (square !== ' ' && isAdversaryPiece(square, color));
    }

    // Check if piece can occupy square (knight / king)
    const validateMove = (pos: piecePos, color:boolean) => {
        if (!currentPiecesArray[pos.y] || !currentPiecesArray[pos.y][pos.x]) return false;
        let square = currentPiecesArray[pos.y][pos.x];
        return (square === ' ' || isAdversaryPiece(square, color));
    }

    // Compile allowed square moves for pawn
    const checkPawnMove = (y: number, x: number, color: boolean) => {
        let dir = color ? -1 : 1;
        if (currentPiecesArray[y + dir][x] === ' ') freeSquares.push([x, y + dir]);
        if (y === (color ? 6 : 1) &&
        currentPiecesArray[y + (dir * 2)][x] === ' ') freeSquares.push([x, y + (dir * 2)]);
        const frontLeft: piecePos = {y:y + dir, x:x - 1};
        if (validatePawnMove(frontLeft, color)) freeSquares.push([frontLeft.x, frontLeft.y]);
        const frontRight: piecePos = {y:y + dir, x:x + 1};
        if (validatePawnMove(frontRight, color)) freeSquares.push([frontRight.x, frontRight.y]);
    }

    // Compile allowed square moves for rook
    const checkRookMove = (y: number, x: number, color: boolean) => {
        let squaresLeft = currentPiecesArray[y].filter((sq, idx) => idx < x).reverse();
        squaresLeft = filterFreeSquares(squaresLeft, color);
        squaresLeft.forEach((sq, idx) => {
            freeSquares.push([x - (idx + 1), y]);
        });
        let squaresRight = currentPiecesArray[y].filter((sq, idx) => idx > x);
        squaresRight = filterFreeSquares(squaresRight, color);
        squaresRight.forEach((sq, idx) => {
            freeSquares.push([x + (idx + 1), y]);
        });
        let squaresTop = currentPiecesArray.map(line => line[x]).filter((sq, idx) => idx < y).reverse();
        squaresTop = filterFreeSquares(squaresTop, color);
        squaresTop.forEach((sq, idx) => {
            freeSquares.push([x, y - (idx + 1)]);
        });
        let squaresBottom = currentPiecesArray.map(line => line[x]).filter((sq, idx) => idx > y);
        squaresBottom = filterFreeSquares(squaresBottom, color);
        squaresBottom.forEach((sq, idx) => {
            freeSquares.push([x, y + (idx + 1)]);
        });
    }

    // Compile allowed square moves for bishop
    const checkBishopMove = (y: number, x: number, color: boolean) => {
        let squaresLeftTopToRight: string[] = currentPiecesArray.map((line, idx) => line[(x - y + idx)] || 'NO');
        let squaresLeftTop = squaresLeftTopToRight.slice(0, y).filter(sq => sq !== 'NO').reverse();
        squaresLeftTop = filterFreeSquares(squaresLeftTop, color);
        squaresLeftTop.forEach((sq, idx) => {
            freeSquares.push([x - (idx + 1), y - (idx + 1)]);
        });
        let squaresRightBottom = squaresLeftTopToRight.slice(y + 1).filter(sq => sq !== 'NO');
        squaresRightBottom = filterFreeSquares(squaresRightBottom, color);
        squaresRightBottom.forEach((sq, idx) => {
            freeSquares.push([x + (idx + 1), y + (idx + 1)]);
        });
        let squaresLeftBottomToRight = currentPiecesArray.map((line, idx) => line[(x + y - idx)] || 'NO');
        let squaresRightTop = squaresLeftBottomToRight.slice(0, y).filter(sq => sq !== 'NO').reverse();
        squaresRightTop = filterFreeSquares(squaresRightTop, color);
        squaresRightTop.forEach((sq, idx) => {
            freeSquares.push([x + (idx + 1), y - (idx + 1)]);
        });
        let squaresLeftBottom = squaresLeftBottomToRight.slice(y + 1).filter(sq => sq !== 'NO');
        squaresLeftBottom = filterFreeSquares(squaresLeftBottom, color);
        squaresLeftBottom.forEach((sq, idx) => {
            freeSquares.push([x - (idx + 1), y + (idx + 1)]);
        });
    }

    // Compile allowed square moves for knight
    const checkKnightMove = (y: number, x: number, color: boolean) => {
        let leftTop = {y:y - 1, x:x - 2};
        if (validateMove(leftTop, color)) freeSquares.push([leftTop.x, leftTop.y]);
        let topLeft = {y:y - 2, x:x - 1};
        if (validateMove(topLeft, color)) freeSquares.push([topLeft.x, topLeft.y]);
        let topRight = {y:y - 2, x:x + 1};
        if (validateMove(topRight, color)) freeSquares.push([topRight.x, topRight.y]);
        let rightTop = {y:y - 1, x:x + 2};
        if (validateMove(rightTop, color)) freeSquares.push([rightTop.x, rightTop.y]);
        let rightBottom = {y:y + 1, x:x + 2};
        if (validateMove(rightBottom, color)) freeSquares.push([rightBottom.x, rightBottom.y]);
        let bottomRight = {y:y + 2, x:x + 1};
        if (validateMove(bottomRight, color)) freeSquares.push([bottomRight.x, bottomRight.y]);
        let bottomLeft = {y:y + 2, x:x - 1};
        if (validateMove(bottomLeft, color)) freeSquares.push([bottomLeft.x, bottomLeft.y]);
        let leftBottom = {y:y + 1, x:x - 2};
        if (validateMove(leftBottom, color)) freeSquares.push([leftBottom.x, leftBottom.y]);
    }

    // Compile allowed square moves for king
    const checkKingMove = (y: number, x: number, color: boolean) => {
        let kingMoves: Array<number[]> = [];
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let pos: piecePos = {y:y + i, x:x + j};
                if (validateMove(pos, color)) kingMoves.push([pos.x, pos.y]);
            }
        }
        for (let km of kingMoves) {
            if (
                checkRookChess(km[1], km[0], color, 'r') ||
                checkRookChess(km[1], km[0], color, 'q') ||
                checkKnightChess(km[1], km[0], color, 'n') ||
                checkBishopChess(km[1], km[0], color, 'b') ||
                checkBishopChess(km[1], km[0], color, 'q') ||
                checkPawnChess(km[1], km[0], color, 'p')
            ) continue;
            freeSquares.push(km);
        }
    }

    // Check if threat on the king prevent move of piece
    const moveFullfillThreat = (y: number, x:number, color: boolean, moved: boolean = false) => {
        let colorThreats = currentThreats.filter(threat => threat.color !== color);
        let cantMove = false;
        if (colorThreats.length > 0) {
            colorThreats.every(threat => {
                let axis = threat.axis;
                // If moving piece is on check axis
                if (axis.map(a => a.join()).indexOf([y, x].join()) >= 0) {
                    let squares = axis.map(pos => currentPiecesArray[pos[0]][pos[1]]);
                    let kingIdx = squares.indexOf(color ? 'K' : 'k');
                    let pieceIdx = squares.indexOf(currentPiecesArray[threat.pos[0]][threat.pos[1]]);
                    let range: Array<number[]> = kingIdx > pieceIdx ? 
                                        axis.filter((sq, idx) => idx >= pieceIdx && idx < kingIdx) :
                                        axis.filter((sq, idx) => idx > kingIdx && idx <= pieceIdx);
                    let currentIdx = range.map(r => r.join()).indexOf([y, x].join());
                    let oldRange = range.map(ar => ar.slice());
                    if (currentIdx > -1) range.splice(currentIdx, 1);
                    let newSquares = range.map(pos => currentPiecesArray[pos[0]][pos[1]]);
                    cantMove = newSquares.filter(sq => sq !== ' ').length > 1 ? false : true;
                    if (moved && cantMove) currentChessRange.push(oldRange);
                }
                return !cantMove;
            });
        }
        return cantMove;
    }

    // Get piece type to collect and poster allowed square moves
    const checkPieceMoves = () => {
        const x = currentPosDown[0];
        const y = currentPosDown[1];
        if (inCheck) {
            if (!currentCheckOut.find(sq => sq.pos.join() === [y, x].join())) return;
            let chessFighter: defeatChess = currentCheckOut.find(sq => sq.pos.join() === [y, x].join())!;
            freeSquares = chessFighter.moves;
            setChessPieces(designMoves());
            return;
        }

        const pieceType = piecesArray[y][x];
        const colorW = pieceType === pieceType.toUpperCase() ? true : false;
        if (pieceType === ' ') return undefined;
        

        if (moveFullfillThreat(y, x, colorW)) return;

        switch (pieceType.toUpperCase()) {
            case 'R':
                checkRookMove(y, x, colorW);
                break;
            case 'N':
                checkKnightMove(y, x, colorW);
                break;
            case 'B':
                checkBishopMove(y, x, colorW);
                break;
            case 'K':
                checkKingMove(y, x, colorW);
                break;
            case 'Q':
                checkBishopMove(y, x, colorW);
                checkRookMove(y, x, colorW);
                break;
            case 'P':
                checkPawnMove(y, x, colorW);
                break;
            default:
        }
        setChessPieces(designMoves());
    }

    // move piece and update chessboard if square move allowed
    const movePiece = () => {
        if (freeSquares.map(a => a.join()).indexOf(currentPosUp.join()) >= 0) {
            if (inCheck) {
                currentCheck = !inCheck;
                currentCheckOut = [];
            }
            currentPiecesArray[currentPosUp[1]][currentPosUp[0]] = currentPiecesArray[lastPosDown[1]][lastPosDown[0]];
            currentPiecesArray[lastPosDown[1]][lastPosDown[0]] = ' ';
            setPiecesArray(currentPiecesArray);

            const piece = currentPiecesArray[currentPosUp[1]][currentPosUp[0]];
            const color = piece === piece.toUpperCase() ? true: false;

            if (checkCheck()) currentCheck = true;
            if (moveFullfillThreat(lastPosDown[1], lastPosDown[0], !color, true)) currentCheck = true;

            let campPieces: Array<number[]> = [];
            currentPiecesArray.forEach((arr, idx) => {
                for (const [id, pos] of arr.entries()) {
                    if (pos !== ' '
                    && pos === (color ? pos.toLowerCase() : pos.toUpperCase())) campPieces.push([idx, id]);
                }
            });
            
            if (currentCheck) {
                let kingPos: number[] = [];
                currentPiecesArray.find((line, idxLine) => !!line.find((sq, idx) => {
                    if (sq === (color ? 'k' : 'K')) {
                        kingPos = [idxLine, idx];
                        return sq;
                    };
                }));
                freeSquares = [];
                checkKingMove(kingPos[0], kingPos[1], !color);
                let kingMoves: Array<number[]> = freeSquares;
                if (kingMoves.length > 0) currentCheckOut.push({pos: kingPos, moves: kingMoves});
                if (kingMoves.length < 1 && currentChessRange.length > 1) console.log('MAT');
                
                let shieldSquares: Array<number[]> = [];
                currentChessRange.forEach(arr => shieldSquares.push(...arr));
                let joinedShieldSquares: string[] = shieldSquares.map(sq => [sq[1], sq[0]].join());
                
                // Remove king from pieces
                campPieces.find((arr, idx) => {
                    if (arr.join() === kingPos.join()) {
                        campPieces.splice(idx, 1);
                        return arr;
                    }
                });
                
                campPieces.forEach(sq => {
                    const y = sq[0];
                    const x = sq[1];
                    const colorB = !color;
                    const type = currentPiecesArray[y][x].toUpperCase();
                    freeSquares = [];
                    switch (type) {
                        case 'R':
                            checkRookMove(y, x, colorB);
                            break;
                        case 'N':
                            checkKnightMove(y, x, colorB);
                            break;
                        case 'B':
                            checkBishopMove(y, x, colorB);
                            break;
                        case 'Q':
                            checkBishopMove(y, x, colorB);
                            checkRookMove(y, x, colorB);
                            break;
                        case 'P':
                            checkPawnMove(y, x, colorB);
                            break;
                        default:
                    }
                    freeSquares = freeSquares.filter(fsq => joinedShieldSquares.indexOf(fsq.join()) >= 0);
                    if (freeSquares.length > 0) currentCheckOut.push({pos: sq, moves: freeSquares});
                });
                if (currentCheckOut.length < 1) console.log('MAT');
                currentChessRange = [];
            } else {
                let pat = true;
                for (const cp of campPieces) {
                    const y = cp[0];
                    const x = cp[1];
                    const colorB = !color;
                    const type = currentPiecesArray[y][x].toUpperCase();
                    freeSquares = [];
                    switch (type) {
                        case 'R':
                            checkRookMove(y, x, colorB);
                            break;
                        case 'N':
                            checkKnightMove(y, x, colorB);
                            break;
                        case 'B':
                            checkBishopMove(y, x, colorB);
                            break;
                        case 'Q':
                            checkBishopMove(y, x, colorB);
                            checkRookMove(y, x, colorB);
                            break;
                        case 'K':
                            checkKingMove(y, x, colorB);
                            break;
                        case 'P':
                            checkPawnMove(y, x, colorB);
                            break;
                        default:
                    }
                    if (freeSquares.length > 0) {
                        pat = false;
                        break;
                    }
                }
                if (pat) console.log('PAT');
            }
            setCheckout(currentCheckOut);
            setChessRange(currentChessRange);
            let newThreats: threat[] = currentThreats.map(th => ({
                ...th,
                pos: th.pos.slice(), 
                axis: th.axis.map(pos => pos.slice())
            }));
            setThreats(newThreats);
            setInCheck(currentCheck);
        }
        setChessPieces(designPieces());
    }

    ///////////////////////////CHECK IF CHESS///////////////////////////

    const isSquare = (y:number, x:number): boolean => {
        return !!currentPiecesArray[y] && !!currentPiecesArray[y][x];
    }

    // Check if king is on piece axis then if piece put in check (tower / bishop / queen)
    const filterTargetSquares = (squares: Array<number[]>, pos: number[], color: boolean, targetType: string) => {
        const preventPos = [lastPosDown[1], lastPosDown[0]];
        if (clickedInBoard) {
            currentThreats.find((a, idx) => {
                if (a.pos.join() === preventPos.join()) {
                    currentThreats.splice(idx, 1);
                    return a;
                }
            });
        }
        const target = color ? targetType : targetType.toUpperCase();
        const contentSquares: string[] = squares.map(sq => currentPiecesArray[sq[0]][sq[1]]);
        let pieceIdx = squares.map(sq => sq.join()).indexOf([pos[0],pos[1]].join());
        if (!contentSquares.find((sq, idx) => sq === target && idx !== pieceIdx)) return false;
        if (clickedInBoard) currentThreats.push({pos: pos, color: color, axis:squares});
        let targetIdx = contentSquares.indexOf(target);
        let range: Array<number[]> = targetIdx > pieceIdx ? 
                                    squares.filter((sq, idx) => idx >= pieceIdx && idx < targetIdx) :
                                    squares.filter((sq, idx) => idx > targetIdx && idx <= pieceIdx);
        if (range.filter(sq => currentPiecesArray[sq[0]][sq[1]] !== ' ').length === 1) {
            currentChessRange.push(range);
            return true;
        }
        return false;
    }

    // Is pawn put in check ?
    const checkPawnChess = (y: number, x: number, color: boolean, targetType: string) => {
        const target = color ? targetType : targetType.toUpperCase();
        const dir = color ? -1 : 1;
        if (isSquare(y + dir, x - 1) && currentPiecesArray[y + dir][x - 1] === target) return true;
        if (isSquare(y + dir, x + 1) && currentPiecesArray[y + dir][x + 1] === target) return true;
        return false
    }

    // Is rook put in check ?
    const checkRookChess = (y: number, x: number, color: boolean, targetType: string) => {
        let squaresLeftRight = currentPiecesArray[y].map((sq, idx) => [y, idx]);
        if (filterTargetSquares(squaresLeftRight, [y, x], color, targetType)) return true;

        let squaresTopBottom = currentPiecesArray.map((line, idx) => [idx, x]);
        if (filterTargetSquares(squaresTopBottom, [y, x], color, targetType)) return true;
        
        return false;
    }

    // Is bishop put in check ?
    const checkBishopChess = (y: number, x: number, color: boolean, targetType: string) => {
        let squaresLeftTopToRight: Array<number[]> = currentPiecesArray.map((line, idx) => [idx, (x - y + idx)]).filter(sq => (sq[1] >= 0 && sq[1] < 8));
        if (filterTargetSquares(squaresLeftTopToRight, [y, x], color, targetType)) return true;

        let squaresLeftBottomToRight: Array<number[]> = currentPiecesArray.map((line, idx) => [idx, (x + y - idx)]).filter(sq => (sq[1] >= 0 && sq[1] < 8));
        if (filterTargetSquares(squaresLeftBottomToRight, [y, x], color, targetType)) return true;
        
        return false;
    }

    // Is knight put in check
    const checkKnightChess = (y: number, x: number, color: boolean, targetType: string) => {
        const target = color ? targetType : targetType.toUpperCase();
        if (isSquare(y - 1, x - 2) && currentPiecesArray[y - 1][x - 2] === target) return true;
        if (isSquare(y - 2, x - 2) && currentPiecesArray[y - 2][x - 1] === target) return true;
        if (isSquare(y - 2, x + 1) && currentPiecesArray[y - 2][x + 1] === target) return true;
        if (isSquare(y - 1, x + 2) && currentPiecesArray[y - 1][x + 2] === target) return true;
        if (isSquare(y + 1, x + 2) && currentPiecesArray[y + 1][x + 2] === target) return true;
        if (isSquare(y + 2, x + 1) && currentPiecesArray[y + 2][x + 1] === target) return true;
        if (isSquare(y + 2, x - 1) && currentPiecesArray[y + 2][x - 1] === target) return true;
        if (isSquare(y + 1, x - 2) && currentPiecesArray[y + 1][x - 2] === target) return true;
        return false;
    }

    // Is knight put in check
    const checkKingChess = (color: boolean) => {
        const king = color ? 'K' : 'k';
        const piecesType = color ? ['r', 'b', 'q'] : ['R', 'B', 'Q'];
        currentThreats = [];
        currentPiecesArray.forEach((line, lineId) => {
            for (const [sqId, sq] of line.entries()) {
                if (sq === piecesType[0]) checkRookChess(lineId, sqId, !color, king);
                if (sq === piecesType[1]) checkBishopChess(lineId, sqId, !color, king);
                if (sq === piecesType[2]) {
                    checkRookChess(lineId, sqId, !color, king);
                    checkBishopChess(lineId, sqId, !color, king);
                }
            }
        });
    }

    const checkCheck = () => {
        const x = currentPosUp[0];
        const y = currentPosUp[1];
        
        const pieceType = currentPiecesArray[y][x].toUpperCase();
        const colorW:boolean = currentPiecesArray[y][x] === pieceType ? true : false;
        if (pieceType === 'R') return checkRookChess(y, x, colorW, 'k');
        if (pieceType === 'N') return checkKnightChess(y, x, colorW, 'k');
        if (pieceType === 'B') return checkBishopChess(y, x, colorW, 'k');
        if (pieceType === 'Q') return (checkRookChess(y, x, colorW, 'k') || checkBishopChess(y, x, colorW, 'k'));
        if (pieceType === 'P') return checkPawnChess(y, x, colorW, 'k');
        if (pieceType === 'K') checkKingChess(colorW);
    }

    // CHECK SI MOUVEMENT PIECE PROVOQUE PAS ECHEC SUR SON ROI
    // CHECK PRISE EN PASSANT
    // CHECK ROCK POSSIBLE OU PAS
    
    return(
        <div ref={boardRef} className='chess-page'>
            <div className='chess-board board'>
                {designBoard()}
            </div>
            <div className='pieces-board board'>
                {chessPieces}
            </div>
        </div>
    )
}