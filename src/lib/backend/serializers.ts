import type { Models } from "appwrite";
import type { GameState, Move } from "@/lib/game";
import { createInitialGameState } from "@/lib/game";
import type { SavedGamePayload, SavedGameRecord } from "./types";
import { BackendError } from "./types";

interface SavedGameDocument extends Models.Document {
  userId: string;
  name: string;
  gameMode: SavedGamePayload["gameMode"];
  difficulty: SavedGamePayload["difficulty"];
  state: string;
  moveHistory: string;
}

export function serializeSavedGame(payload: SavedGamePayload) {
  // TODO: Appwrite JSON attribute destegi kullanilacaksa bu alanlari dogrudan JSON objesi olarak saklayin.
  return {
    name: payload.name.trim(),
    gameMode: payload.gameMode,
    difficulty: payload.difficulty,
    state: JSON.stringify(payload.state),
    moveHistory: JSON.stringify(payload.moveHistory),
  };
}

export function deserializeGameState(raw: string): GameState {
  const parsed = safeParse<GameState>(raw, "state");
  return {
    ...createInitialGameState(parsed.currentPlayer),
    ...parsed,
    history: Array.isArray(parsed.history) ? parsed.history : [],
    warnings: parsed.warnings ?? { purple: 0, orange: 0 },
  };
}

export function deserializeMoveHistory(raw: string): Move[] {
  const parsed = safeParse<Move[]>(raw, "moveHistory");
  return Array.isArray(parsed) ? parsed : [];
}

export function mapSavedGameDocument(document: SavedGameDocument): SavedGameRecord {
  return {
    id: document.$id,
    userId: document.userId,
    name: document.name,
    gameMode: document.gameMode,
    difficulty: document.difficulty,
    state: deserializeGameState(document.state),
    moveHistory: deserializeMoveHistory(document.moveHistory),
    createdAt: document.$createdAt,
    updatedAt: document.$updatedAt,
  };
}

function safeParse<T>(raw: string, field: string): T {
  try {
    return JSON.parse(raw) as T;
  } catch (cause) {
    throw new BackendError(`Kayitli oyun verisi okunamadi: ${field}`, "invalid_saved_game_payload", cause);
  }
}
