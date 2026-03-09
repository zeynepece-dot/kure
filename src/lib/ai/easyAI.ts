import { getValidMoves } from "../game/moves";
import type { GameState, Move } from "../game/types";

export function chooseEasyMove(state: GameState): Move | null {
  const validMoves = getValidMoves(state);
  if (validMoves.length === 0) {
    return null;
  }
  const index = Math.floor(Math.random() * validMoves.length);
  return validMoves[index];
}
