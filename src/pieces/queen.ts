import { Piece, PieceType } from ".";

export default class Queen extends Piece {
    constructor(x: number, y: number, color: "white" | "black") {
      super(x, y, color);
      this.type = "queen";
      this.value = 9;
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

    defended(squares: PieceType[][], checks: boolean = true) {
      const validMoves: { x: number; y: number }[] = [];
      // check for vertical moves
      for (let i = this.x + 1; i < 8; i++) {
        const piece = squares[i][this.y];
        if (typeof piece !== "string" && piece.color === this.color) {
          validMoves.push({ x: i, y: this.y });
          break;
        } else if (typeof piece !== "string" && piece.color !== this.color) {
          break;
        }
      }
      for (let i = this.x - 1; i >= 0; i--) {
        const piece = squares[i][this.y];
        if (typeof piece !== "string" && piece.color === this.color) {
          validMoves.push({ x: i, y: this.y });
          break;
        } else if (typeof piece !== "string" && piece.color !== this.color) {
          break;
        }
      }
      // check for horizontal moves
      for (let i = this.y + 1; i < 8; i++) {
        const piece = squares[this.x][i];
        if (typeof piece !== "string" && piece.color === this.color) {
          validMoves.push({ x: this.x, y: i });
          break;
        } else if (typeof piece !== "string" && piece.color !== this.color) {
          break;
        }
      }
      for (let i = this.y - 1; i >= 0; i--) {
        const piece = squares[this.x][i];
        if (typeof piece !== "string" && piece.color === this.color) {
          validMoves.push({ x: this.x, y: i });
          break;
        } else if (typeof piece !== "string" && piece.color !== this.color) {
          break;
        }
      }
      // check for diagonal moves
      for (let i = this.x + 1, j = this.y + 1; i < 8 && j < 8; i++, j++) {
        const piece = squares[i][j];
        if (typeof piece !== "string" && piece.color === this.color) {
          validMoves.push({ x: i, y: j });
          break;
        } else if (typeof piece !== "string" && piece.color !== this.color) {
          break;
        }
      }
  
      for (let i = this.x - 1, j = this.y - 1; i >= 0 && j >= 0; i--, j--) {
        const piece = squares[i][j];
        if (typeof piece !== "string" && piece.color === this.color) {
          validMoves.push({ x: i, y: j });
          break;
        } else if (typeof piece !== "string" && piece.color !== this.color) {
          break;
        }
      }
  
      for (let i = this.x + 1, j = this.y - 1; i < 8 && j >= 0; i++, j--) {
        const piece = squares[i][j];
        if (typeof piece !== "string" && piece.color === this.color) {
          validMoves.push({ x: i, y: j });
          break;
        } else if (typeof piece !== "string" && piece.color !== this.color) {
          break;
        }
      }
  
      for (let i = this.x - 1, j = this.y + 1; i >= 0 && j < 8; i--, j++) {
        const piece = squares[i][j];
        if (typeof piece !== "string" && piece.color === this.color) {
          validMoves.push({ x: i, y: j });
          break;
        } else if (typeof piece !== "string" && piece.color !== this.color) {
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
  