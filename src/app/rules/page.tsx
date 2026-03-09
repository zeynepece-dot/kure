import Link from "next/link";
import { RULE_ASSUMPTIONS, RULE_SUMMARY } from "@/lib/game";

export default function RulesPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-900">Kure Kurallari</h1>
        <Link href="/" className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white">
          Ana Sayfa
        </Link>
      </div>

      <section className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-xl shadow-slate-200">
        <h2 className="text-lg font-bold text-slate-900">PDF Ozet Kurallar</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
          {RULE_SUMMARY.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ol>

        <h2 className="mt-6 text-lg font-bold text-slate-900">Varsayimlar</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
          {RULE_ASSUMPTIONS.map((assumption) => (
            <li key={assumption}>{assumption}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
