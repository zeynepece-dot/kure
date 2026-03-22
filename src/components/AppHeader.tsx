"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { chipClassBase, chipClassIdle, primaryButtonClass } from "./premiumStyles";
import { useAuthStore } from "@/store/authStore";

const navLinkClass = `${chipClassBase} ${chipClassIdle} inline-flex items-center justify-center`;

export function AppHeader() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const initialized = useAuthStore((state) => state.initialized);
  const isLoading = useAuthStore((state) => state.isLoading);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-2">
        <Link href="/" className={navLinkClass} aria-current={pathname === "/" ? "page" : undefined}>
          Ana Sayfa
        </Link>
        <Link href="/game" className={navLinkClass} aria-current={pathname === "/game" ? "page" : undefined}>
          Oyun
        </Link>
        <Link href="/rules" className={navLinkClass} aria-current={pathname === "/rules" ? "page" : undefined}>
          Kurallar
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {!initialized && <span className="text-sm text-slate-600">Oturum kontrol ediliyor...</span>}

        {initialized && user ? (
          <>
            <span className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900">
              {user.name}
            </span>
            <button type="button" className={primaryButtonClass} onClick={() => void logout()} disabled={isLoading}>
              Cikis
            </button>
          </>
        ) : null}

        {initialized && !user ? (
          <>
            <Link href="/login" className={navLinkClass}>
              Giris
            </Link>
            <Link href="/register" className={primaryButtonClass}>
              Kayit Ol
            </Link>
          </>
        ) : null}
      </div>
    </header>
  );
}
