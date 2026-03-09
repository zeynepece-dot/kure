export type PlayerColor = "purple" | "orange";

export type GameMode = "local" | "cpu";
export type Difficulty = "easy" | "medium" | "hard";
export type Winner = PlayerColor | "draw" | null;

export interface Position {
  row: number;
  col: number;
}

export interface Move {
  from: Position;
  to: Position;
}

export interface Piece {
  id: string;
  color: PlayerColor;
  position: Position;
  hasLeftStartRow: boolean;
}

export interface ProtectedPiece {
  pieceId: string;
  expiresAfterTurn: PlayerColor;
}

export interface GameSnapshot {
  pieces: Piece[];
  currentPlayer: PlayerColor;
  winner: Winner;
  moveCount: number;
  protectedPiece: ProtectedPiece | null;
}

export interface GameState extends GameSnapshot {
  history: GameSnapshot[];
  warnings: Record<PlayerColor, number>;
}

export interface MoveValidationResult {
  valid: boolean;
  reason?: string;
}

export interface MoveResult {
  state: GameState;
  capturedPieceIds: string[];
}
