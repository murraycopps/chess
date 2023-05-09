import { PieceType } from "./pieces";

const evaluatePosition = (squares: PieceType[][], turn: "white" | "black") => {    // evaluate material

    // check for checkmate or stalemate

   let canMove = false;
    let checkmate = false;
    squares.forEach((row) => {
        row.forEach((piece) => {
            if (typeof piece !== "string") {
                if (piece.color === turn) {
                    const moves = [...piece.validMoves(squares), ...piece.capture(squares)];
                    if (moves.length > 0) {
                        canMove = true;
                    }
                }
                else{
                    const moves = piece.capture(squares);
                    // find if any of the moves are a capture of the king
                    moves.forEach((move) => {
                        const piece = squares[move.x][move.y];
                        if (typeof piece !== "string" && piece.color === turn && piece.type === "king") {
                            checkmate = true;
                        }
                    });
                }
            }
        });
    });

    if(!canMove){
        if(checkmate){
            return turn === "white" ? -Infinity : Infinity;
        }
        else{
            return 0;
        }
    }

                    

    


    let material = 0;
    squares.forEach((row) => {
        row.forEach((piece) => {
            if (typeof piece !== "string") {
                if (piece.color === "white") {
                    material += piece.value;
                } else {
                    material -= piece.value;
                }
            }
        });
    });
    // evaluate position (center control)
    let centerControl = 0;
    squares.forEach((row) => {
        row.forEach((piece) => {
            if (typeof piece !== "string") {
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
            }
        });
    });

    // evaluate position (king safety) by checking for checks
    let kingSafety = 0;
    squares.forEach((row) => {
        row.forEach((piece) => {
            if (typeof piece !== "string") {
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
            }
        });
    });

    // evaluate how far the king is from the center
    let whiteKingCenter = 0;
    squares.forEach((row) => {
        row.forEach((piece) => {
            if (typeof piece !== "string") {
                if (piece.color === "white" && piece.type === "king") {
                    whiteKingCenter += Math.abs(piece.x - 3.5) + Math.abs(piece.y - 3.5);
                }
            }
        });
    });

    let blackKingCenter = 0;
    squares.forEach((row) => {
        row.forEach((piece) => {
            if (typeof piece !== "string") {
                if (piece.color === "black" && piece.type === "king") {
                    blackKingCenter += Math.abs(piece.x - 3.5) + Math.abs(piece.y - 3.5);
                }
            }
        });
    });

    let kingCenter = whiteKingCenter - blackKingCenter;


    // evaluate how close pawns are to promotion
    let whitePawnPromotion = 0;
    let blackPawnPromotion = 0;
    squares.forEach((row) => {
        row.forEach((piece) => {
            if (typeof piece !== "string") {
                if (piece.color === "white" && piece.type === "pawn") {
                    whitePawnPromotion += piece.x;
                }
                if (piece.color === "black" && piece.type === "pawn") {
                    blackPawnPromotion += 7 - piece.x;
                }
            }
        });
    });

    let pawnPromotion = whitePawnPromotion - blackPawnPromotion;

    // how many pieces each piece sees
    let whitePieceSight = 0;
    let blackPieceSight = 0;
    squares.forEach((row) => {
        row.forEach((piece) => {
            if (typeof piece !== "string") {
                const validMoves = [...piece.validMoves(squares, false), ...piece.capture(squares, false)].length;
                if (piece.color === "white") {
                    whitePieceSight += validMoves;
                }
                else {
                    blackPieceSight += validMoves;
                }
            }
        });
    });

    let pieceSight = whitePieceSight - blackPieceSight;

    // hanging pieces
    let hangingPoints = 0;
    squares.forEach((row) => {
        row.forEach((piece) => {
            if (typeof piece !== "string") {
                const validcaptures  = piece.capture(squares, false);
                validcaptures.forEach((move) => {
                    const hangingPiece = squares[move.x][move.y];
                    if (typeof hangingPiece !== "string" && hangingPiece.color !== piece.color) {
                        if(piece.color === "white"){
                            hangingPoints += hangingPiece.value;
                        }
                        else{
                            hangingPoints -= hangingPiece.value;
                        }
                    }
                });
            }
        });
    });

    // defended peices
    let defendedPoints = 0;
    squares.forEach((row) => {
        row.forEach((piece) => {
            if (typeof piece !== "string") {
                const validcaptures  = piece.defended(squares, false);
                validcaptures.forEach((move) => {
                    const defendedPiece = squares[move.x][move.y];
                    if (typeof defendedPiece !== "string" && defendedPiece.color === piece.color) {
                        if(piece.color === "white"){
                            defendedPoints += 1;
                        }
                        else{
                            defendedPoints -= 1;
                        }
                    }
                });
            }
        });
    });

    



    // check if king has moved yet. if the king has moved and is not castled, then subtract 1 from the score
    let whiteKingHasMoved = false;
    let blackKingHasMoved = false;
    squares.forEach((row) => {
        row.forEach((piece) => {
            if (typeof piece !== "string") {
                if (piece.color === "white" && piece.type === "king" && piece.hasMoved) {
                // check if the king is castled or in the corner
                if(piece.y < 2 || piece.y > 5){
                    whiteKingHasMoved = false;
                }
                else{
                    whiteKingHasMoved = true;
                }
                    
                    
                }
                if (piece.color === "black" && piece.type === "king" && piece.hasMoved) {
                    if(piece.y < 2 || piece.y > 5){
                        blackKingHasMoved = false;
                    }
                    else{
                        blackKingHasMoved = true;
                    }
                }
            }
        });
    });

    if(whiteKingHasMoved !== blackKingHasMoved){
        if(whiteKingHasMoved){
            material -= 1;
        }
        else{
            material += 1;
        }
    }







    return ((material * 3 + (centerControl + kingSafety  + (-kingCenter + pawnPromotion + pieceSight + hangingPoints + defendedPoints) / 2.5) / 4) / 4);

}


export default evaluatePosition;