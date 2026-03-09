import { describe, expect, it } from "vitest";
import { applyMove, createInitialGameState, getPieceAt } from "@/lib/game";

describe("moves", () => {
  it("applies valid move and changes player turn", () => {
    const state = createInitialGameState();
    const { state: next } = applyMove(state, { from: { row: 6, col: 3 }, to: { row: 5, col: 3 } });
    expect(getPieceAt(next.pieces, { row: 5, col: 3 })?.color).toBe("purple");
    expect(next.currentPlayer).toBe("orange");
    expect(next.moveCount).toBe(1);
  });

  it("keeps state unchanged on invalid move", () => {
    const state = createInitialGameState();
    const { state: next } = applyMove(state, { from: { row: 6, col: 3 }, to: { row: 6, col: 4 } });
    expect(next).toBe(state);
  });
});
