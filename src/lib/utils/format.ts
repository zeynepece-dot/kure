import type { PlayerColor, Winner } from "../game";

export function colorLabel(color: PlayerColor): string {
  return color === "purple" ? "Mor" : "Turuncu";
}

export function winnerLabel(winner: Winner): string {
  if (winner === "draw") {
    return "Berabere";
  }
  if (winner === "purple") {
    return "Mor";
  }
  if (winner === "orange") {
    return "Turuncu";
  }
  return "-";
}
