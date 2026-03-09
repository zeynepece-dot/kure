import { describe, expect, it } from "vitest";
import { applyMove, createInitialGameState } from "@/lib/game";
import { undoMove } from "@/lib/game/history";

describe("history", () => {
  it("undoes the last move safely", () => {
    const state = createInitialGameState();
    const moved = applyMove(state, { from: { row: 6, col: 1 }, to: { row: 5, col: 1 } }).state;
    const undone = undoMove(moved);
    expect(undone.currentPlayer).toBe("purple");
    expect(undone.moveCount).toBe(0);
    expect(undone.pieces.find((p) => p.id === "P2")?.position).toEqual({ row: 6, col: 1 });
  });
});
