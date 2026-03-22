"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { panelClass, panelTitleClass, primaryButtonClass } from "./premiumStyles";
import { useAuthStore } from "@/store/authStore";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const clearError = useAuthStore((state) => state.clearError);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearError();

    const success =
      mode === "login"
        ? await login({ email: email.trim(), password })
        : await register({ name: name.trim(), email: email.trim(), password });

    if (success) {
      router.push("/game");
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-96px)] w-full max-w-md items-center px-4 py-6 sm:px-6">
      <section className={`${panelClass} w-full p-6`}>
        <p className={panelTitleClass}>{mode === "login" ? "Oturum Ac" : "Yeni Hesap"}</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
          {mode === "login" ? "Giris Yap" : "Kayit Ol"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          {mode === "login"
            ? "Kayitli oyunlarini gormek ve kaldigin yerden devam etmek icin hesabina giris yap."
            : "Mevcut misafir deneyimini koruyarak kayitli oyun ozelligini kullanmak icin hesap olustur."}
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {mode === "register" && (
            <label className="block">
              <span className="mb-1 block text-sm font-semibold text-slate-700">Ad</span>
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-violet-400"
                placeholder="Oyuncu adi"
              />
            </label>
          )}

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">E-posta</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-violet-400"
              placeholder="ornek@kure.app"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-slate-700">Sifre</span>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-violet-400"
              placeholder="En az 8 karakter"
            />
          </label>

          {error && <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}

          <button type="submit" className={`${primaryButtonClass} w-full`} disabled={isLoading}>
            {isLoading ? "Isleniyor..." : mode === "login" ? "Giris Yap" : "Kayit Ol"}
          </button>
        </form>

        <p className="mt-4 text-sm text-slate-600">
          {mode === "login" ? "Hesabin yok mu?" : "Zaten hesabin var mi?"}{" "}
          <Link href={mode === "login" ? "/register" : "/login"} className="font-semibold text-violet-700">
            {mode === "login" ? "Kayit Ol" : "Giris Yap"}
          </Link>
        </p>
      </section>
    </main>
  );
}
