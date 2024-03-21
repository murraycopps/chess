import {evaluatePosition} from "./eval";
import { PieceType } from "./pieces"

const calculateBestMove = (squares: PieceType[][], color: "black" | "white", depth: number) => {
    // calculate all possible moves for the color
    let possibleMoves: { piece: PieceType, move: { x: number, y: number } }[] = [];
    squares.forEach((row) => {
        row.forEach((piece) => {
            if (typeof piece !== "string") {
                if (piece.color === color) {
                    const moves = [...piece.validMoves(squares), ...piece.capture(squares)];
                    moves.forEach((move) => {
                        possibleMoves.push({ piece, move });
                    });
                }
            }
        });
    });

    let bestMove: { piece: PieceType, move: { x: number, y: number }, score: number } = { piece: "none", move: { x: 0, y: 0 }, score: -Infinity };


    possibleMoves.forEach((currMove) => {
        if (typeof currMove.piece !== "string") {
            const array = squares.map((a) => [...a]);
            array[currMove.move.x][currMove.move.y] = currMove.piece;
            array[currMove.piece.x][currMove.piece.y] = "";
            let score = color === "white" ? evaluatePosition(array, color) : -evaluatePosition(array, color);
            if(depth  > 1){
               score = (color === "white" ? 1 : -1) * calculateBestMove(array, color === "white" ? "black" : "white", depth - 1).score;
            }

            if (score > bestMove.score) {
                bestMove = {...currMove, score}
            }
        }
    });

    
    

    return bestMove;
}


export { calculateBestMove };
