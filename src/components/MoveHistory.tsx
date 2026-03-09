"use client";

import type { Move } from "@/lib/game";
import { panelClass, panelTitleClass } from "./premiumStyles";

interface MoveHistoryProps {
  moves: Move[];
}

export function MoveHistory({ moves }: MoveHistoryProps) {
  return (
    <section className={panelClass}>
      <h2 className={panelTitleClass}>Hamle Gecmisi</h2>
      <ol className="mt-2 max-h-56 space-y-1.5 overflow-auto pr-1 text-sm text-slate-700">
        {moves.length === 0 && <li>Henuz hamle yok.</li>}
        {moves.map((move, index) => (
          <li
            key={`${index}-${move.from.row}${move.from.col}${move.to.row}${move.to.col}`}
            className="rounded-lg border border-slate-200/80 bg-white/70 px-2 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
          >
            {index + 1}. ({move.from.row + 1},{move.from.col + 1}) {"->"} ({move.to.row + 1},{move.to.col + 1})
          </li>
        ))}
      </ol>
    </section>
  );
}
