import { BOARD_SIZE, START_ROW } from "../game/constants";
import { getValidMoves } from "../game/moves";
import { checkWinner, getCapturedCountByColor } from "../game/winCondition";
import type { GameState, PlayerColor } from "../game/types";

function advanceScore(state: GameState, color: PlayerColor): number {
  return state.pieces
    .filter((p) => p.color === color)
    .reduce((acc, p) => acc + Math.abs(p.position.row - START_ROW[color]), 0);
}

export function evaluateBoard(state: GameState, maximizingColor: PlayerColor): number {
  const winner = checkWinner(state.pieces);
  if (winner === maximizingColor) {
    return 10000;
  }
  if (winner && winner !== maximizingColor) {
    return -10000;
  }

  const opponent = maximizingColor === "purple" ? "orange" : "purple";

  const material =
    getCapturedCountByColor(state.pieces, opponent) - getCapturedCountByColor(state.pieces, maximizingColor);
  const mobility = getValidMoves(state, maximizingColor).length - getValidMoves(state, opponent).length;
  const progress = advanceScore(state, maximizingColor) - advanceScore(state, opponent);

  const startRowPressure =
    state.pieces.filter((p) => p.color === maximizingColor && p.position.row === START_ROW[opponent]).length *
    0.5;
  const edgePenalty = state.pieces
    .filter((p) => p.color === maximizingColor)
    .reduce((acc, p) => {
      const onEdge =
        p.position.row === 0 ||
        p.position.row === BOARD_SIZE - 1 ||
        p.position.col === 0 ||
        p.position.col === BOARD_SIZE - 1;
      return onEdge ? acc - 0.2 : acc;
    }, 0);

  return material * 30 + mobility * 2 + progress * 1.5 + startRowPressure + edgePenalty;
}
