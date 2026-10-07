import { FiExternalLink } from 'react-icons/fi';

const DOA_SHALAT_URL = 'https://quran.nu.or.id/doa/doa-shalat';

export default function DoaShalatWebView() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="rounded-[2rem] bg-[#124e43] px-6 py-9 text-white shadow-xl shadow-emerald-950/10 sm:px-10 sm:py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f1d99b]">Rujukan Quran NU Online</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Doa Shalat</h1>
        <p className="mt-4 max-w-2xl leading-7 text-emerald-50/80">
          Kumpulan doa shalat dari Quran NU Online ditampilkan di bawah ini.
        </p>
      </header>

      <section className="rounded-2xl border border-[#dce8dd] bg-white p-6 shadow-sm sm:p-10" aria-label="Buka kumpulan doa shalat">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a77b2e]">Sumber tepercaya</p>
          <h2 className="mt-3 text-2xl font-semibold text-[#173d35] sm:text-3xl">Baca kumpulan Doa Shalat</h2>
          <p className="mt-3 leading-7 text-[#748179]">
            Quran NU Online tidak mengizinkan halamannya ditampilkan di dalam webview. Buka sumbernya langsung untuk melihat bacaan doa, Arab, Latin, dan terjemahannya.
          </p>
          <a
            href={DOA_SHALAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#124e43] px-6 py-3 font-semibold text-white transition hover:bg-[#0c4037]"
          >
            Buka Doa Shalat di Quran NU Online <FiExternalLink aria-hidden="true" />
          </a>
          <p className="mt-3 text-sm text-[#748179]">quran.nu.or.id/doa/doa-shalat</p>
        </div>
      </section>
    </div>
  );
}
