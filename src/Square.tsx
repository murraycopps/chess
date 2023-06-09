import { PieceType } from "./pieces";

export default function Square({
  dark = false,
  piece,
  onClick,
  color = false,
}: {
  dark?: boolean;
  piece: PieceType;
  onClick: () => void;
  color?: boolean;
}) {
  return (
    <div
      className={`${
        color ? "bg-green-500" : dark ? "bg-dark" : "bg-light"
      } grid place-items-center aspect-square text-5xl font-bold ${
        piece === "valid-move" ? "cursor-pointer" : ""
      } ${
        typeof piece !== "string" && piece.active
          ? "border-4 border-blue-500"
          : ""
      } ${
        typeof piece !== "string" && piece.hanging
          ? "border-4 border-red-500"
          : ""
      }`}
      onClick={onClick}
    >
      {piece === "valid-move" ? (
        <p className="absolute text-gray-200 text-4xl text-shadow-black">•</p>
      ) : (
        <p
          className={`absolute ${
            typeof piece !== "string" && piece.color === "white"
              ? "text-white text-shadow-black"
              : "text-black text-shadow-white"
          }`}
        >
          {typeof piece !== "string" &&
            (piece.type === "pawn"
              ? "♟"
              : piece.type === "rook"
              ? "♜"
              : piece.type === "knight"
              ? "♞"
              : piece.type === "bishop"
              ? "♝"
              : piece.type === "queen"
              ? "♛"
              : "♚")}
        </p>
      )}
    </div>
  );
}
