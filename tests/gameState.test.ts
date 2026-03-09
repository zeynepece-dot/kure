import { describe, expect, it } from "vitest";
import { createInitialGameState, getCurrentPlayer } from "@/lib/game";

describe("gameState", () => {
  it("creates correct initial setup", () => {
    const state = createInitialGameState();
    expect(state.currentPlayer).toBe("purple");
    expect(state.pieces).toHaveLength(14);
    expect(state.pieces.filter((p) => p.color === "purple")).toHaveLength(7);
    expect(state.pieces.filter((p) => p.color === "orange")).toHaveLength(7);
    expect(state.winner).toBeNull();
  });

  it("returns current player", () => {
    const state = createInitialGameState("orange");
    expect(getCurrentPlayer(state)).toBe("orange");
  });
});
