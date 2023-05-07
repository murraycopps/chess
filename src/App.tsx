import { useEffect, useState } from "react";
import { PieceType } from "./pieces";
import Bishop from "./pieces/bishop";
import King from "./pieces/king";
import Knight from "./pieces/knight";
import Pawn from "./pieces/pawn";
import Queen from "./pieces/queen";
import Rook from "./pieces/rook";
import Square from "./Square";

export default function App() {
  const [squares, setSquares] = useState<PieceType[][]>([]);
  const [color, setColor] = useState<"white" | "black">("white");
  const [enPassant, setEnPassant] = useState<{ x: number; y: number }[]>([]);
  const [message, setMessage] = useState("");
  const [promotion, setPromotion] = useState(false);

  useEffect(() => {
    const array: PieceType[][] = Array.from({ length: 8 }, () =>
      Array.from({ length: 8 }, () => "")
    );
    // set up chessboard

    // set up pawns
    for (let i = 0; i < 8; i++) {
      array[1][i] = new Pawn(1, i, "black");
      array[6][i] = new Pawn(6, i, "white");
    }

    // set up rooks
    array[0][0] = new Rook(0, 0, "black");
    array[0][7] = new Rook(0, 7, "black");
    array[7][0] = new Rook(7, 0, "white");
    array[7][7] = new Rook(7, 7, "white");

    // set up knights
    array[0][1] = new Knight(0, 1, "black");
    array[0][6] = new Knight(0, 6, "black");
    array[7][1] = new Knight(7, 1, "white");
    array[7][6] = new Knight(7, 6, "white");

    // set up bishops
    array[0][2] = new Bishop(0, 2, "black");
    array[0][5] = new Bishop(0, 5, "black");
    array[7][2] = new Bishop(7, 2, "white");
    array[7][5] = new Bishop(7, 5, "white");

    // set up queens
    array[0][3] = new Queen(0, 3, "black");
    array[7][3] = new Queen(7, 3, "white");

    // set up kings
    array[0][4] = new King(0, 4, "black");
    array[7][4] = new King(7, 4, "white");

    setSquares(array);
  }, []);

  return (
    <div className="grid place-items-center h-screen">
      <div className="w-128 relative h-128 grid grid-cols-8 grid-rows-8">
        {squares.map((a, i) =>
          a.map((b, j) => (
            <Square
              key={`${i}-${j}`}
              dark={(i + j) % 2 === 0}
              piece={b}
              onClick={() => {
                const valid = b === "valid-move";
                const hanging = typeof b !== "string" && b.hanging;
                const activePiece = squares
                  .find((a) => a.find((b) => typeof b !== "string" && b.active))
                  ?.find((b) => typeof b !== "string" && b.active);
                const array: PieceType[][] = [...squares].map((a) =>
                  a.map((b) => {
                    if (typeof b === "string") return "";
                    b.active = false;
                    b.hanging = false;
                    return b;
                  })
                );

                if (enPassant.find((move) => move.x === i && move.y === j)) {
                  if (color === "white") {
                    array[i + 1][j] = "";
                  } else {
                    array[i - 1][j] = "";
                  }
                }

                if (hanging && activePiece && typeof activePiece !== "string") {
                  // capture piece
                  array[i][j] = activePiece;
                  array[activePiece.x][activePiece.y] = "";
                  activePiece.x = i;
                  activePiece.y = j;
                  activePiece.hasMoved = true;

                  setColor(color === "white" ? "black" : "white");
                } else if (typeof b !== "string" && b.color === color) {
                  if (!b.active) {
                    const validMoves = b.validMoves(array);
                    validMoves.forEach((move) => {
                      array[move.x][move.y] = "valid-move";
                    });
                    const captureMoves = b.capture(array);
                    captureMoves.forEach((move) => {
                      const piece = array[move.x][move.y];
                      if (typeof piece !== "string") {
                        piece.hanging = true;
                      }
                    });
                    b.active = true;

                    // en passant
                    if (b.type === "pawn") {
                      enPassant.forEach((move) => {
                        array[move.x][move.y] = "valid-move";
                      });
                    }
                  } else {
                    b.active = false;
                  }
                } else if (valid) {
                  if (activePiece && typeof activePiece !== "string") {
                    setEnPassant([]);
                    // check for castling
                    if (activePiece.type === "king") {
                      if (
                        activePiece.color === "white" &&
                        !activePiece.hasMoved
                      ) {
                        if (j === 6) {
                          // kingside castle
                          const rook = squares[7][7];
                          if (
                            typeof rook !== "string" &&
                            rook.type === "rook" &&
                            !rook.hasMoved
                          ) {
                            array[7][6] = activePiece;
                            array[7][5] = rook;
                            array[7][7] = "";
                            array[7][4] = "";
                            activePiece.x = 7;
                            activePiece.y = 6;
                            rook.x = 7;
                            rook.y = 5;
                            rook.hasMoved = true;
                            activePiece.hasMoved = true;
                            setColor(color === "white" ? "black" : "white");
                          }
                        } else if (j === 2) {
                          // queenside castle
                          const rook = squares[7][0];
                          if (
                            typeof rook !== "string" &&
                            rook.type === "rook" &&
                            !rook.hasMoved
                          ) {
                            array[7][2] = activePiece;
                            array[7][3] = rook;
                            array[7][0] = "";
                            array[7][4] = "";
                            activePiece.x = 7;
                            activePiece.y = 2;
                            rook.x = 7;
                            rook.y = 3;
                            rook.hasMoved = true;
                            activePiece.hasMoved = true;
                            setColor(color === "white" ? "black" : "white");
                          }
                        } else {
                          activePiece.active = false;
                          // remove active piece from old square
                          array[activePiece.x][activePiece.y] = "";
                          // move active piece to new square
                          activePiece.x = i;
                          activePiece.y = j;
                          activePiece.hasMoved = true;
                          array[i][j] = activePiece;
                          setColor(color === "white" ? "black" : "white");
                        }
                      } else if (
                        activePiece.color === "black" &&
                        !activePiece.hasMoved
                      ) {
                        if (j === 6) {
                          // kingside castle
                          const rook = squares[0][7];
                          if (
                            typeof rook !== "string" &&
                            rook.type === "rook" &&
                            !rook.hasMoved
                          ) {
                            array[0][6] = activePiece;
                            array[0][5] = rook;
                            array[0][7] = "";
                            array[0][4] = "";
                            activePiece.x = 0;
                            activePiece.y = 6;
                            rook.x = 0;
                            rook.y = 5;
                            rook.hasMoved = true;
                            activePiece.hasMoved = true;
                            setColor(color === "white" ? "black" : "white");
                          }
                        } else if (j === 2) {
                          // queenside castle
                          const rook = squares[0][0];
                          if (
                            typeof rook !== "string" &&
                            rook.type === "rook" &&
                            !rook.hasMoved
                          ) {
                            array[0][2] = activePiece;
                            array[0][3] = rook;
                            array[0][0] = "";
                            array[0][4] = "";
                            activePiece.x = 0;
                            activePiece.y = 2;
                            rook.x = 0;
                            rook.y = 3;
                            rook.hasMoved = true;
                            activePiece.hasMoved = true;
                            setColor(color === "white" ? "black" : "white");
                          }
                        } else {
                          activePiece.active = false;
                          // remove active piece from old square
                          array[activePiece.x][activePiece.y] = "";
                          // move active piece to new square
                          activePiece.x = i;
                          activePiece.y = j;
                          activePiece.hasMoved = true;
                          array[i][j] = activePiece;
                          setColor(color === "white" ? "black" : "white");
                        }
                      } else {
                        activePiece.active = false;
                        // remove active piece from old square
                        array[activePiece.x][activePiece.y] = "";
                        // move active piece to new square
                        activePiece.x = i;
                        activePiece.y = j;
                        activePiece.hasMoved = true;
                        array[i][j] = activePiece;
                        setColor(color === "white" ? "black" : "white");
                      }
                    } else {
                      activePiece.active = false;
                      // remove active piece from old square
                      array[activePiece.x][activePiece.y] = "";
                      const oldX = activePiece.x;
                      // move active piece to new square
                      activePiece.x = i;
                      activePiece.y = j;
                      activePiece.hasMoved = true;
                      array[i][j] = activePiece;
                      setColor(color === "white" ? "black" : "white");

                      // en passant
                      if (activePiece.type === "pawn") {
                        if (
                          activePiece.color === "black" &&
                          activePiece.x === 3 &&
                          oldX === 1
                        ) {
                          if (activePiece.y < 7) {
                            const right =
                              squares[activePiece.x][activePiece.y + 1];
                            if (
                              typeof right !== "string" &&
                              right.color !== activePiece.color &&
                              right.type === "pawn"
                            ) {
                              //  set en passant to the square behind the pawn
                              setEnPassant((enPassant) => [
                                ...enPassant,
                                { x: activePiece.x - 1, y: activePiece.y },
                              ]);
                            }
                          }
                          if (activePiece.y > 0) {
                            const left =
                              squares[activePiece.x][activePiece.y - 1];
                            if (
                              typeof left !== "string" &&
                              left.color !== activePiece.color &&
                              left.type === "pawn"
                            ) {
                              setEnPassant((enPassant) => [
                                ...enPassant,
                                { x: activePiece.x - 1, y: activePiece.y },
                              ]);
                            }
                          }
                        } else if (
                          activePiece.color === "white" &&
                          activePiece.x === 4 &&
                          oldX === 6
                        ) {
                          if (activePiece.y < 7) {
                            const right =
                              squares[activePiece.x][activePiece.y + 1];
                            if (
                              typeof right !== "string" &&
                              right.color !== activePiece.color &&
                              right.type === "pawn"
                            ) {
                              setEnPassant((enPassant) => [
                                ...enPassant,
                                { x: activePiece.x + 1, y: activePiece.y },
                              ]);
                            }
                          }
                          if (activePiece.y > 0) {
                            const left =
                              squares[activePiece.x][activePiece.y - 1];
                            if (
                              typeof left !== "string" &&
                              left.color !== activePiece.color &&
                              left.type === "pawn"
                            ) {
                              setEnPassant((enPassant) => [
                                ...enPassant,
                                { x: activePiece.x + 1, y: activePiece.y },
                              ]);
                            }
                          }
                        }
                      }
                    }
                  }
                }
                setSquares(array);

                // check for checkmate
                let checkmate = false;
                let stalemate = true;
                array.forEach((a) => {
                  a.forEach((b) => {
                    if (typeof b !== "string" && b.color !== color) {
                      const validMoves = b.validMoves(array);
                      const captureMoves = b.capture(array);
                      if (validMoves.length > 0 || captureMoves.length > 0) {
                        stalemate = false;
                      }
                    }
                  });
                });
                // if stalemate check if king is in check
                if (stalemate) {
                  array.forEach((a) => {
                    a.forEach((b) => {
                      if (typeof b !== "string" && b.color === color) {
                        const capture = b.capture(array);
                        if (
                          capture.length > 0 &&
                          capture.find((move) => {
                            const piece = array[move.x][move.y];
                            return (
                              typeof piece !== "string" && piece.type === "king"
                            );
                          })
                        ) {
                          console.log("check", b);
                          checkmate = true;
                        }
                      }
                    });
                  });
                }

                if (checkmate) {
                  // alert(`${color !== "white" ? "Black" : "White"} wins!`);
                  setMessage(`${color !== "white" ? "Black" : "White"} wins!`);
                } else if (stalemate) {
                  // alert("Stalemate!");
                  setMessage("Stalemate!");
                }

                // check for promotion
                array.forEach((a) => {
                  a.forEach((b) => {
                    if (typeof b !== "string" && b.type === "pawn") {
                      if (
                        (b.color === "white" && b.x === 0) ||
                        (b.color === "black" && b.x === 7)
                      ) {
                        setPromotion(true);
                      }
                    }
                  });
                });
              }}
            />
          ))
        )}
        {message && (
          <div className="absolute w-full h-full grid place-items-center text-5xl font-bold text-black text-shadow-white">
            {message}
          </div>
        )}
        {promotion && (
          <div className="absolute w-full bg-white bg-opacity-80 h-full p-16 text-8xl text-black text-center text-shadow-white">
              <div className="grid grid-cols-2 place-items-center w-full h-full">
              <div
                onClick={() => {
                  const array: PieceType[][] = [...squares];
                  array.forEach((a) => {
                    a.forEach((b) => {
                      if (typeof b !== "string" && b.type === "pawn") {
                        if (
                          (b.color === "white" && b.x === 0) ||
                          (b.color === "black" && b.x === 7)
                        ) {
                          array[b.x][b.y] = new Queen(b.x, b.y, b.color);
                        }
                      }
                    });
                  });
                  setSquares(array);
                  setPromotion(false);
                }}
              >
                <p>♛</p>
              </div>
              <div
                onClick={() => {
                  const array: PieceType[][] = [...squares];
                  array.forEach((a) => {
                    a.forEach((b) => {
                      if (typeof b !== "string" && b.type === "pawn") {
                        if (
                          (b.color === "white" && b.x === 0) ||
                          (b.color === "black" && b.x === 7)
                        ) {
                          array[b.x][b.y] = new Rook(b.x, b.y, b.color);
                        }
                      }
                    });
                  });
                  setSquares(array);
                  setPromotion(false);
                }}
              >
                <p>♜</p>
              </div>
              <div
                onClick={() => {
                  const array: PieceType[][] = [...squares];
                  array.forEach((a) => {
                    a.forEach((b) => {
                      if (typeof b !== "string" && b.type === "pawn") {
                        if (
                          (b.color === "white" && b.x === 0) ||
                          (b.color === "black" && b.x === 7)
                        ) {
                          array[b.x][b.y] = new Bishop(b.x, b.y, b.color);
                        }
                      }
                    });
                  });
                  setSquares(array);
                  setPromotion(false);
                }}
              >
                <p>♝</p>
              </div>
              <div
                onClick={() => {
                  const array: PieceType[][] = [...squares];
                  array.forEach((a) => {
                    a.forEach((b) => {
                      if (typeof b !== "string" && b.type === "pawn") {
                        if (
                          (b.color === "white" && b.x === 0) ||
                          (b.color === "black" && b.x === 7)
                        ) {
                          array[b.x][b.y] = new Knight(b.x, b.y, b.color);
                        }
                      }
                    });
                  });
                  setSquares(array);
                  setPromotion(false);
                }}
              >
                <p>♞</p>
              </div>
              </div>
            </div>
        )}
      </div>
    </div>
  );
}
