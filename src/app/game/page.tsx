"use client";

import Link from "next/link";
import { useEffect, useEffectEvent, useRef } from "react";
import { GameBoard } from "@/components/GameBoard";
import { GameControls } from "@/components/GameControls";
import { MoveHistory } from "@/components/MoveHistory";
import { GameStatus } from "@/components/GameStatus";
import { primaryButtonClass } from "@/components/premiumStyles";
import { SavedGamesPanel } from "@/components/SavedGamesPanel";
import { isCpuTurn, useGameStore } from "@/store/gameStore";
import { winnerLabel } from "@/lib/utils/format";

export default function GamePage() {
  const gameMode = useGameStore((store) => store.gameMode);
  const difficulty = useGameStore((store) => store.difficulty);
  const state = useGameStore((store) => store.state);
  const selected = useGameStore((store) => store.selected);
  const statusMessage = useGameStore((store) => store.statusMessage);
  const moveHistory = useGameStore((store) => store.moveHistory);
  const setMode = useGameStore((store) => store.setMode);
  const setDifficulty = useGameStore((store) => store.setDifficulty);
  const startNewGame = useGameStore((store) => store.startNewGame);
  const selectCell = useGameStore((store) => store.selectCell);
  const tryMoveTo = useGameStore((store) => store.tryMoveTo);
  const playCpuTurn = useGameStore((store) => store.playCpuTurn);
  const loadSavedGame = useGameStore((store) => store.loadSavedGame);
  const lastScheduledCpuTurnRef = useRef<string | null>(null);
  const runCpuTurn = useEffectEvent(() => {
    playCpuTurn();
  });

  useEffect(() => {
    if (!isCpuTurn(gameMode, state.currentPlayer) || state.winner) {
      lastScheduledCpuTurnRef.current = null;
      return;
    }

    const cpuTurnKey = `${gameMode}:${state.currentPlayer}:${state.moveCount}:${state.winner ?? "none"}`;
    if (lastScheduledCpuTurnRef.current === cpuTurnKey) {
      return;
    }

    lastScheduledCpuTurnRef.current = cpuTurnKey;
    const timer = setTimeout(() => runCpuTurn(), 300);
    return () => clearTimeout(timer);
  }, [gameMode, state.currentPlayer, state.moveCount, state.winner]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-6 sm:px-6">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-[1.7rem]">KEREM&apos;in küre oyunu</h1>
        <Link
          href="/"
          className="rounded-xl border border-slate-300/70 bg-gradient-to-b from-white to-slate-100 px-3 py-2 text-sm font-semibold text-slate-800 shadow-[0_6px_14px_rgba(15,23,42,0.1),inset_0_1px_0_rgba(255,255,255,0.85)] transition hover:border-slate-400"
        >
          Ana Sayfa
        </Link>
      </div>

      {state.winner && (
        <section className="mb-4 rounded-2xl border border-emerald-300/80 bg-gradient-to-b from-emerald-50 to-emerald-100/75 p-4 shadow-[0_14px_24px_rgba(5,150,105,0.15),inset_0_1px_0_rgba(255,255,255,0.85)]">
          <p className="text-lg font-bold text-emerald-900">Oyun bitti. Kazanan: {winnerLabel(state.winner)}</p>
          <p className="text-sm text-emerald-800">Toplam hamle: {state.moveCount}</p>
          <button type="button" aria-label="Tekrar oyna" onClick={startNewGame} className={`mt-3 ${primaryButtonClass}`}>
            Tekrar Oyna
          </button>
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div className="space-y-4">
          <GameBoard state={state} selected={selected} onSelect={selectCell} onTryMove={tryMoveTo} />
        </div>
        <div className="space-y-4">
          <GameControls
            gameMode={gameMode}
            difficulty={difficulty}
            onModeChange={setMode}
            onDifficultyChange={setDifficulty}
            onNewGame={startNewGame}
          />
          <GameStatus state={state} statusMessage={statusMessage} />
          <MoveHistory moves={moveHistory} />
          <SavedGamesPanel
            gameMode={gameMode}
            difficulty={difficulty}
            state={state}
            moveHistory={moveHistory}
            onLoadGame={loadSavedGame}
          />
        </div>
      </div>
    </main>
  );
}
