'use client';

import axios from 'axios';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export default function SurahList() {
  const [surahList, setSurahList] = useState([]);
  const [search, setSearch] = useState('');
  const [revelation, setRevelation] = useState('Semua');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    axios.get('https://equran.id/api/v2/surat', { signal: controller.signal })
      .then(({ data }) => {
        setSurahList(data.data);
        setError('');
      })
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          console.error('Gagal memuat daftar surah:', requestError);
          setError('Daftar surah belum dapat dimuat. Periksa koneksi internet lalu coba lagi.');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, []);

  const filteredSurahs = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('id');

    return surahList.filter((surah) => {
      const matchesSearch = [
        surah.namaLatin,
        surah.arti,
        surah.nama,
        String(surah.nomor),
      ].some((value) => value.toLocaleLowerCase('id').includes(normalizedSearch));
      const matchesRevelation = revelation === 'Semua' || surah.tempatTurun === revelation;

      return matchesSearch && matchesRevelation;
    });
  }, [revelation, search, surahList]);

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="overflow-hidden rounded-[2rem] bg-[#124e43] px-6 py-10 text-white shadow-xl shadow-emerald-950/10 sm:px-10 sm:py-14">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#e7c77b]">
          Perjalanan membaca Al-Qur&apos;an
        </p>
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">
          Temukan surah, temukan ketenangan.
        </h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-emerald-50/80">
          Jelajahi 114 surah Al-Qur&apos;an beserta arti dan jumlah ayatnya.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm font-medium">
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">114 Surah</span>
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">30 Juz</span>
          <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2">Baca & dengarkan</span>
        </div>
      </section>

      <section aria-labelledby="surah-heading">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a77b2e]">Daftar bacaan</p>
            <h2 id="surah-heading" className="mt-1 text-2xl font-semibold text-[#173d35] sm:text-3xl">
              Pilih surah
            </h2>
          </div>
          <p className="text-sm text-[#68766f]">
            {loading ? 'Memuat daftar surah…' : `${filteredSurahs.length} surah ditemukan`}
          </p>
        </div>

        <div className="mb-6 grid gap-3 rounded-2xl border border-[#e6e2d7] bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto] sm:p-5">
          <label className="flex items-center gap-3 rounded-xl border border-[#e6e2d7] bg-[#fbfaf6] px-4 py-3 focus-within:border-[#327b68] focus-within:ring-2 focus-within:ring-[#327b68]/15">
            <span aria-hidden="true" className="text-lg text-[#668077]">⌕</span>
            <span className="sr-only">Cari surah</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama, arti, atau nomor surah"
              className="w-full bg-transparent text-sm text-[#173d35] outline-none placeholder:text-[#91a098]"
            />
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-[#e6e2d7] bg-[#fbfaf6] px-4 py-3 text-sm text-[#52675f]">
            <span>Tempat turun</span>
            <select
              value={revelation}
              onChange={(event) => setRevelation(event.target.value)}
              className="min-w-24 bg-transparent font-semibold text-[#173d35] outline-none"
            >
              <option>Semua</option>
              <option>Mekah</option>
              <option>Madinah</option>
            </select>
          </label>
        </div>

        {error && (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
            {error}
          </div>
        )}

        {loading && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-label="Memuat daftar surah">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-2xl border border-[#e6e2d7] bg-white" />
            ))}
          </div>
        )}

        {!loading && !error && filteredSurahs.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#d5d8ca] bg-white px-6 py-12 text-center text-[#68766f]">
            Surah tidak ditemukan. Coba kata kunci yang berbeda.
          </div>
        )}

        {!loading && !error && filteredSurahs.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSurahs.map((surah) => (
              <Link
                key={surah.nomor}
                href={`/quran/ayat/${surah.nomor}`}
                className="group flex min-h-32 items-center gap-4 rounded-2xl border border-[#e6e2d7] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-[#adc6b8] hover:shadow-lg hover:shadow-emerald-950/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#327b68]"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#edf3ec] text-sm font-semibold text-[#276553]">
                  {String(surah.nomor).padStart(2, '0')}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-base font-semibold text-[#173d35]">{surah.namaLatin}</span>
                  <span className="mt-1 block truncate text-sm text-[#7b8981]">{surah.arti}</span>
                  <span className="mt-2 block text-xs text-[#68766f]">
                    {surah.jumlahAyat} ayat <span aria-hidden="true">·</span> {surah.tempatTurun}
                  </span>
                </span>
                <span lang="ar" dir="rtl" className="shrink-0 text-xl text-[#327b68]">{surah.nama}</span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
