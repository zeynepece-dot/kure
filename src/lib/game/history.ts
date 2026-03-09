import type { GameState } from "./types";

export function undoMove(state: GameState): GameState {
  if (state.history.length === 0) {
    return state;
  }

  const previous = state.history[state.history.length - 1];
  return {
    ...state,
    pieces: previous.pieces.map((p) => ({ ...p, position: { ...p.position } })),
    currentPlayer: previous.currentPlayer,
    winner: previous.winner,
    moveCount: previous.moveCount,
    protectedPiece: previous.protectedPiece ? { ...previous.protectedPiece } : null,
    history: state.history.slice(0, -1),
  };
}
