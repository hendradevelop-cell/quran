'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiArrowLeft, FiBookOpen } from 'react-icons/fi';

const SOURCE_URL = 'https://quran.nu.or.id/doa/doa-wudhu';

export default function WudhuDuasPage() {
  const [result, setResult] = useState({ status: 'loading', duas: [], error: '' });

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/doa', { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Daftar doa tidak dapat dimuat.');
        if (data.status !== 'success' || !Array.isArray(data.data)) {
          throw new Error('Format daftar doa tidak valid.');
        }
        return data.data.filter((dua) => (
          dua.grup === 'Doa Saat Wudhu'
          || (Array.isArray(dua.tag) && dua.tag.includes('wudhu'))
        ));
      })
      .then((duas) => setResult({ status: 'success', duas, error: '' }))
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error('Gagal memuat doa wudhu:', error);
          setResult({
            status: 'error',
            duas: [],
            error: error.message || 'Doa wudhu belum dapat dimuat. Coba lagi sebentar.',
          });
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <Link href="/doa" className="inline-flex items-center gap-2 text-sm font-semibold text-[#327b68] hover:text-[#124e43]">
        <FiArrowLeft aria-hidden="true" /> Kembali ke kumpulan doa
      </Link>

      <header className="relative overflow-hidden rounded-[2rem] bg-[#124e43] px-6 py-9 text-white shadow-xl shadow-emerald-950/10 sm:px-10 sm:py-12">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/10 sm:h-80 sm:w-80" />
        <p className="relative text-sm font-semibold uppercase tracking-[0.2em] text-[#f1d99b]">Bersuci sebelum ibadah</p>
        <h1 className="relative mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Doa sebelum dan setelah wudhu</h1>
        <p className="relative mt-4 max-w-2xl leading-7 text-emerald-50/80">
          Bacaan ringkas untuk mengawali wudhu dan berdoa setelah selesai, lengkap dengan transliterasi dan artinya.
        </p>
      </header>

      <section className="rounded-2xl border border-[#e9dfc4] bg-[#fffaf0] p-5 sm:p-6">
        <h2 className="font-semibold text-[#6e5b32]">Urutan singkat</h2>
        <ol className="mt-3 space-y-2 text-sm leading-6 text-[#76694c]">
          <li className="flex gap-3"><span className="font-semibold">1.</span><span>Mulai dengan membaca basmalah sebelum berwudhu.</span></li>
          <li className="flex gap-3"><span className="font-semibold">2.</span><span>Sempurnakan wudhu dengan tertib sesuai tuntunan yang dipelajari.</span></li>
          <li className="flex gap-3"><span className="font-semibold">3.</span><span>Setelah selesai, baca doa syahadat yang diriwayatkan berikut.</span></li>
        </ol>
        <p className="mt-4 text-xs leading-5 text-[#857756]">
          Halaman ini memuat bacaan sebelum dan setelah wudhu. Rincian doa pada setiap anggota wudhu memiliki perbedaan penilaian di kalangan ulama.
        </p>
      </section>

      {result.status === 'loading' && (
        <div className="space-y-4" aria-label="Memuat doa wudhu">
          <div className="h-56 animate-pulse rounded-2xl border border-[#e6e2d7] bg-white" />
          <div className="h-64 animate-pulse rounded-2xl border border-[#e6e2d7] bg-white" />
        </div>
      )}

      {result.status === 'error' && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          {result.error}
        </div>
      )}

      {result.status === 'success' && result.duas.length === 0 && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          Bacaan doa wudhu belum tersedia saat ini.
        </div>
      )}

      {result.status === 'success' && result.duas.map((dua, index) => (
        <article key={dua.id} className="rounded-2xl border border-[#e6e2d7] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#edf3ec] text-sm font-semibold text-[#276553]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#a77b2e]">
                {index === 0 ? 'Sebelum wudhu' : 'Setelah wudhu'}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-[#173d35]">{dua.nama}</h2>
            </div>
          </div>
          <p lang="ar" dir="rtl" className="mt-6 text-right text-3xl leading-[2.2] text-[#173d35] sm:text-4xl">
            {dua.ar}
          </p>
          <p className="mt-5 text-sm italic leading-7 text-[#a77b2e]">{dua.tr}</p>
          <p className="mt-3 leading-7 text-[#52675f]">{dua.idn}</p>
          {dua.tentang && (
            <details className="mt-5 border-t border-[#eeeae1] pt-4">
              <summary className="cursor-pointer text-sm font-semibold text-[#327b68]">Sumber & keterangan</summary>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#748179]">{dua.tentang}</p>
            </details>
          )}
        </article>
      ))}

      <aside className="rounded-2xl border border-[#d9e6da] bg-[#f5f8f3] p-5 text-sm leading-6 text-[#52675f] sm:p-6">
        <div className="flex items-start gap-3">
          <FiBookOpen aria-hidden="true" className="mt-0.5 shrink-0 text-lg text-[#327b68]" />
          <div>
            <h2 className="font-semibold text-[#173d35]">Rujukan tambahan</h2>
            <p className="mt-2">
              Lihat juga halaman doa wudhu yang Anda rujuk di NU Online.
            </p>
            <a
              href={SOURCE_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex font-semibold text-[#327b68] underline underline-offset-4 hover:text-[#124e43]"
            >
              Buka quran.nu.or.id/doa/doa-wudhu
            </a>
          </div>
        </div>
      </aside>
    </div>
  );
}
