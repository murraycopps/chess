import { useEffect, useState } from "react";
import Square from "./Square";

export default function App() {
  const [squares, setSquares] = useState<PieceType[][]>([]);
  const [color, setColor] = useState<"white" | "black">("white");
  const [enPassant, setEnPassant] = useState<{ x: number; y: number }[]>([]);
  const [message, setMessage] = useState("");

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
                  const hangingPiece = squares[i][j];
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
                    if(b.type === "pawn") {
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
                        }
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
                let checkmate = true;
                array.forEach((a) => {
                  a.forEach((b) => {
                    if (typeof b !== "string" && b.color !== color) {
                      const validMoves = b.validMoves(array);
                      const captureMoves = b.capture(array);
                      if (validMoves.length > 0 || captureMoves.length > 0) {
                        checkmate = false;
                      }
                    }
                  });
                });
                if (checkmate) {
                  // alert(`${color !== "white" ? "Black" : "White"} wins!`);
                  setMessage(`${color !== "white" ? "Black" : "White"} wins!`);
                }
              }}
            />
          ))
        )}
        {
          message && ( <div className="absolute w-full h-full grid place-items-center text-5xl font-bold text-black text-shadow-white">{message}</div> )
        }
      </div>
    </div>
  );
}
export type PieceType =
  | {
      x: number;
      y: number;
      active: boolean;
      hanging: boolean;
      hasMoved: boolean;
      type: string;
      color: string;
      validMoves: (
        squares: PieceType[][],
        checks?: boolean
      ) => { x: number; y: number }[];
      capture: (
        squares: PieceType[][],
        checks?: boolean
      ) => { x: number; y: number }[];
    }
  | string;

type PieceOptions =
  | "pawn"
  | "rook"
  | "knight"
  | "bishop"
  | "queen"
  | "king"
  | "";

class Piece {
  x: number;
  y: number;
  active: boolean = false;
  hanging: boolean = false;
  hasMoved: boolean = false;
  type: PieceOptions;
  color: "white" | "black";
  constructor(x: number, y: number, color: "white" | "black") {
    this.x = x;
    this.y = y;
    this.type = "";
    this.color = color;
  }
}

class Pawn extends Piece {
  constructor(x: number, y: number, color: "white" | "black") {
    super(x, y, color);
    this.type = "pawn";
  }
  validMoves(squares: PieceType[][], checks: boolean = true) {
    const validMoves: { x: number; y: number }[] = [];
    if (this.color === "white") {
      if (this.x === 6) {
        if (squares[this.x - 1][this.y] === "") {
          validMoves.push({ x: this.x - 1, y: this.y });
          if (squares[this.x - 2][this.y] === "") {
            validMoves.push({ x: this.x - 2, y: this.y });
          }
        }
      } else {
        if (squares[this.x - 1][this.y] === "") {
          validMoves.push({ x: this.x - 1, y: this.y });
        }
      }
    } else {
      if (this.x === 1) {
        if (squares[this.x + 1][this.y] === "") {
          validMoves.push({ x: this.x + 1, y: this.y });
          if (squares[this.x + 2][this.y] === "") {
            validMoves.push({ x: this.x + 2, y: this.y });
          }
        }
      } else {
        if (squares[this.x + 1][this.y] === "") {
          validMoves.push({ x: this.x + 1, y: this.y });
        }
      }
    }

    return checks
      ? validMoves.filter((move) => {
          const array: PieceType[][] = [...squares].map((a) => [...a]);
          array[move.x][move.y] = this;
          array[this.x][this.y] = "";
          let checked = false;
          // check for check from the enemy
          array.forEach((a) => {
            a.forEach((b) => {
              if (typeof b !== "string" && b.color !== this.color) {
                const captureMoves = b.capture(array, false);
                captureMoves.forEach((move) => {
                  const piece = array[move.x][move.y];
                  if (
                    typeof piece !== "string" &&
                    piece.color === this.color &&
                    piece.type === "king"
                  ) {
                    checked = true;
                  }
                });
              }
            });
          });
          return !checked;
        })
      : validMoves;
  }
  capture(squares: PieceType[][], checks: boolean = true) {
    // check for diagonal capture
    const validMoves: { x: number; y: number }[] = [];
    if (this.color === "white") {
      if (this.y < 7) {
        const right = squares[this.x - 1][this.y + 1];
        if (typeof right !== "string" && right.color !== this.color) {
          validMoves.push({ x: this.x - 1, y: this.y + 1 });
        }
      }
      if (this.y > 0) {
        const left = squares[this.x - 1][this.y - 1];
        if (typeof left !== "string" && left.color !== this.color) {
          validMoves.push({ x: this.x - 1, y: this.y - 1 });
        }
      }
    } else {
      if (this.y < 7) {
        const right = squares[this.x + 1][this.y + 1];
        if (typeof right !== "string" && right.color !== this.color) {
          validMoves.push({ x: this.x + 1, y: this.y + 1 });
        }
      }
      if (this.y > 0) {
        const left = squares[this.x + 1][this.y - 1];
        if (typeof left !== "string" && left.color !== this.color) {
          validMoves.push({ x: this.x + 1, y: this.y - 1 });
        }
      }
    }

    return checks
      ? validMoves.filter((move) => {
          const array: PieceType[][] = [...squares].map((a) => [...a]);
          array[move.x][move.y] = this;
          array[this.x][this.y] = "";
          let checked = false;
          // check for check from the enemy
          array.forEach((a) => {
            a.forEach((b) => {
              if (typeof b !== "string" && b.color !== this.color) {
                const captureMoves = b.capture(array, false);
                captureMoves.forEach((move) => {
                  const piece = array[move.x][move.y];
                  if (
                    typeof piece !== "string" &&
                    piece.color === this.color &&
                    piece.type === "king"
                  ) {
                    checked = true;
                  }
                });
              }
            });
          });
          return !checked;
        })
      : validMoves;
  }
}

class Rook extends Piece {
  constructor(x: number, y: number, color: "white" | "black") {
    super(x, y, color);
    this.type = "rook";
  }
  validMoves(squares: PieceType[][], checks: boolean = true) {
    const validMoves: { x: number; y: number }[] = [];
    // check for vertical moves
    for (let i = this.x + 1; i < 8; i++) {
      if (squares[i][this.y] === "") {
        validMoves.push({ x: i, y: this.y });
      } else {
        break;
      }
    }
    for (let i = this.x - 1; i >= 0; i--) {
      if (squares[i][this.y] === "") {
        validMoves.push({ x: i, y: this.y });
      } else {
        break;
      }
    }
    // check for horizontal moves
    for (let i = this.y + 1; i < 8; i++) {
      if (squares[this.x][i] === "") {
        validMoves.push({ x: this.x, y: i });
      } else {
        break;
      }
    }
    for (let i = this.y - 1; i >= 0; i--) {
      if (squares[this.x][i] === "") {
        validMoves.push({ x: this.x, y: i });
      } else {
        break;
      }
    }
    return checks
      ? validMoves.filter((move) => {
          const array: PieceType[][] = [...squares].map((a) => [...a]);
          array[move.x][move.y] = this;
          array[this.x][this.y] = "";
          let checked = false;
          // check for check from the enemy
          array.forEach((a) => {
            a.forEach((b) => {
              if (typeof b !== "string" && b.color !== this.color) {
                const captureMoves = b.capture(array, false);
                captureMoves.forEach((move) => {
                  const piece = array[move.x][move.y];
                  if (
                    typeof piece !== "string" &&
                    piece.color === this.color &&
                    piece.type === "king"
                  ) {
                    checked = true;
                  }
                });
              }
            });
          });
          return !checked;
        })
      : validMoves;
  }

  capture(squares: PieceType[][], checks: boolean = true) {
    const validMoves: { x: number; y: number }[] = [];
    // check for vertical moves
    for (let i = this.x + 1; i < 8; i++) {
      const piece = squares[i][this.y];
      if (typeof piece !== "string" && piece.color !== this.color) {
        validMoves.push({ x: i, y: this.y });
        break;
      } else if (typeof piece !== "string" && piece.color === this.color) {
        break;
      }
    }
    for (let i = this.x - 1; i >= 0; i--) {
      const piece = squares[i][this.y];
      if (typeof piece !== "string" && piece.color !== this.color) {
        validMoves.push({ x: i, y: this.y });
        break;
      } else if (typeof piece !== "string" && piece.color === this.color) {
        break;
      }
    }
    // check for horizontal moves
    for (let i = this.y + 1; i < 8; i++) {
      const piece = squares[this.x][i];
      if (typeof piece !== "string" && piece.color !== this.color) {
        validMoves.push({ x: this.x, y: i });
        break;
      } else if (typeof piece !== "string" && piece.color === this.color) {
        break;
      }
    }
    for (let i = this.y - 1; i >= 0; i--) {
      const piece = squares[this.x][i];
      if (typeof piece !== "string" && piece.color !== this.color) {
        validMoves.push({ x: this.x, y: i });
        break;
      } else if (typeof piece !== "string" && piece.color === this.color) {
        break;
      }
    }
    return checks
      ? validMoves.filter((move) => {
          const array: PieceType[][] = [...squares].map((a) => [...a]);
          array[move.x][move.y] = this;
          array[this.x][this.y] = "";
          let checked = false;
          // check for check from the enemy
          array.forEach((a) => {
            a.forEach((b) => {
              if (typeof b !== "string" && b.color !== this.color) {
                const captureMoves = b.capture(array, false);
                captureMoves.forEach((move) => {
                  const piece = array[move.x][move.y];
                  if (
                    typeof piece !== "string" &&
                    piece.color === this.color &&
                    piece.type === "king"
                  ) {
                    checked = true;
                  }
                });
              }
            });
          });
          return !checked;
        })
      : validMoves;
  }
}

class Knight extends Piece {
  constructor(x: number, y: number, color: "white" | "black") {
    super(x, y, color);
    this.type = "knight";
  }

  validMoves(squares: PieceType[][], checks: boolean = true) {
    const validMoves: { x: number; y: number }[] = [];
    // check for vertical moves
    if (this.x < 6) {
      if (this.y < 7) {
        if (squares[this.x + 2][this.y + 1] === "") {
          validMoves.push({ x: this.x + 2, y: this.y + 1 });
        }
      }
      if (this.y > 0) {
        if (squares[this.x + 2][this.y - 1] === "") {
          validMoves.push({ x: this.x + 2, y: this.y - 1 });
        }
      }
    }
    if (this.x > 1) {
      if (this.y < 7) {
        if (squares[this.x - 2][this.y + 1] === "") {
          validMoves.push({ x: this.x - 2, y: this.y + 1 });
        }
      }
      if (this.y > 0) {
        if (squares[this.x - 2][this.y - 1] === "") {
          validMoves.push({ x: this.x - 2, y: this.y - 1 });
        }
      }
    }
    // check for horizontal moves
    if (this.y < 6) {
      if (this.x < 7) {
        if (squares[this.x + 1][this.y + 2] === "") {
          validMoves.push({ x: this.x + 1, y: this.y + 2 });
        }
      }
      if (this.x > 0) {
        if (squares[this.x - 1][this.y + 2] === "") {
          validMoves.push({ x: this.x - 1, y: this.y + 2 });
        }
      }
    }
    if (this.y > 1) {
      if (this.x < 7) {
        if (squares[this.x + 1][this.y - 2] === "") {
          validMoves.push({ x: this.x + 1, y: this.y - 2 });
        }
      }
      if (this.x > 0) {
        if (squares[this.x - 1][this.y - 2] === "") {
          validMoves.push({ x: this.x - 1, y: this.y - 2 });
        }
      }
    }
    return checks
      ? validMoves.filter((move) => {
          const array: PieceType[][] = [...squares].map((a) => [...a]);
          array[move.x][move.y] = this;
          array[this.x][this.y] = "";
          let checked = false;
          // check for check from the enemy
          array.forEach((a) => {
            a.forEach((b) => {
              if (typeof b !== "string" && b.color !== this.color) {
                const captureMoves = b.capture(array, false);
                captureMoves.forEach((move) => {
                  const piece = array[move.x][move.y];
                  if (
                    typeof piece !== "string" &&
                    piece.color === this.color &&
                    piece.type === "king"
                  ) {
                    checked = true;
                  }
                });
              }
            });
          });
          return !checked;
        })
      : validMoves;
  }

  capture(squares: PieceType[][], checks: boolean = true) {
    const validMoves: { x: number; y: number }[] = [];
    // check for vertical moves
    if (this.x < 6) {
      if (this.y < 7) {
        const piece = squares[this.x + 2][this.y + 1];
        if (typeof piece !== "string" && piece.color !== this.color) {
          validMoves.push({ x: this.x + 2, y: this.y + 1 });
        }
      }
      if (this.y > 0) {
        const piece = squares[this.x + 2][this.y - 1];
        if (typeof piece !== "string" && piece.color !== this.color) {
          validMoves.push({ x: this.x + 2, y: this.y - 1 });
        }
      }
    }
    if (this.x > 1) {
      if (this.y < 7) {
        const piece = squares[this.x - 2][this.y + 1];
        if (typeof piece !== "string" && piece.color !== this.color) {
          validMoves.push({ x: this.x - 2, y: this.y + 1 });
        }
      }
      if (this.y > 0) {
        const piece = squares[this.x - 2][this.y - 1];
        if (typeof piece !== "string" && piece.color !== this.color) {
          validMoves.push({ x: this.x - 2, y: this.y - 1 });
        }
      }
    }
    // check for horizontal moves
    if (this.y < 6) {
      if (this.x < 7) {
        const piece = squares[this.x + 1][this.y + 2];
        if (typeof piece !== "string" && piece.color !== this.color) {
          validMoves.push({ x: this.x + 1, y: this.y + 2 });
        }
      }
      if (this.x > 0) {
        const piece = squares[this.x - 1][this.y + 2];
        if (typeof piece !== "string" && piece.color !== this.color) {
          validMoves.push({ x: this.x - 1, y: this.y + 2 });
        }
      }
    }
    if (this.y > 1) {
      if (this.x < 7) {
        const piece = squares[this.x + 1][this.y - 2];
        if (typeof piece !== "string" && piece.color !== this.color) {
          validMoves.push({ x: this.x + 1, y: this.y - 2 });
        }
      }
      if (this.x > 0) {
        const piece = squares[this.x - 1][this.y - 2];
        if (typeof piece !== "string" && piece.color !== this.color) {
          validMoves.push({ x: this.x - 1, y: this.y - 2 });
        }
      }
    }
    return checks
      ? validMoves.filter((move) => {
          const array: PieceType[][] = [...squares].map((a) => [...a]);
          array[move.x][move.y] = this;
          array[this.x][this.y] = "";
          let checked = false;
          // check for check from the enemy
          array.forEach((a) => {
            a.forEach((b) => {
              if (typeof b !== "string" && b.color !== this.color) {
                const captureMoves = b.capture(array, false);
                captureMoves.forEach((move) => {
                  const piece = array[move.x][move.y];
                  if (
                    typeof piece !== "string" &&
                    piece.color === this.color &&
                    piece.type === "king"
                  ) {
                    checked = true;
                  }
                });
              }
            });
          });
          return !checked;
        })
      : validMoves;
  }
}

class Bishop extends Piece {
  constructor(x: number, y: number, color: "white" | "black") {
    super(x, y, color);
    this.type = "bishop";
  }

  validMoves(squares: PieceType[][], checks: boolean = true) {
    const validMoves: { x: number; y: number }[] = [];
    // check for diagonal moves
    for (let i = this.x + 1, j = this.y + 1; i < 8 && j < 8; i++, j++) {
      if (squares[i][j] === "") {
        validMoves.push({ x: i, y: j });
      } else {
        break;
      }
    }
    for (let i = this.x - 1, j = this.y - 1; i >= 0 && j >= 0; i--, j--) {
      if (squares[i][j] === "") {
        validMoves.push({ x: i, y: j });
      } else {
        break;
      }
    }
    for (let i = this.x + 1, j = this.y - 1; i < 8 && j >= 0; i++, j--) {
      if (squares[i][j] === "") {
        validMoves.push({ x: i, y: j });
      } else {
        break;
      }
    }
    for (let i = this.x - 1, j = this.y + 1; i >= 0 && j < 8; i--, j++) {
      if (squares[i][j] === "") {
        validMoves.push({ x: i, y: j });
      } else {
        break;
      }
    }
    return checks
      ? validMoves.filter((move) => {
          const array: PieceType[][] = [...squares].map((a) => [...a]);
          array[move.x][move.y] = this;
          array[this.x][this.y] = "";
          let checked = false;
          // check for check from the enemy
          array.forEach((a) => {
            a.forEach((b) => {
              if (typeof b !== "string" && b.color !== this.color) {
                const captureMoves = b.capture(array, false);
                captureMoves.forEach((move) => {
                  const piece = array[move.x][move.y];
                  if (
                    typeof piece !== "string" &&
                    piece.color === this.color &&
                    piece.type === "king"
                  ) {
                    checked = true;
                  }
                });
              }
            });
          });
          return !checked;
        })
      : validMoves;
  }

  capture(squares: PieceType[][], checks: boolean = true) {
    const validMoves: { x: number; y: number }[] = [];
    // check for diagonal moves
    for (let i = this.x + 1, j = this.y + 1; i < 8 && j < 8; i++, j++) {
      const piece = squares[i][j];
      if (typeof piece !== "string" && piece.color !== this.color) {
        validMoves.push({ x: i, y: j });
        break;
      } else if (typeof piece !== "string" && piece.color === this.color) {
        break;
      }
    }

    for (let i = this.x - 1, j = this.y - 1; i >= 0 && j >= 0; i--, j--) {
      const piece = squares[i][j];
      if (typeof piece !== "string" && piece.color !== this.color) {
        validMoves.push({ x: i, y: j });
        break;
      } else if (typeof piece !== "string" && piece.color === this.color) {
        break;
      }
    }

    for (let i = this.x + 1, j = this.y - 1; i < 8 && j >= 0; i++, j--) {
      const piece = squares[i][j];
      if (typeof piece !== "string" && piece.color !== this.color) {
        validMoves.push({ x: i, y: j });
        break;
      } else if (typeof piece !== "string" && piece.color === this.color) {
        break;
      }
    }

    for (let i = this.x - 1, j = this.y + 1; i >= 0 && j < 8; i--, j++) {
      const piece = squares[i][j];
      if (typeof piece !== "string" && piece.color !== this.color) {
        validMoves.push({ x: i, y: j });
        break;
      } else if (typeof piece !== "string" && piece.color === this.color) {
        break;
      }
    }
    return checks
      ? validMoves.filter((move) => {
          const array: PieceType[][] = [...squares].map((a) => [...a]);
          array[move.x][move.y] = this;
          array[this.x][this.y] = "";
          let checked = false;
          // check for check from the enemy
          array.forEach((a) => {
            a.forEach((b) => {
              if (typeof b !== "string" && b.color !== this.color) {
                const captureMoves = b.capture(array, false);
                captureMoves.forEach((move) => {
                  const piece = array[move.x][move.y];
                  if (
                    typeof piece !== "string" &&
                    piece.color === this.color &&
                    piece.type === "king"
                  ) {
                    checked = true;
                  }
                });
              }
            });
          });
          return !checked;
        })
      : validMoves;
  }
}

class Queen extends Piece {
  constructor(x: number, y: number, color: "white" | "black") {
    super(x, y, color);
    this.type = "queen";
  }

  validMoves(squares: PieceType[][], checks: boolean = true) {
    const validMoves: { x: number; y: number }[] = [];
    // check for vertical moves
    for (let i = this.x + 1; i < 8; i++) {
      if (squares[i][this.y] === "") {
        validMoves.push({ x: i, y: this.y });
      } else {
        break;
      }
    }
    for (let i = this.x - 1; i >= 0; i--) {
      if (squares[i][this.y] === "") {
        validMoves.push({ x: i, y: this.y });
      } else {
        break;
      }
    }
    // check for horizontal moves
    for (let i = this.y + 1; i < 8; i++) {
      if (squares[this.x][i] === "") {
        validMoves.push({ x: this.x, y: i });
      } else {
        break;
      }
    }
    for (let i = this.y - 1; i >= 0; i--) {
      if (squares[this.x][i] === "") {
        validMoves.push({ x: this.x, y: i });
      } else {
        break;
      }
    }
    // check for diagonal moves
    for (let i = this.x + 1, j = this.y + 1; i < 8 && j < 8; i++, j++) {
      if (squares[i][j] === "") {
        validMoves.push({ x: i, y: j });
      } else {
        break;
      }
    }

    for (let i = this.x - 1, j = this.y - 1; i >= 0 && j >= 0; i--, j--) {
      if (squares[i][j] === "") {
        validMoves.push({ x: i, y: j });
      } else {
        break;
      }
    }

    for (let i = this.x + 1, j = this.y - 1; i < 8 && j >= 0; i++, j--) {
      if (squares[i][j] === "") {
        validMoves.push({ x: i, y: j });
      } else {
        break;
      }
    }

    for (let i = this.x - 1, j = this.y + 1; i >= 0 && j < 8; i--, j++) {
      if (squares[i][j] === "") {
        validMoves.push({ x: i, y: j });
      } else {
        break;
      }
    }
    return checks
      ? validMoves.filter((move) => {
          const array: PieceType[][] = [...squares].map((a) => [...a]);
          array[move.x][move.y] = this;
          array[this.x][this.y] = "";
          let checked = false;
          // check for check from the enemy
          array.forEach((a) => {
            a.forEach((b) => {
              if (typeof b !== "string" && b.color !== this.color) {
                const captureMoves = b.capture(array, false);
                captureMoves.forEach((move) => {
                  const piece = array[move.x][move.y];
                  if (
                    typeof piece !== "string" &&
                    piece.color === this.color &&
                    piece.type === "king"
                  ) {
                    checked = true;
                  }
                });
              }
            });
          });
          return !checked;
        })
      : validMoves;
  }

  capture(squares: PieceType[][], checks: boolean = true) {
    const validMoves: { x: number; y: number }[] = [];
    // check for vertical moves
    for (let i = this.x + 1; i < 8; i++) {
      const piece = squares[i][this.y];
      if (typeof piece !== "string" && piece.color !== this.color) {
        validMoves.push({ x: i, y: this.y });
        break;
      } else if (typeof piece !== "string" && piece.color === this.color) {
        break;
      }
    }
    for (let i = this.x - 1; i >= 0; i--) {
      const piece = squares[i][this.y];
      if (typeof piece !== "string" && piece.color !== this.color) {
        validMoves.push({ x: i, y: this.y });
        break;
      } else if (typeof piece !== "string" && piece.color === this.color) {
        break;
      }
    }
    // check for horizontal moves
    for (let i = this.y + 1; i < 8; i++) {
      const piece = squares[this.x][i];
      if (typeof piece !== "string" && piece.color !== this.color) {
        validMoves.push({ x: this.x, y: i });
        break;
      } else if (typeof piece !== "string" && piece.color === this.color) {
        break;
      }
    }
    for (let i = this.y - 1; i >= 0; i--) {
      const piece = squares[this.x][i];
      if (typeof piece !== "string" && piece.color !== this.color) {
        validMoves.push({ x: this.x, y: i });
        break;
      } else if (typeof piece !== "string" && piece.color === this.color) {
        break;
      }
    }
    // check for diagonal moves
    for (let i = this.x + 1, j = this.y + 1; i < 8 && j < 8; i++, j++) {
      const piece = squares[i][j];
      if (typeof piece !== "string" && piece.color !== this.color) {
        validMoves.push({ x: i, y: j });
        break;
      } else if (typeof piece !== "string" && piece.color === this.color) {
        break;
      }
    }

    for (let i = this.x - 1, j = this.y - 1; i >= 0 && j >= 0; i--, j--) {
      const piece = squares[i][j];
      if (typeof piece !== "string" && piece.color !== this.color) {
        validMoves.push({ x: i, y: j });
        break;
      } else if (typeof piece !== "string" && piece.color === this.color) {
        break;
      }
    }

    for (let i = this.x + 1, j = this.y - 1; i < 8 && j >= 0; i++, j--) {
      const piece = squares[i][j];
      if (typeof piece !== "string" && piece.color !== this.color) {
        validMoves.push({ x: i, y: j });
        break;
      } else if (typeof piece !== "string" && piece.color === this.color) {
        break;
      }
    }

    for (let i = this.x - 1, j = this.y + 1; i >= 0 && j < 8; i--, j++) {
      const piece = squares[i][j];
      if (typeof piece !== "string" && piece.color !== this.color) {
        validMoves.push({ x: i, y: j });
        break;
      } else if (typeof piece !== "string" && piece.color === this.color) {
        break;
      }
    }
    return checks
      ? validMoves.filter((move) => {
          const array: PieceType[][] = [...squares].map((a) => [...a]);
          array[move.x][move.y] = this;
          array[this.x][this.y] = "";
          let checked = false;
          // check for check from the enemy
          array.forEach((a) => {
            a.forEach((b) => {
              if (typeof b !== "string" && b.color !== this.color) {
                const captureMoves = b.capture(array, false);
                captureMoves.forEach((move) => {
                  const piece = array[move.x][move.y];
                  if (
                    typeof piece !== "string" &&
                    piece.color === this.color &&
                    piece.type === "king"
                  ) {
                    checked = true;
                  }
                });
              }
            });
          });
          return !checked;
        })
      : validMoves;
  }
}

class King extends Piece {
  constructor(x: number, y: number, color: "white" | "black") {
    super(x, y, color);
    this.type = "king";
  }

  validMoves(squares: PieceType[][], checks: boolean = true) {
    const validMoves: { x: number; y: number }[] = [];
    // check for vertical moves
    if (this.x < 7) {
      if (squares[this.x + 1][this.y] === "") {
        validMoves.push({ x: this.x + 1, y: this.y });
      }
      if (this.y < 7) {
        if (squares[this.x + 1][this.y + 1] === "") {
          validMoves.push({ x: this.x + 1, y: this.y + 1 });
        }
      }
      if (this.y > 0) {
        if (squares[this.x + 1][this.y - 1] === "") {
          validMoves.push({ x: this.x + 1, y: this.y - 1 });
        }
      }
    }
    if (this.x > 0) {
      if (squares[this.x - 1][this.y] === "") {
        validMoves.push({ x: this.x - 1, y: this.y });
      }
      if (this.y < 7) {
        if (squares[this.x - 1][this.y + 1] === "") {
          validMoves.push({ x: this.x - 1, y: this.y + 1 });
        }
      }
      if (this.y > 0) {
        if (squares[this.x - 1][this.y - 1] === "") {
          validMoves.push({ x: this.x - 1, y: this.y - 1 });
        }
      }
    }
    // check for horizontal moves
    if (this.y < 7) {
      if (squares[this.x][this.y + 1] === "") {
        validMoves.push({ x: this.x, y: this.y + 1 });
      }
    }
    if (this.y > 0) {
      if (squares[this.x][this.y - 1] === "") {
        validMoves.push({ x: this.x, y: this.y - 1 });
      }
    }
    const moves = checks
      ? validMoves.filter((move) => {
          const array: PieceType[][] = [...squares].map((a) => [...a]);
          array[move.x][move.y] = this;
          array[this.x][this.y] = "";
          let checked = false;
          // check for check from the enemy
          array.forEach((a) => {
            a.forEach((b) => {
              if (typeof b !== "string" && b.color !== this.color) {
                const captureMoves = b.capture(array, false);
                captureMoves.forEach((move) => {
                  const piece = array[move.x][move.y];
                  if (
                    typeof piece !== "string" &&
                    piece.color === this.color &&
                    piece.type === "king"
                  ) {
                    checked = true;
                  }
                });
              }
            });
          });
          return !checked;
        })
      : validMoves;
    return [...moves, ...this.castle(squares)];
  }

  capture(squares: PieceType[][]) {
    const validMoves: { x: number; y: number }[] = [];
    // check for vertical moves
    if (this.x < 7) {
      const piece = squares[this.x + 1][this.y];
      if (typeof piece !== "string" && piece.color !== this.color) {
        validMoves.push({ x: this.x + 1, y: this.y });
      }

      if (this.y < 7) {
        const piece = squares[this.x + 1][this.y + 1];
        if (typeof piece !== "string" && piece.color !== this.color) {
          validMoves.push({ x: this.x + 1, y: this.y + 1 });
        }
      }
      if (this.y > 0) {
        const piece = squares[this.x + 1][this.y - 1];
        if (typeof piece !== "string" && piece.color !== this.color) {
          validMoves.push({ x: this.x + 1, y: this.y - 1 });
        }
      }
    }

    if (this.x > 0) {
      const piece = squares[this.x - 1][this.y];
      if (typeof piece !== "string" && piece.color !== this.color) {
        validMoves.push({ x: this.x - 1, y: this.y });
      }
      if (this.y < 7) {
        const piece = squares[this.x - 1][this.y + 1];
        if (typeof piece !== "string" && piece.color !== this.color) {
          validMoves.push({ x: this.x - 1, y: this.y + 1 });
        }
      }
      if (this.y > 0) {
        const piece = squares[this.x - 1][this.y - 1];
        if (typeof piece !== "string" && piece.color !== this.color) {
          validMoves.push({ x: this.x - 1, y: this.y - 1 });
        }
      }
    }
    // check for horizontal moves
    if (this.y < 7) {
      const piece = squares[this.x][this.y + 1];
      if (typeof piece !== "string" && piece.color !== this.color) {
        validMoves.push({ x: this.x, y: this.y + 1 });
      }
    }
    if (this.y > 0) {
      const piece = squares[this.x][this.y - 1];
      if (typeof piece !== "string" && piece.color !== this.color) {
        validMoves.push({ x: this.x, y: this.y - 1 });
      }
    }
    return validMoves.filter((move) => {
      const array: PieceType[][] = [...squares].map((a) => [...a]);
      array[move.x][move.y] = this;
      array[this.x][this.y] = "";
      let checked = false;
      // check for check from the enemy
      array.forEach((a) => {
        a.forEach((b) => {
          if (typeof b !== "string" && b.color !== this.color) {
            const captureMoves = b.capture(array, false);
            captureMoves.forEach((move) => {
              const piece = array[move.x][move.y];
              if (
                typeof piece !== "string" &&
                piece.color === this.color &&
                piece.type === "king"
              ) {
                checked = true;
              }
            });
          }
        });
      });
      return !checked;
    });
  }

  castle(squares: PieceType[][]) {
    if (this.hasMoved) return [];
    // check for checks on the king
    const array: PieceType[][] = [...squares].map((a) => [...a]);
    let checked = false;
    array.forEach((a) => {
      a.forEach((b) => {
        if (typeof b !== "string" && b.color !== this.color) {
          const captureMoves = b.capture(array, false);
          captureMoves.forEach((move) => {
            const piece = array[move.x][move.y];
            if (
              typeof piece !== "string" &&
              piece.color === this.color &&
              piece.type === "king"
            ) {
              checked = true;
            }
          });
        }
      });
    });
    if (checked) return [];

    const validMoves: { x: number; y: number }[] = [];
    if (this.color === "white") {
      const kingSide = squares[7][7];
      const queenSide = squares[7][0];
      if (
        typeof kingSide !== "string" &&
        kingSide.type === "rook" &&
        !kingSide.hasMoved
      ) {
        let canCastle = true;
        array.forEach((a) => {
          a.forEach((b) => {
            if (typeof b !== "string" && b.color !== this.color) {
              const validMoves = b.validMoves(array, false);
              if (validMoves.some((move) => move.x === 7 && move.y === 5)) {
                canCastle = false;
              }
            }
          });
        });
        if (squares[7][5] === "" && squares[7][6] === "" && canCastle) {
          validMoves.push({ x: 7, y: 6 });
        }
      }
      if (
        typeof queenSide !== "string" &&
        queenSide.type === "rook" &&
        !queenSide.hasMoved
      ) {
        let canCastle = true;
        array.forEach((a) => {
          a.forEach((b) => {
            if (typeof b !== "string" && b.color !== this.color) {
              const validMoves = b.validMoves(array, false);
              if (validMoves.some((move) => move.x === 7 && move.y === 5)) {
                canCastle = false;
              }
            }
          });
        });
        if (
          squares[7][1] === "" &&
          squares[7][2] === "" &&
          squares[7][3] === "" &&
          canCastle
        ) {
          validMoves.push({ x: 7, y: 2 });
        }
      }
    } else {
      const kingSide = squares[0][7];
      const queenSide = squares[0][0];
      if (
        typeof kingSide !== "string" &&
        kingSide.type === "rook" &&
        !kingSide.hasMoved
      ) {
        if (squares[0][5] === "" && squares[0][6] === "") {
          validMoves.push({ x: 0, y: 6 });
        }
      }
      if (
        typeof queenSide !== "string" &&
        queenSide.type === "rook" &&
        !queenSide.hasMoved
      ) {
        if (
          squares[0][1] === "" &&
          squares[0][2] === "" &&
          squares[0][3] === ""
        ) {
          validMoves.push({ x: 0, y: 2 });
        }
      }
    }
    return validMoves.filter((move) => {
      const array: PieceType[][] = [...squares].map((a) => [...a]);
      array[move.x][move.y] = this;
      array[this.x][this.y] = "";
      let checked = false;
      // check for check from the enemy
      array.forEach((a) => {
        a.forEach((b) => {
          if (typeof b !== "string" && b.color !== this.color) {
            const captureMoves = b.capture(array, false);
            captureMoves.forEach((move) => {
              const piece = array[move.x][move.y];
              if (
                typeof piece !== "string" &&
                piece.color === this.color &&
                piece.type === "king"
              ) {
                checked = true;
              }
            });
          }
        });
      });
      return !checked;
    });
  }
}
