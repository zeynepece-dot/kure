import { BOARD_SIZE } from "./constants";
import type { Piece, Position } from "./types";

export function positionKey(pos: Position): string {
  return `${pos.row},${pos.col}`;
}

export function isInsideBoard(pos: Position): boolean {
  return pos.row >= 0 && pos.row < BOARD_SIZE && pos.col >= 0 && pos.col < BOARD_SIZE;
}

export function isStraightOrDiagonalUnitMove(from: Position, to: Position): boolean {
  const dr = to.row - from.row;
  const dc = to.col - from.col;

  if (Math.abs(dr) > 1 || Math.abs(dc) > 1 || (dr === 0 && dc === 0)) {
    return false;
  }

  return dr !== 0;
}

export function getPieceAt(pieces: Piece[], pos: Position): Piece | undefined {
  return pieces.find((p) => p.position.row === pos.row && p.position.col === pos.col);
}

export function clonePieces(pieces: Piece[]): Piece[] {
  return pieces.map((p) => ({
    ...p,
    position: { ...p.position },
  }));
}
