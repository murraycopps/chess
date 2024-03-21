import { PieceType } from "./pieces";

const evaluatePosition = (squares: PieceType[][], turn: "white" | "black") => {    // evaluate material


    let canMove = false;
    let material = 0;
    let centerControl = 0;
    let kingSafety = 0;
    let whiteKingCenter = 0;
    let blackKingCenter = 0;
    let whitePawnPromotion = 0;
    let blackPawnPromotion = 0;
    let hangingPoints = 0;
    let defendedPoints = 0;
    let whiteKingHasMoved = false;
    let blackKingHasMoved = false;
    let whitePieceSight = 0;
    let blackPieceSight = 0;



    squares.forEach((row) => {
        row.forEach((piece) => {
            if (typeof piece !== "string") {

                if (piece.color === turn) {
                    const moves = [...piece.validMoves(squares), ...piece.capture(squares)];
                    if (moves.length > 0) {
                        canMove = true;
                    }
                }
                else {
                    const moves = piece.capture(squares);
                    // find if any of the moves are a capture of the king
                    moves.forEach((move) => {
                        const piece = squares[move.x][move.y];
                        if (typeof piece !== "string" && piece.color === turn && piece.type === "king") {
                             return turn === "white" ? -Infinity : Infinity;
                        }
                    });
                }

                //  material
                if (piece.color === "white") {
                    material += piece.value;
                } else {
                    material -= piece.value;
                }
                // center control
                if (piece.type !== "pawn") {
                    // use piece valid moves to evaluate center control
                    const validMoves = [...piece.validMoves(squares, false), ...piece.capture(squares, false)]
                    validMoves.forEach((move) => {
                        if (move.x >= 3 && move.x <= 4 && move.y >= 3 && move.y <= 4) {
                            if (piece.color === "white") {
                                centerControl++;
                            } else {
                                centerControl--;
                            }
                        }
                    });
                }
                else {
                    if ((piece.y === 2 || piece.y === 5) && (piece.x >= 2 && piece.x <= 5)) {
                        if (piece.color === "white") {
                            centerControl++;
                        }
                        else {
                            centerControl--;
                        }
                    }
                    else if ((piece.y === 3 || piece.y === 4) && (piece.x >= 2 && piece.x <= 5)) {
                        if (piece.color === "white") {
                            centerControl += 2;
                        }
                        else {
                            centerControl -= 2;
                        }
                    }

                }
                // king safety (check for checks)
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
                    if (checked) {
                        if (piece.color === "white") {
                            kingSafety += 0.1;
                        } else {
                            kingSafety -= 0.1;
                        }
                    }
                });

                // pawn promotion
                if (piece.color === "white" && piece.type === "pawn") {
                    whitePawnPromotion += piece.x;
                }
                if (piece.color === "black" && piece.type === "pawn") {
                    blackPawnPromotion += 7 - piece.x;
                }

                // king center
                if (piece.color === "white" && piece.type === "king") {
                    whiteKingCenter += Math.abs(piece.x - 3.5) + Math.abs(piece.y - 3.5);
                }
                if (piece.color === "black" && piece.type === "king") {
                    blackKingCenter += Math.abs(piece.x - 3.5) + Math.abs(piece.y - 3.5);
                }
                // piece sight
                if (piece.color === "white") {
                    whitePieceSight += validMoves.length
                }
                else {
                    blackPieceSight += validMoves.length
                }
                // hanging pieces
                const validcaptures = piece.capture(squares, false);
                validcaptures.forEach((move) => {
                    const hangingPiece = squares[move.x][move.y];
                    if (typeof hangingPiece !== "string" && hangingPiece.color !== piece.color) {
                        if (piece.color === "white") {
                            hangingPoints += hangingPiece.value;
                        }
                        else {
                            hangingPoints -= hangingPiece.value;
                        }

                    }

                });
                // defended pieces
                const defended = piece.defended(squares, false);
                defended.forEach((move) => {
                    const defendedPiece = squares[move.x][move.y];
                    if (typeof defendedPiece !== "string" && defendedPiece.color === piece.color) {
                        if (piece.color === "white") {
                            defendedPoints += 1;
                        }
                        else {
                            defendedPoints -= 1;
                        }
                    }
                });

            }

        });
    });



    let kingCenter = blackKingCenter - whiteKingCenter;



    let pawnPromotion = whitePawnPromotion - blackPawnPromotion;

    // how many pieces each piece sees



    let pieceSight = whitePieceSight - blackPieceSight;



    // check if king has moved yet. if the king has moved and is not castled, then subtract 1 from the score

    squares.forEach((row) => {
        row.forEach((piece) => {
            if (typeof piece !== "string") {
                if (piece.color === "white" && piece.type === "king" && piece.hasMoved) {
                    // check if the king is castled or in the corner
                    if (piece.y < 2 || piece.y > 5) {
                        whiteKingHasMoved = false;
                    }
                    else {
                        whiteKingHasMoved = true;
                    }


                }
                if (piece.color === "black" && piece.type === "king" && piece.hasMoved) {
                    if (piece.y < 2 || piece.y > 5) {
                        blackKingHasMoved = false;
                    }
                    else {
                        blackKingHasMoved = true;
                    }
                }
            }
        });
    });

    if (whiteKingHasMoved !== blackKingHasMoved) {
        if (whiteKingHasMoved) {
            material -= 1;
        }
        else {
            material += 1;
        }
    }



    if (!canMove) {

        return 0;

    }

    return (material * 8 + centerControl * 4 + kingSafety * 3 + kingCenter * 2 + pawnPromotion + pieceSight * 2 * 2 + hangingPoints * 6 + defendedPoints) / 28;

}


export  {evaluatePosition};