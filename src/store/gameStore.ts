"use client";

import { create } from "zustand";
import { chooseEasyMove, chooseHardMove, chooseMediumMove } from "@/lib/ai";
import {
  applyMove,
  createInitialGameState,
  getPieceAt,
  getValidMoves,
  type Difficulty,
  type GameMode,
  type GameState,
  type Move,
  type PlayerColor,
  type Position,
} from "@/lib/game";
import { undoMove } from "@/lib/game/history";

interface GameStore {
  gameMode: GameMode;
  difficulty: Difficulty;
  state: GameState;
  selected: Position | null;
  statusMessage: string | null;
  moveHistory: Move[];
  setMode: (mode: GameMode) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  startNewGame: () => void;
  selectCell: (pos: Position) => void;
  makeMove: (move: Move) => boolean;
  tryMoveTo: (to: Position) => void;
  undo: () => void;
  playCpuTurn: () => void;
}

function chooseCpuMove(state: GameState, difficulty: Difficulty): Move | null {
  if (difficulty === "easy") {
    return chooseEasyMove(state);
  }
  if (difficulty === "medium") {
    return chooseMediumMove(state);
  }
  return chooseHardMove(state);
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameMode: "local",
  difficulty: "easy",
  state: createInitialGameState(),
  selected: null,
  statusMessage: null,
  moveHistory: [],

  setMode: (mode) =>
    set((store) => ({
      gameMode: mode,
      selected: null,
      state: createInitialGameState(),
      statusMessage: null,
      moveHistory: [],
      difficulty: store.difficulty,
    })),

  setDifficulty: (difficulty) => set({ difficulty }),

  startNewGame: () =>
    set((store) => ({
      state: createInitialGameState(),
      selected: null,
      statusMessage: null,
      moveHistory: [],
      gameMode: store.gameMode,
      difficulty: store.difficulty,
    })),

  selectCell: (pos) =>
    set((store) => {
      const piece = getPieceAt(store.state.pieces, pos);
      if (!piece) {
        return { selected: null };
      }
      if (piece.color !== store.state.currentPlayer) {
        return { selected: null, statusMessage: "Bu tas bu tur oynanamaz." };
      }
      return { selected: pos, statusMessage: null };
    }),

  makeMove: (move) => {
    const store = get();
    const valid = getValidMoves(store.state).some(
      (m) =>
        m.from.row === move.from.row &&
        m.from.col === move.from.col &&
        m.to.row === move.to.row &&
        m.to.col === move.to.col,
    );

    if (!valid) {
      set({ statusMessage: "Gecersiz hamle." });
      return false;
    }

    const result = applyMove(store.state, move);
    set((current) => ({
      state: result.state,
      selected: null,
      statusMessage:
        result.capturedPieceIds.length > 0
          ? `${result.capturedPieceIds.length} tas yakalandi.`
          : current.statusMessage,
      moveHistory: [...current.moveHistory, move],
    }));
    return true;
  },

  tryMoveTo: (to) => {
    const store = get();
    if (!store.selected) {
      return;
    }
    const move: Move = { from: store.selected, to };
    const success = store.makeMove(move);
    if (!success) {
      set({ selected: store.selected });
    }
  },

  undo: () =>
    set((store) => ({
      state: undoMove(store.state),
      selected: null,
      statusMessage: null,
      moveHistory: store.moveHistory.slice(0, -1),
    })),

  playCpuTurn: () => {
    const store = get();
    if (store.gameMode !== "cpu" || store.state.winner || store.state.currentPlayer !== "orange") {
      return;
    }

    const cpuMove = chooseCpuMove(store.state, store.difficulty);
    if (!cpuMove) {
      set({ statusMessage: "Bilgisayarin oynayacak hamlesi yok." });
      return;
    }
    store.makeMove(cpuMove);
  },
}));

export function isCpuTurn(gameMode: GameMode, currentPlayer: PlayerColor): boolean {
  return gameMode === "cpu" && currentPlayer === "orange";
}
