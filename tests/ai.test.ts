import { describe, expect, it } from "vitest";
import { chooseEasyMove, chooseHardMove, chooseMediumMove } from "@/lib/ai";
import { createInitialGameState, getValidMoves } from "@/lib/game";

describe("ai", () => {
  it("easy returns only valid move", () => {
    const state = createInitialGameState();
    const move = chooseEasyMove(state);
    expect(move).not.toBeNull();
    expect(
      getValidMoves(state).some(
        (m) =>
          m.from.row === move?.from.row &&
          m.from.col === move?.from.col &&
          m.to.row === move?.to.row &&
          m.to.col === move?.to.col,
      ),
    ).toBe(true);
  });

  it("medium and hard produce a move without crashing", () => {
    const state = createInitialGameState();
    const medium = chooseMediumMove(state);
    const hard = chooseHardMove(state);
    const validMoves = getValidMoves(state);
    expect(validMoves.length).toBeGreaterThan(0);
    expect(validMoves).toEqual(expect.arrayContaining([medium!]));
    expect(validMoves).toEqual(expect.arrayContaining([hard!]));
  });
});
