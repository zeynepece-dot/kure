import { describe, expect, it } from "vitest";
import type { Models } from "appwrite";
import { createInitialGameState, type Move } from "@/lib/game";
import {
  deserializeGameState,
  deserializeMoveHistory,
  mapSavedGameDocument,
  serializeSavedGame,
} from "@/lib/backend/serializers";

describe("backend serializers", () => {
  it("serializes and deserializes saved game payloads without losing state", () => {
    const state = createInitialGameState("orange");
    const moveHistory: Move[] = [{ from: { row: 6, col: 0 }, to: { row: 5, col: 0 } }];

    const serialized = serializeSavedGame({
      name: "  Test Kayit  ",
      gameMode: "cpu",
      difficulty: "medium",
      state,
      moveHistory,
    });

    expect(serialized.name).toBe("Test Kayit");
    expect(deserializeGameState(serialized.state)).toEqual(state);
    expect(deserializeMoveHistory(serialized.moveHistory)).toEqual(moveHistory);
  });

  it("maps an Appwrite document into the normalized saved game record", () => {
    const state = createInitialGameState();
    const moveHistory: Move[] = [];

    const document = {
      $id: "save-1",
      $createdAt: "2026-03-22T10:00:00.000Z",
      $updatedAt: "2026-03-22T10:15:00.000Z",
      userId: "user-1",
      name: "Acilis",
      gameMode: "local",
      difficulty: "easy",
      state: JSON.stringify(state),
      moveHistory: JSON.stringify(moveHistory),
    } as Models.Document;

    const mapped = mapSavedGameDocument(document as never);

    expect(mapped.id).toBe("save-1");
    expect(mapped.userId).toBe("user-1");
    expect(mapped.name).toBe("Acilis");
    expect(mapped.state).toEqual(state);
    expect(mapped.moveHistory).toEqual(moveHistory);
  });
});
