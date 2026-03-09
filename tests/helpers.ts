import { createInitialGameState, type GameState, type Piece, type PlayerColor, type Position } from "@/lib/game";

export function makePiece(id: string, color: PlayerColor, row: number, col: number, hasLeftStartRow = true): Piece {
  return {
    id,
    color,
    position: { row, col },
    hasLeftStartRow,
  };
}

export function withPieces(
  pieces: Piece[],
  currentPlayer: PlayerColor = "purple",
  moveCount = 0,
): GameState {
  const base = createInitialGameState(currentPlayer);
  return {
    ...base,
    pieces,
    currentPlayer,
    moveCount,
  };
}

export function pos(row: number, col: number): Position {
  return { row, col };
}
