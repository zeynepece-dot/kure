"use client";

import { getPieceAt, getValidMoves, type GameState, type Position } from "@/lib/game";

interface GameBoardProps {
  state: GameState;
  selected: Position | null;
  onSelect: (pos: Position) => void;
  onTryMove: (pos: Position) => void;
}

export function GameBoard({ state, selected, onSelect, onTryMove }: GameBoardProps) {
  const validTargets = new Set(
    (selected
      ? getValidMoves(state).filter((m) => m.from.row === selected.row && m.from.col === selected.col)
      : []
    ).map((m) => `${m.to.row},${m.to.col}`),
  );

  const rows = Array.from({ length: 7 }, (_, row) => row);
  const cols = Array.from({ length: 7 }, (_, col) => col);

  return (
    <section className="relative w-full overflow-hidden rounded-[1.8rem] border border-cyan-200/70 bg-gradient-to-br from-cyan-300/95 via-sky-300/95 to-cyan-400/95 p-3.5 shadow-[0_18px_40px_rgba(14,116,144,0.28),inset_0_1px_0_rgba(255,255,255,0.48),inset_0_-10px_20px_rgba(3,105,161,0.24)] sm:p-4">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(255,255,255,0.24),transparent_36%),radial-gradient(circle_at_84%_92%,rgba(2,132,199,0.2),transparent_44%)]" />
      <div className="relative grid grid-cols-7 gap-2 sm:gap-2.5">
        {rows.flatMap((row) =>
          cols.map((col) => {
            const pos = { row, col };
            const piece = getPieceAt(state.pieces, pos);
            const key = `${row},${col}`;
            const isSelected = selected?.row === row && selected?.col === col;
            const isTarget = validTargets.has(key);

            return (
              <button
                key={key}
                type="button"
                aria-label={`Hucre ${row + 1}-${col + 1}`}
                className={[
                  "group relative isolate aspect-square min-h-11 min-w-11 overflow-hidden rounded-full border border-cyan-900/10",
                  "bg-gradient-to-b from-sky-100/95 via-cyan-100/92 to-cyan-200/86",
                  "shadow-[inset_0_3px_5px_rgba(255,255,255,0.42),inset_0_-7px_12px_rgba(8,47,73,0.22),0_1px_2px_rgba(15,23,42,0.08)]",
                  "transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/65 focus-visible:ring-offset-2 focus-visible:ring-offset-cyan-300",
                  isSelected
                    ? "scale-[1.03] ring-2 ring-violet-500/75 shadow-[0_0_0_4px_rgba(124,58,237,0.22),inset_0_3px_6px_rgba(255,255,255,0.55),inset_0_-8px_14px_rgba(76,29,149,0.25)]"
                    : "",
                  isTarget
                    ? "ring-1 ring-orange-300/90 shadow-[0_0_0_3px_rgba(251,146,60,0.22),inset_0_3px_6px_rgba(255,255,255,0.5),inset_0_-7px_12px_rgba(124,45,18,0.18)]"
                    : "",
                ].join(" ")}
                onClick={() => {
                  if (piece?.color === state.currentPlayer) {
                    onSelect(pos);
                    return;
                  }
                  onTryMove(pos);
                }}
              >
                <span className="pointer-events-none absolute left-1.5 right-1.5 top-1.5 h-[25%] rounded-full bg-white/28 blur-[0.5px]" />
                {isTarget && !piece && (
                  <span className="pointer-events-none absolute inset-[33%] rounded-full border border-orange-200/90 bg-gradient-to-b from-orange-100/90 to-orange-200/75 opacity-85 shadow-[0_0_10px_rgba(249,115,22,0.28)]" />
                )}
                {piece && (
                  <span
                    aria-label={piece.color === "purple" ? "Mor tas" : "Turuncu tas"}
                    className={[
                      "relative z-10 mx-auto mt-[2px] block h-8 w-8 rounded-full border transition duration-150",
                      "shadow-[0_10px_14px_rgba(15,23,42,0.28),inset_0_1px_1px_rgba(255,255,255,0.45),inset_0_-3px_5px_rgba(0,0,0,0.24)]",
                      isSelected ? "scale-[1.04]" : "",
                      piece.color === "purple"
                        ? "border-violet-950/60 bg-gradient-to-b from-violet-300 via-violet-500 to-violet-800"
                        : "border-orange-950/55 bg-gradient-to-b from-amber-200 via-orange-400 to-orange-700",
                    ].join(" ")}
                  >
                    <span className="pointer-events-none absolute left-[22%] top-[14%] h-3.5 w-4 rounded-full bg-white/48 blur-[0.4px]" />
                    <span
                      className={[
                        "pointer-events-none absolute inset-x-[16%] bottom-[14%] h-2 rounded-full blur-[0.2px]",
                        piece.color === "purple" ? "bg-violet-950/38" : "bg-orange-950/34",
                      ].join(" ")}
                    />
                  </span>
                )}
              </button>
            );
          }),
        )}
      </div>
    </section>
  );
}
