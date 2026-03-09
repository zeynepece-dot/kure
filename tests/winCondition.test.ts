import { describe, expect, it } from "vitest";
import { checkWinner, wouldCreateFourInLine } from "@/lib/game";
import { makePiece } from "./helpers";

describe("winCondition", () => {
  it("detects forbidden four-in-line", () => {
    const pieces = [
      makePiece("P1", "purple", 5, 0),
      makePiece("P2", "purple", 4, 1),
      makePiece("P3", "purple", 3, 2),
      makePiece("P4", "purple", 2, 3),
      makePiece("O1", "orange", 0, 0),
    ];
    expect(wouldCreateFourInLine(pieces, "purple")).toBe(true);
  });

  it("declares winner after capturing 4 opponent pieces", () => {
    const pieces = [
      makePiece("P1", "purple", 6, 0),
      makePiece("P2", "purple", 6, 1),
      makePiece("P3", "purple", 6, 2),
      makePiece("P4", "purple", 6, 3),
      makePiece("P5", "purple", 6, 4),
      makePiece("P6", "purple", 6, 5),
      makePiece("P7", "purple", 6, 6),
      makePiece("O1", "orange", 0, 0),
      makePiece("O2", "orange", 0, 1),
      makePiece("O3", "orange", 0, 2),
    ];
    expect(checkWinner(pieces)).toBe("purple");
  });
});
