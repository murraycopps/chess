import { Piece, PieceType } from ".";

export default class Pawn extends Piece {
    constructor(x: number, y: number, color: "white" | "black") {
      super(x, y, color);
      this.type = "pawn";
      this.value = 1;
    }
    validMoves(squares: PieceType[][], checks: boolean = true) {
      if(this.x === 0 || this.x === 7) return ([] as { x: number; y: number }[]);

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
      if(this.x === 0 || this.x === 7) return ([] as { x: number; y: number }[]);
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

    defended(squares: PieceType[][], checks: boolean = true) {
      if(this.x === 0 || this.x === 7) return ([] as { x: number; y: number }[]);
      // check for diagonal capture
      const validMoves: { x: number; y: number }[] = [];
      if (this.color === "white") {
        if (this.y < 7) {
          const right = squares[this.x - 1][this.y + 1];
          if (typeof right !== "string" && right.color === this.color) {
            validMoves.push({ x: this.x - 1, y: this.y + 1 });
          }
        }
        if (this.y > 0) {
          const left = squares[this.x - 1][this.y - 1];
          if (typeof left !== "string" && left.color === this.color) {
            validMoves.push({ x: this.x - 1, y: this.y - 1 });
          }
        }
      } else {
        if (this.y < 7) {
          const right = squares[this.x + 1][this.y + 1];
          if (typeof right !== "string" && right.color === this.color) {
            validMoves.push({ x: this.x + 1, y: this.y + 1 });
          }
        }
        if (this.y > 0) {
          const left = squares[this.x + 1][this.y - 1];
          if (typeof left !== "string" && left.color === this.color) {
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