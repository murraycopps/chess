export type PieceType =
  | {
      x: number;
      y: number;
      active: boolean;
      hanging: boolean;
      hasMoved: boolean;
      value: number;
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

export type PieceOptions =
  | "pawn"
  | "rook"
  | "knight"
  | "bishop"
  | "queen"
  | "king"
  | "";

export class Piece {
  x: number;
  y: number;
  active: boolean = false;
  hanging: boolean = false;
  hasMoved: boolean = false;
  value: number = 0;
  type: PieceOptions;
  color: "white" | "black";
  constructor(x: number, y: number, color: "white" | "black") {
    this.x = x;
    this.y = y;
    this.type = "";
    this.color = color;
  }
}