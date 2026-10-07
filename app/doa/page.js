'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { FiBookOpen, FiCopy, FiSearch } from 'react-icons/fi';

export default function DailyDuasPage() {
  const [result, setResult] = useState({ status: 'loading', duas: [], error: '' });
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState('Semua kategori');
  const [copiedId, setCopiedId] = useState(null);
  const [retry, setRetry] = useState(0);
  const [visibleCount, setVisibleCount] = useState(12);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/doa', { signal: controller.signal })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Daftar doa tidak dapat dimuat.');
        }
        if (data.status !== 'success' || !Array.isArray(data.data)) {
          throw new Error('Format daftar doa tidak valid.');
        }
        return data.data;
      })
      .then((duas) => setResult({ status: 'success', duas, error: '' }))
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error('Gagal memuat doa harian:', error);
          setResult({
            status: 'error',
            duas: [],
            error: error.message || 'Doa harian belum dapat dimuat. Coba lagi sebentar.',
          });
        }
      });

    return () => controller.abort();
  }, [retry]);

  const groups = useMemo(
    () => [...new Set(result.duas.map((dua) => dua.grup).filter(Boolean))],
    [result.duas],
  );

  const filteredDuas = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('id');
    return result.duas.filter((dua) => {
      const matchesGroup = group === 'Semua kategori' || dua.grup === group;
      const searchableText = [
        dua.nama,
        dua.grup,
        dua.ar,
        dua.tr,
        dua.idn,
        ...(Array.isArray(dua.tag) ? dua.tag : []),
      ].filter(Boolean).join(' ').toLocaleLowerCase('id');
      return matchesGroup && searchableText.includes(query);
    });
  }, [group, result.duas, search]);
  const visibleDuas = filteredDuas.slice(0, visibleCount);

  async function copyDua(dua) {
    const text = [
      dua.nama,
      dua.ar,
      dua.tr,
      dua.idn,
      dua.tentang ? `Sumber: ${dua.tentang}` : '',
    ].filter(Boolean).join('\n\n');

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.setAttribute('readonly', '');
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        const copied = document.execCommand('copy');
        textArea.remove();
        if (!copied) throw new Error('Browser menolak menyalin teks.');
      }
      setCopiedId(dua.id);
    } catch (error) {
      console.error('Gagal menyalin doa:', error);
      setCopiedId(`error-${dua.id}`);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="relative overflow-hidden rounded-[2rem] bg-[#124e43] px-6 py-9 text-white shadow-xl shadow-emerald-950/10 sm:px-10 sm:py-12">
        <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full border border-white/10 sm:h-80 sm:w-80" />
        <p className="relative text-sm font-semibold uppercase tracking-[0.2em] text-[#f1d99b]">Pengingat dalam keseharian</p>
        <h1 className="relative mt-3 max-w-2xl text-3xl font-semibold tracking-tight sm:text-5xl">Doa yang menemani setiap langkah.</h1>
        <p className="relative mt-4 max-w-xl leading-7 text-emerald-50/80">
          Temukan doa untuk berbagai momen, baca artinya, lalu simpan atau bagikan sebagai pengingat baik.
        </p>
        <div className="relative mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-emerald-50">
          <FiBookOpen aria-hidden="true" className="text-[#f1d99b]" />
          <span>{result.status === 'success' ? `${result.duas.length} doa tersedia` : 'Kumpulan doa harian'}</span>
        </div>
      </header>

      <Link
        href="/doa/wudhu"
        className="group flex flex-col gap-4 rounded-2xl border border-[#d9e6da] bg-[#f5f8f3] p-5 transition hover:border-[#adc6b8] hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-6"
      >
        <span>
          <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-[#327b68]">Panduan pilihan</span>
          <span className="mt-1 block text-lg font-semibold text-[#173d35]">Doa sebelum dan setelah wudhu</span>
          <span className="mt-1 block text-sm leading-6 text-[#748179]">Baca Arab, transliterasi, arti, dan urutan mengamalkannya.</span>
        </span>
        <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#327b68]">
          Buka panduan <span aria-hidden="true" className="transition group-hover:translate-x-1">→</span>
        </span>
      </Link>

      <section aria-labelledby="dua-list-title">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a77b2e]">Kumpulan doa</p>
            <h2 id="dua-list-title" className="mt-1 text-2xl font-semibold text-[#173d35] sm:text-3xl">Pilih doa untuk hari ini</h2>
          </div>
          {result.status === 'success' && (
            <p className="text-sm text-[#748179]">{filteredDuas.length} doa ditemukan</p>
          )}
        </div>

        <div className="mb-6 grid gap-3 rounded-2xl border border-[#e6e2d7] bg-white p-4 shadow-sm sm:grid-cols-[1fr_auto] sm:p-5">
          <label className="flex items-center gap-3 rounded-xl border border-[#e6e2d7] bg-[#fbfaf6] px-4 py-3 focus-within:border-[#327b68] focus-within:ring-2 focus-within:ring-[#327b68]/15">
            <FiSearch aria-hidden="true" className="text-[#668077]" />
            <span className="sr-only">Cari doa</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari doa, momen, atau kata kunci"
              className="w-full bg-transparent text-sm text-[#173d35] outline-none placeholder:text-[#91a098]"
            />
          </label>
          <label className="flex items-center gap-3 rounded-xl border border-[#e6e2d7] bg-[#fbfaf6] px-4 py-3 text-sm text-[#52675f]">
            <span>Kategori</span>
            <select
              value={group}
              onChange={(event) => setGroup(event.target.value)}
              className="max-w-52 bg-transparent font-semibold text-[#173d35] outline-none"
            >
              <option>Semua kategori</option>
              {groups.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
        </div>

        {result.status === 'loading' && (
          <div className="grid gap-4" aria-label="Memuat doa harian">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="h-64 animate-pulse rounded-2xl border border-[#e6e2d7] bg-white" />
            ))}
          </div>
        )}

        {result.status === 'success' && visibleCount < filteredDuas.length && (
          <div className="pt-5 text-center">
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + 12)}
              className="rounded-full border border-[#d9dfd5] bg-white px-6 py-3 text-sm font-semibold text-[#327b68] transition hover:bg-[#edf3ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#327b68]"
            >
              Tampilkan {Math.min(12, filteredDuas.length - visibleCount)} doa lagi
            </button>
          </div>
        )}

        {result.status === 'error' && (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
            <p>{result.error}</p>
            <button
              type="button"
              onClick={() => {
                setResult({ status: 'loading', duas: [], error: '' });
                setRetry((value) => value + 1);
              }}
              className="mt-3 font-semibold underline underline-offset-4"
            >
              Muat ulang halaman untuk mencoba lagi
            </button>
          </div>
        )}

        {result.status === 'success' && filteredDuas.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#d5d8ca] bg-white px-6 py-12 text-center text-[#68766f]">
            Doa tidak ditemukan. Coba kata kunci atau kategori lain.
          </div>
        )}

        {result.status === 'success' && filteredDuas.length > 0 && (
          <div className="space-y-4">
            {visibleDuas.map((dua) => (
              <article key={dua.id} className="rounded-2xl border border-[#e6e2d7] bg-white p-5 shadow-sm sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#a77b2e]">{dua.grup}</p>
                    <h3 className="mt-2 text-lg font-semibold text-[#173d35]">{dua.nama}</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyDua(dua)}
                    className="inline-flex items-center gap-2 rounded-full border border-[#d9dfd5] px-3 py-2 text-xs font-semibold text-[#327b68] transition hover:bg-[#edf3ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#327b68]"
                  >
                    <FiCopy aria-hidden="true" />
                    {copiedId === dua.id
                      ? 'Tersalin'
                      : copiedId === `error-${dua.id}` ? 'Gagal menyalin' : 'Salin doa'}
                  </button>
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
          </div>
        )}
      </section>
    </div>
  );
}
