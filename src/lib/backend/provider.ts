import type { BackendUser, ListResult, SavedGamePayload, SavedGameRecord } from "./types";

export interface AuthService {
  register(email: string, password: string, name?: string): Promise<BackendUser>;
  login(email: string, password: string): Promise<BackendUser>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<BackendUser | null>;
  hasActiveSession(): Promise<boolean>;
}

export interface GameSaveService {
  listSavedGames(): Promise<ListResult<SavedGameRecord>>;
  createSavedGame(payload: SavedGamePayload): Promise<SavedGameRecord>;
  updateSavedGame(id: string, payload: SavedGamePayload): Promise<SavedGameRecord>;
  deleteSavedGame(id: string): Promise<void>;
  getSavedGame(id: string): Promise<SavedGameRecord>;
}

export interface BackendProvider {
  auth: AuthService;
  games: GameSaveService;
}
