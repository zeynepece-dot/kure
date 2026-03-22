"use client";

import { useEffect, useEffectEvent, useState } from "react";
import Link from "next/link";
import type { Difficulty, GameMode, GameState, Move } from "@/lib/game";
import type { SavedGameRecord } from "@/lib/backend/types";
import { backendProvider } from "@/services";
import { useAuthStore } from "@/store/authStore";
import { panelClass, panelTitleClass, primaryButtonClass, secondaryButtonClass } from "./premiumStyles";

interface SavedGamesPanelProps {
  gameMode: GameMode;
  difficulty: Difficulty;
  state: GameState;
  moveHistory: Move[];
  onLoadGame: (payload: {
    gameMode: GameMode;
    difficulty: Difficulty;
    state: GameState;
    moveHistory: Move[];
  }) => void;
}

export function SavedGamesPanel({
  gameMode,
  difficulty,
  state,
  moveHistory,
  onLoadGame,
}: SavedGamesPanelProps) {
  const user = useAuthStore((store) => store.user);
  const initialized = useAuthStore((store) => store.initialized);

  const [saves, setSaves] = useState<SavedGameRecord[]>([]);
  const [name, setName] = useState("Aktif Oyun");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshSaves = useEffectEvent(async () => {
    if (!user) {
      setSaves([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const result = await backendProvider.games.listSavedGames();
      setSaves(result.documents);
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setIsLoading(false);
    }
  });

  useEffect(() => {
    if (initialized && user) {
      void refreshSaves();
    }
    if (initialized && !user) {
      setSaves((prev) => (prev.length ? [] : prev));
      setSelectedId((prev) => (prev !== null ? null : prev));
    }
  }, [initialized, user]);

  async function handleSave() {
    setIsLoading(true);
    setError(null);
    setStatus(null);
    try {
      const payload = {
        name: name.trim() || "Aktif Oyun",
        gameMode,
        difficulty,
        state,
        moveHistory,
      };

      const save = selectedId
        ? await backendProvider.games.updateSavedGame(selectedId, payload)
        : await backendProvider.games.createSavedGame(payload);

      setSelectedId(save.id);
      setStatus(selectedId ? "Kayit guncellendi." : "Oyun kaydedildi.");
      await refreshSaves();
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!selectedId) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setStatus(null);
    try {
      await backendProvider.games.deleteSavedGame(selectedId);
      setSelectedId(null);
      setStatus("Kayit silindi.");
      await refreshSaves();
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLoad(id: string) {
    setIsLoading(true);
    setError(null);
    setStatus(null);
    try {
      const save = await backendProvider.games.getSavedGame(id);
      setSelectedId(save.id);
      setName(save.name);
      onLoadGame({
        gameMode: save.gameMode,
        difficulty: save.difficulty,
        state: save.state,
        moveHistory: save.moveHistory,
      });
      setStatus("Kayitli oyun yuklendi.");
    } catch (cause) {
      setError(getErrorMessage(cause));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className={panelClass}>
      <div className="flex items-center justify-between gap-3">
        <h2 className={panelTitleClass}>Kayitli Oyunlar</h2>
        {user ? <span className="text-xs font-semibold text-emerald-700">{user.email}</span> : null}
      </div>

      {!initialized && <p className="mt-3 text-sm text-slate-600">Oturum bilgisi yukleniyor...</p>}

      {initialized && !user ? (
        <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm leading-6 text-amber-800">
          Kayitli oyunlari kullanmak icin{" "}
          <Link href="/login" className="font-semibold underline underline-offset-2">
            giris yapin
          </Link>
          . Misafir modunda mevcut oyun deneyimi ayni sekilde devam eder.
        </div>
      ) : null}

      {initialized && user ? (
        <div className="mt-3 space-y-3">
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Kayit adi</span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-violet-400"
              placeholder="Aktif Oyun"
            />
          </label>

          <div className="grid gap-2 sm:grid-cols-3">
            <button type="button" className={primaryButtonClass} onClick={() => void handleSave()} disabled={isLoading}>
              {selectedId ? "Guncelle" : "Kaydet"}
            </button>
            <button
              type="button"
              className={secondaryButtonClass}
              onClick={() => void refreshSaves()}
              disabled={isLoading}
            >
              Yenile
            </button>
            <button
              type="button"
              className={`${secondaryButtonClass} ${!selectedId ? "opacity-50" : ""}`}
              onClick={() => void handleDelete()}
              disabled={isLoading || !selectedId}
            >
              Sil
            </button>
          </div>

          {status && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{status}</p>}
          {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

          <div className="space-y-2">
            {saves.length === 0 && !isLoading ? (
              <p className="text-sm text-slate-600">Henuz kayitli oyun yok.</p>
            ) : null}

            {saves.map((save) => (
              <article
                key={save.id}
                className={`rounded-2xl border px-3 py-3 shadow-sm ${
                  selectedId === save.id ? "border-violet-300 bg-violet-50/70" : "border-slate-200 bg-white/80"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{save.name}</p>
                    <p className="mt-1 text-xs text-slate-600">
                      {save.gameMode === "cpu" ? "Bilgisayara karsi" : "Yerel"} ·{" "}
                      {save.difficulty === "easy" ? "Kolay" : save.difficulty === "medium" ? "Orta" : "Zor"} · Hamle{" "}
                      {save.state.moveCount}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Guncelleme: {formatDate(save.updatedAt)}</p>
                  </div>
                  <button
                    type="button"
                    className={primaryButtonClass}
                    onClick={() => void handleLoad(save.id)}
                    disabled={isLoading}
                  >
                    Yukle
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function getErrorMessage(error: unknown): string {
  if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
    return error.message;
  }

  return "Islem tamamlanamadi.";
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}
