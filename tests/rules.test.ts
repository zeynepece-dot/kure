import { describe, expect, it } from "vitest";
import { createInitialGameState, validateMove } from "@/lib/game";
import { makePiece, withPieces } from "./helpers";

describe("rules", () => {
  it("allows a valid opening forward move", () => {
    const state = createInitialGameState();
    const result = validateMove(state, { from: { row: 6, col: 3 }, to: { row: 5, col: 3 } });
    expect(result.valid).toBe(true);
  });

  it("rejects horizontal move", () => {
    const state = createInitialGameState();
    const result = validateMove(state, { from: { row: 6, col: 3 }, to: { row: 6, col: 4 } });
    expect(result.valid).toBe(false);
  });

  it("rejects second piece entering opponent start row simultaneously", () => {
    const state = withPieces(
      [
        makePiece("P1", "purple", 0, 1),
        makePiece("P2", "purple", 1, 3),
        makePiece("O1", "orange", 3, 3),
      ],
      "purple",
    );
    const result = validateMove(state, { from: { row: 1, col: 3 }, to: { row: 0, col: 3 } });
    expect(result.valid).toBe(false);
  });
});
