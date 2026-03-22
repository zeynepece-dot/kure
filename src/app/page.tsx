import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-96px)] w-full max-w-4xl flex-col justify-center px-6 py-10">
      <section className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-xl shadow-slate-200">
        <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-800">
          Mobil Strateji Oyunu + Appwrite Hesaplari
        </span>
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">Kure</h1>
        <p className="mt-4 max-w-xl text-sm leading-6 text-slate-700 sm:text-base">
          Fiziksel Kure oyununun dijital web surumu. Yerel 2 oyuncu veya bilgisayara karsi oynayin, hamlelerinizi
          stratejik olarak planlayin, rakibin 4 tasini oyundan cikarin ve giris yaptiginizda oyunlarinizi Appwrite
          uzerinden kaydedin.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/game" className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white">
            Hemen Oyna
          </Link>
          <Link href="/rules" className="rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white">
            Kurallar
          </Link>
          <Link href="/register" className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
            Hesap Olustur
          </Link>
        </div>
      </section>
    </main>
  );
}
