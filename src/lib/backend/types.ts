import type { Difficulty, GameMode, GameState, Move } from "@/lib/game";

export interface BackendUser {
  id: string;
  email: string;
  name: string;
}

export interface SessionSummary {
  active: boolean;
  user: BackendUser | null;
}

export interface SavedGamePayload {
  name: string;
  gameMode: GameMode;
  difficulty: Difficulty;
  state: GameState;
  moveHistory: Move[];
}

export interface SavedGameRecord extends SavedGamePayload {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListResult<T> {
  documents: T[];
  total: number;
}

export class BackendError extends Error {
  code: string;
  cause?: unknown;

  constructor(message: string, code = "backend_error", cause?: unknown) {
    super(message);
    this.name = "BackendError";
    this.code = code;
    this.cause = cause;
  }
}
