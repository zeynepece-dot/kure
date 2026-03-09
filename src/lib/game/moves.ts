import { DIRECTIONS, START_ROW } from "./constants";
import { getOpponent, validateMove } from "./rules";
import type {
  GameSnapshot,
  GameState,
  Move,
  MoveResult,
  Piece,
  PlayerColor,
  Position,
} from "./types";
import { getPieceAt, isInsideBoard } from "./utils";
import { checkWinner } from "./winCondition";

function isBetweenTwoOpponentPieces(pieces: Piece[], player: PlayerColor, pos: Position): boolean {
  const opponent = getOpponent(player);
  const axes = [
    [{ dr: 1, dc: 0 }, { dr: -1, dc: 0 }],
    [{ dr: 0, dc: 1 }, { dr: 0, dc: -1 }],
    [{ dr: 1, dc: 1 }, { dr: -1, dc: -1 }],
    [{ dr: 1, dc: -1 }, { dr: -1, dc: 1 }],
  ];

  return axes.some(([a, b]) => {
    const p1 = { row: pos.row + a.dr, col: pos.col + a.dc };
    const p2 = { row: pos.row + b.dr, col: pos.col + b.dc };
    if (!isInsideBoard(p1) || !isInsideBoard(p2)) {
      return false;
    }
    return getPieceAt(pieces, p1)?.color === opponent && getPieceAt(pieces, p2)?.color === opponent;
  });
}

function getCapturedOpponentIds(
  pieces: Piece[],
  movedPiece: Piece,
  protectedPieceId: string | null,
): string[] {
  const captures = new Set<string>();
  const opponent = getOpponent(movedPiece.color);

  for (const dir of DIRECTIONS) {
    const mid = { row: movedPiece.position.row + dir.dr, col: movedPiece.position.col + dir.dc };
    const end = { row: movedPiece.position.row + dir.dr * 2, col: movedPiece.position.col + dir.dc * 2 };
    if (!isInsideBoard(mid) || !isInsideBoard(end)) {
      continue;
    }
    const middlePiece = getPieceAt(pieces, mid);
    const endPiece = getPieceAt(pieces, end);

    if (
      middlePiece &&
      endPiece &&
      middlePiece.color === opponent &&
      endPiece.color === movedPiece.color &&
      middlePiece.id !== protectedPieceId
    ) {
      captures.add(middlePiece.id);
    }
  }

  return [...captures];
}

export function getValidMoves(state: GameState, color = state.currentPlayer): Move[] {
  if (state.winner) {
    return [];
  }
  const ownPieces = state.pieces.filter((p) => p.color === color);
  const moves: Move[] = [];

  for (const piece of ownPieces) {
    for (let dr = -1; dr <= 1; dr += 1) {
      for (let dc = -1; dc <= 1; dc += 1) {
        if (dr === 0 && dc === 0) {
          continue;
        }
        const target = { row: piece.position.row + dr, col: piece.position.col + dc };
        const move: Move = { from: piece.position, to: target };
        const candidateState: GameState =
          color === state.currentPlayer ? state : { ...state, currentPlayer: color };
        if (validateMove(candidateState, move).valid) {
          moves.push(move);
        }
      }
    }
  }
  return moves;
}

function toSnapshot(state: GameState): GameSnapshot {
  return {
    pieces: state.pieces.map((p) => ({ ...p, position: { ...p.position } })),
    currentPlayer: state.currentPlayer,
    winner: state.winner,
    moveCount: state.moveCount,
    protectedPiece: state.protectedPiece ? { ...state.protectedPiece } : null,
  };
}

export function applyMove(state: GameState, move: Move): MoveResult {
  const validation = validateMove(state, move);
  if (!validation.valid) {
    return { state, capturedPieceIds: [] };
  }

  const movingPiece = getPieceAt(state.pieces, move.from);
  if (!movingPiece) {
    return { state, capturedPieceIds: [] };
  }

  const movedPiece: Piece = {
    ...movingPiece,
    position: { ...move.to },
    hasLeftStartRow: movingPiece.hasLeftStartRow || move.to.row !== START_ROW[movingPiece.color],
  };

  const movedPieces = state.pieces.map((p) => (p.id === movingPiece.id ? movedPiece : p));

  let protectedPieceId: string | null = null;
  if (state.protectedPiece && state.protectedPiece.expiresAfterTurn === state.currentPlayer) {
    protectedPieceId = state.protectedPiece.pieceId;
  }

  const capturedPieceIds = getCapturedOpponentIds(movedPieces, movedPiece, protectedPieceId);
  const piecesAfterCapture = movedPieces.filter((p) => !capturedPieceIds.includes(p.id));

  const nextPlayer = getOpponent(state.currentPlayer);
  const protectedPiece = isBetweenTwoOpponentPieces(piecesAfterCapture, movedPiece.color, movedPiece.position)
    ? {
        pieceId: movedPiece.id,
        expiresAfterTurn: nextPlayer,
      }
    : null;

  const nextState: GameState = {
    ...state,
    history: [...state.history, toSnapshot(state)],
    pieces: piecesAfterCapture,
    currentPlayer: nextPlayer,
    moveCount: state.moveCount + 1,
    winner: checkWinner(piecesAfterCapture),
    protectedPiece,
  };

  return { state: nextState, capturedPieceIds };
}
