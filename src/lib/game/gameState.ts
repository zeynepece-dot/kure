import { getInitialPieces } from "./rules";
import type { GameState, PlayerColor } from "./types";

export function createInitialGameState(startingPlayer: PlayerColor = "purple"): GameState {
  return {
    pieces: getInitialPieces(),
    currentPlayer: startingPlayer,
    winner: null,
    moveCount: 0,
    protectedPiece: null,
    history: [],
    warnings: {
      orange: 0,
      purple: 0,
    },
  };
}

export function getCurrentPlayer(state: GameState): PlayerColor {
  return state.currentPlayer;
}
