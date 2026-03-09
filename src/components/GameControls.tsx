"use client";

import type { Difficulty, GameMode } from "@/lib/game";
import {
  chipClassActive,
  chipClassBase,
  chipClassIdle,
  panelClass,
  panelTitleClass,
  primaryButtonClass,
} from "./premiumStyles";

interface GameControlsProps {
  gameMode: GameMode;
  difficulty: Difficulty;
  onModeChange: (mode: GameMode) => void;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onNewGame: () => void;
}

export function GameControls({
  gameMode,
  difficulty,
  onModeChange,
  onDifficultyChange,
  onNewGame,
}: GameControlsProps) {
  return (
    <section className={panelClass}>
      <div className="space-y-4">
        <div>
          <p className={panelTitleClass}>Oyun Modu</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              aria-label="Iki oyunculu mod"
              className={modeChipClass(gameMode === "local")}
              onClick={() => onModeChange("local")}
            >
              2 Oyuncu
            </button>
            <button
              type="button"
              aria-label="Bilgisayara karsi mod"
              className={modeChipClass(gameMode === "cpu")}
              onClick={() => onModeChange("cpu")}
            >
              Bilgisayara Karsi
            </button>
          </div>
        </div>

        <div>
          <p className={panelTitleClass}>Zorluk</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {(["easy", "medium", "hard"] as const).map((level) => (
              <button
                key={level}
                type="button"
                aria-label={`${level} zorluk`}
                className={modeChipClass(difficulty === level)}
                onClick={() => onDifficultyChange(level)}
              >
                {level === "easy" ? "Kolay" : level === "medium" ? "Orta" : "Zor"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <button
            type="button"
            aria-label="Yeni oyun baslat"
            className={`${primaryButtonClass} w-full`}
            onClick={onNewGame}
          >
            Yeni Oyun
          </button>
        </div>
      </div>
    </section>
  );
}

function modeChipClass(active: boolean): string {
  return [chipClassBase, active ? chipClassActive : chipClassIdle].join(" ");
}
