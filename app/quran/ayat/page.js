import Link from 'next/link';

export default function AyatHome() {
  return (
    <section className="mx-auto max-w-3xl rounded-[2rem] border border-[#e6e2d7] bg-white px-6 py-12 text-center shadow-sm sm:px-12 sm:py-16">
      <span aria-hidden="true" className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf3ec] text-2xl text-[#276553]">
        ب
      </span>
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#a77b2e]">Mulai membaca</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#173d35] sm:text-4xl">Pilih surah untuk dibaca</h1>
      <p className="mx-auto mt-4 max-w-lg leading-7 text-[#68766f]">
        Buka daftar surah untuk memilih bacaan. Setiap halaman berisi teks Arab, transliterasi, terjemahan, dan audio ayat.
      </p>
      <Link
        href="/quran/surah"
        className="mt-8 inline-flex rounded-full bg-[#124e43] px-7 py-3 font-semibold text-white transition hover:bg-[#0c4037] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#327b68]"
      >
        Lihat daftar surah
      </Link>
    </section>
  );
}
