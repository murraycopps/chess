import { Piece, PieceType } from ".";

export default class Knight extends Piece {
    constructor(x: number, y: number, color: "white" | "black") {
      super(x, y, color);
      this.type = "knight";
      this.value = 3;
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
    defended(squares: PieceType[][], checks: boolean = true) {
      const validMoves: { x: number; y: number }[] = [];
      // check for vertical moves
      if (this.x < 6) {
        if (this.y < 7) {
          const piece = squares[this.x + 2][this.y + 1];
          if (typeof piece !== "string" && piece.color === this.color) {
            validMoves.push({ x: this.x + 2, y: this.y + 1 });
          }
        }
        if (this.y > 0) {
          const piece = squares[this.x + 2][this.y - 1];
          if (typeof piece !== "string" && piece.color === this.color) {
            validMoves.push({ x: this.x + 2, y: this.y - 1 });
          }
        }
      }
      if (this.x > 1) {
        if (this.y < 7) {
          const piece = squares[this.x - 2][this.y + 1];
          if (typeof piece !== "string" && piece.color === this.color) {
            validMoves.push({ x: this.x - 2, y: this.y + 1 });
          }
        }
        if (this.y > 0) {
          const piece = squares[this.x - 2][this.y - 1];
          if (typeof piece !== "string" && piece.color === this.color) {
            validMoves.push({ x: this.x - 2, y: this.y - 1 });
          }
        }
      }
      // check for horizontal moves
      if (this.y < 6) {
        if (this.x < 7) {
          const piece = squares[this.x + 1][this.y + 2];
          if (typeof piece !== "string" && piece.color === this.color) {
            validMoves.push({ x: this.x + 1, y: this.y + 2 });
          }
        }
        if (this.x > 0) {
          const piece = squares[this.x - 1][this.y + 2];
          if (typeof piece !== "string" && piece.color === this.color) {
            validMoves.push({ x: this.x - 1, y: this.y + 2 });
          }
        }
      }
      if (this.y > 1) {
        if (this.x < 7) {
          const piece = squares[this.x + 1][this.y - 2];
          if (typeof piece !== "string" && piece.color === this.color) {
            validMoves.push({ x: this.x + 1, y: this.y - 2 });
          }
        }
        if (this.x > 0) {
          const piece = squares[this.x - 1][this.y - 2];
          if (typeof piece !== "string" && piece.color === this.color) {
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
  
  