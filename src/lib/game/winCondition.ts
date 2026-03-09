import { BOARD_SIZE, LINE_AXES, START_ROW, WIN_CAPTURE_COUNT } from "./constants";
import type { Piece, PlayerColor, Position, Winner } from "./types";

export function getCapturedCountByColor(pieces: Piece[], color: PlayerColor): number {
  return BOARD_SIZE - pieces.filter((p) => p.color === color).length;
}

function getLineStonesCount(
  pieces: Piece[],
  origin: Position,
  axis: { dr: number; dc: number },
  color: PlayerColor,
): number {
  const sameLine = pieces.filter((p) => p.color === color).filter((p) => {
    const rowDiff = p.position.row - origin.row;
    const colDiff = p.position.col - origin.col;
    return rowDiff * axis.dc === colDiff * axis.dr;
  });

  return sameLine.length;
}

export function wouldCreateFourInLine(pieces: Piece[], color: PlayerColor): boolean {
  const playerPieces = pieces.filter((p) => p.color === color && p.position.row !== START_ROW[color]);
  const effectivePieces = pieces.filter((p) => p.position.row !== START_ROW[p.color]);
  for (const piece of playerPieces) {
    for (const axis of LINE_AXES) {
      if (getLineStonesCount(effectivePieces, piece.position, axis, color) >= 4) {
        return true;
      }
    }
  }
  return false;
}

export function checkWinner(pieces: Piece[]): Winner {
  const capturedOrange = getCapturedCountByColor(pieces, "orange");
  if (capturedOrange >= WIN_CAPTURE_COUNT) {
    return "purple";
  }

  const capturedPurple = getCapturedCountByColor(pieces, "purple");
  if (capturedPurple >= WIN_CAPTURE_COUNT) {
    return "orange";
  }

  return null;
}
