/**
 * Coordinates object representing square position in chessboard array of array of character - character reveals what's occupying the square 
 */
export interface PiecePos {
    y: number;
    x: number;
}

/**
 * succession of coordinates array, representing positions in chessboard array between the king and the piece that threats that king
 */
export interface Threat {
    pos: number[],          // position of piece that threats the king
    axis: Array<number[]>   // positions of axis [y, x]
    fulfilled: boolean      // is king in chess
}

export type game = Array<string[]>;
