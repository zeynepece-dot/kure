import { evaluateBoard } from "./evaluation";
import { applyMove, getValidMoves } from "../game/moves";
import type { GameState, Move, PlayerColor } from "../game/types";

interface ScoredMove {
  move: Move | null;
  score: number;
}

function minimax(
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  maximizingFor: PlayerColor,
): ScoredMove {
  const validMoves = getValidMoves(state);
  if (depth === 0 || state.winner || validMoves.length === 0) {
    return { move: null, score: evaluateBoard(state, maximizingFor) };
  }

  const isMaximizing = state.currentPlayer === maximizingFor;
  let bestMove: Move | null = validMoves[0];

  if (isMaximizing) {
    let maxEval = Number.NEGATIVE_INFINITY;
    for (const move of validMoves) {
      const nextState = applyMove(state, move).state;
      const evaluated = minimax(nextState, depth - 1, alpha, beta, maximizingFor).score;
      if (evaluated > maxEval) {
        maxEval = evaluated;
        bestMove = move;
      }
      alpha = Math.max(alpha, evaluated);
      if (beta <= alpha) {
        break;
      }
    }
    return { move: bestMove, score: maxEval };
  }

  let minEval = Number.POSITIVE_INFINITY;
  for (const move of validMoves) {
    const nextState = applyMove(state, move).state;
    const evaluated = minimax(nextState, depth - 1, alpha, beta, maximizingFor).score;
    if (evaluated < minEval) {
      minEval = evaluated;
      bestMove = move;
    }
    beta = Math.min(beta, evaluated);
    if (beta <= alpha) {
      break;
    }
  }
  return { move: bestMove, score: minEval };
}

export function chooseHardMove(state: GameState): Move | null {
  const validMoves = getValidMoves(state);
  if (validMoves.length === 0) {
    return null;
  }

  const depth = 3;
  const result = minimax(state, depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, state.currentPlayer);
  return result.move ?? validMoves[0];
}
