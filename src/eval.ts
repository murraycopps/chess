import { PieceType } from "./pieces";

const evaluatePosition = (squares: PieceType[][]) => {
    // evaluate material
    let whiteMaterial = 0;
    let blackMaterial = 0;
    squares.forEach((row) => {
        row.forEach((piece) => {
            if (typeof piece !== "string") {
                if (piece.color === "white") {
                    whiteMaterial += piece.value;
                } else {
                    blackMaterial += piece.value;
                }
            }
        });
    });
    // evaluate position (center control)
    let whiteCenterControl = 0;
    let blackCenterControl = 0;
    squares.forEach((row) => {
        row.forEach((piece) => {
            if(typeof piece !== "string") {
                // use piece valid moves to evaluate center control
                const validMoves = [...piece.validMoves(squares, false), ...piece.capture(squares, false)]
                validMoves.forEach((move) => {
                    if(move.x >= 3 && move.x <= 4 && move.y >= 3 && move.y <= 4) {
                        if(piece.color === "white") {
                            whiteCenterControl++;
                        } else {
                            blackCenterControl++;
                        }
                    }
                });
            }
        });
    });

    // evaluate position (king safety) by checking for checks
    let whiteKingSafety = 0;
    let blackKingSafety = 0;
    squares.forEach((row) => {
        row.forEach((piece) => {
            if(typeof piece !== "string"){
                const validMoves = [...piece.validMoves(squares, false), ...piece.capture(squares, false)]
                // check for checks
                validMoves.forEach((move) => {
                    const array: PieceType[][] = [...squares].map((a) => [...a]);
                    array[move.x][move.y] = piece;
                    array[piece.x][piece.y] = "";
                    let checked = false;
                    // check for check from the enemy
                    array.forEach((a) => {
                        a.forEach((b) => {
                            if (typeof b !== "string" && b.color !== piece.color) {
                                const captureMoves = b.capture(array, false);
                                captureMoves.forEach((move) => {
                                    const piece = array[move.x][move.y];
                                    if (
                                        typeof piece !== "string" &&
                                        piece.color === piece.color &&
                                        piece.type === "king"
                                    ) {
                                        checked = true;
                                    }
                                });
                            }
                        });
                    });
                    if(checked) {
                        if(piece.color === "white") {
                            whiteKingSafety++;
                        } else {
                            blackKingSafety++;
                        }
                    }
                });
            }
        });
    });

    const totalWhite = (whiteMaterial + (whiteCenterControl + whiteKingSafety) / 2) / 2;
    const totalBlack = (blackMaterial + (blackCenterControl + blackKingSafety) / 2) / 2;

    return totalWhite - totalBlack;        
}


export default evaluatePosition;