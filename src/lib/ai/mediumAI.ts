import { evaluateBoard } from "./evaluation";
import { applyMove, getValidMoves } from "../game/moves";
import type { GameState, Move } from "../game/types";

export function chooseMediumMove(state: GameState): Move | null {
  const validMoves = getValidMoves(state);
  if (validMoves.length === 0) {
    return null;
  }

  let bestMove = validMoves[0];
  let bestScore = Number.NEGATIVE_INFINITY;
  const maximizingColor = state.currentPlayer;

  for (const move of validMoves) {
    const firstPly = applyMove(state, move).state;
    const replies = getValidMoves(firstPly);

    let moveScore = evaluateBoard(firstPly, maximizingColor);
    if (replies.length > 0) {
      const worstReply = replies.reduce((worst, reply) => {
        const replyState = applyMove(firstPly, reply).state;
        const score = evaluateBoard(replyState, maximizingColor);
        return Math.min(worst, score);
      }, Number.POSITIVE_INFINITY);
      moveScore = (moveScore + worstReply) / 2;
    }

    if (moveScore > bestScore) {
      bestScore = moveScore;
      bestMove = move;
    }
  }

  return bestMove;
}
