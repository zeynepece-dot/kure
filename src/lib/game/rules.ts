import { BOARD_SIZE, START_ROW } from "./constants";
import type {
  GameState,
  Move,
  MoveValidationResult,
  Piece,
  PlayerColor,
  Position,
} from "./types";
import { getPieceAt, isInsideBoard, isStraightOrDiagonalUnitMove } from "./utils";
import { wouldCreateFourInLine } from "./winCondition";

export function getOpponent(color: PlayerColor): PlayerColor {
  return color === "purple" ? "orange" : "purple";
}

export function canPieceMoveByStartRowRule(piece: Piece, to: Position): MoveValidationResult {
  const dr = to.row - piece.position.row;
  const dc = to.col - piece.position.col;

  if (Math.abs(dr) > 1 || Math.abs(dc) > 1 || (dr === 0 && dc === 0)) {
    return { valid: false, reason: "Tas bir birim hareket etmelidir." };
  }

  if (dr === 0) {
    return { valid: false, reason: "Yatay hareket yasak." };
  }

  const forward = piece.color === "purple" ? -1 : 1;
  const movingToStartRow = to.row === START_ROW[piece.color];

  if (!piece.hasLeftStartRow) {
    if (dr !== forward) {
      return {
        valid: false,
        reason: "Baslangic sirasindaki tas sadece ileri veya capraz ileri gidebilir.",
      };
    }
  } else {
    if (movingToStartRow) {
      return {
        valid: false,
        reason: "Baslangic sirasindan ayrilan tas geri donemez.",
      };
    }

    if (!isStraightOrDiagonalUnitMove(piece.position, to)) {
      return {
        valid: false,
        reason: "Tas sadece dikey veya capraz bir birim hareket edebilir.",
      };
    }
  }

  return { valid: true };
}

export function validateMove(state: GameState, move: Move): MoveValidationResult {
  if (state.winner) {
    return { valid: false, reason: "Oyun bitti." };
  }

  if (!isInsideBoard(move.from) || !isInsideBoard(move.to)) {
    return { valid: false, reason: "Hamle tahta disinda." };
  }

  const piece = getPieceAt(state.pieces, move.from);
  if (!piece) {
    return { valid: false, reason: "Secilen konumda tas yok." };
  }

  if (piece.color !== state.currentPlayer) {
    return { valid: false, reason: "Sira diger oyuncuda." };
  }

  if (getPieceAt(state.pieces, move.to)) {
    return { valid: false, reason: "Hedef kuyu dolu." };
  }

  const movementValidation = canPieceMoveByStartRowRule(piece, move.to);
  if (!movementValidation.valid) {
    return movementValidation;
  }

  const nextPieces = state.pieces.map((p) =>
    p.id === piece.id
      ? {
          ...p,
          position: move.to,
          hasLeftStartRow: p.hasLeftStartRow || p.position.row !== START_ROW[p.color],
        }
      : p,
  );

  if (countPiecesInOpponentStartRow(nextPieces, piece.color) > 1) {
    return {
      valid: false,
      reason: "Rakibin baslangic sirasinda ayni anda en fazla bir tas olabilir.",
    };
  }

  if (wouldCreateFourInLine(nextPieces, piece.color)) {
    return { valid: false, reason: "Kendi taslarini dortlu hizalamak yasak." };
  }

  return { valid: true };
}

export function countPiecesInOpponentStartRow(pieces: Piece[], player: PlayerColor): number {
  const opponentStartRow = START_ROW[getOpponent(player)];
  return pieces.filter((p) => p.color === player && p.position.row === opponentStartRow).length;
}

export function getInitialPieces(): Piece[] {
  const purplePieces: Piece[] = Array.from({ length: BOARD_SIZE }, (_, i) => ({
    id: `P${i + 1}`,
    color: "purple",
    position: { row: START_ROW.purple, col: i },
    hasLeftStartRow: false,
  }));

  const orangePieces: Piece[] = Array.from({ length: BOARD_SIZE }, (_, i) => ({
    id: `O${i + 1}`,
    color: "orange",
    position: { row: START_ROW.orange, col: i },
    hasLeftStartRow: false,
  }));

  return [...purplePieces, ...orangePieces];
}
