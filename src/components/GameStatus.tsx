"use client";

import type { GameState } from "@/lib/game";
import { colorLabel, winnerLabel } from "@/lib/utils/format";
import { panelClass, panelTitleClass } from "./premiumStyles";

interface GameStatusProps {
  state: GameState;
  statusMessage: string | null;
}

export function GameStatus({ state, statusMessage }: GameStatusProps) {
  return (
    <section className={panelClass}>
      <h2 className={panelTitleClass}>Oyun Durumu</h2>
      <div className="mt-2 space-y-2 text-sm text-slate-700">
        <p>
          Sira: <strong>{colorLabel(state.currentPlayer)}</strong>
        </p>
        <p>
          Hamle: <strong>{state.moveCount}</strong>
        </p>
        <p>
          Mor tas: <strong>{state.pieces.filter((p) => p.color === "purple").length}</strong>
        </p>
        <p>
          Turuncu tas: <strong>{state.pieces.filter((p) => p.color === "orange").length}</strong>
        </p>
        {state.winner && (
          <p className="rounded-lg border border-emerald-200 bg-gradient-to-b from-emerald-50 to-emerald-100 px-2.5 py-1.5 font-semibold text-emerald-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            Kazanan: {winnerLabel(state.winner)}
          </p>
        )}
        {statusMessage && (
          <p className="rounded-lg border border-amber-200 bg-gradient-to-b from-amber-50 to-amber-100 px-2.5 py-1.5 text-amber-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            {statusMessage}
          </p>
        )}
      </div>
    </section>
  );
}
