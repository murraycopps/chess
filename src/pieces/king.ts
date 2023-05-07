import { Piece, PieceType } from ".";

export default class King extends Piece {
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
  