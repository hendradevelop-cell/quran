'use client';

import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiBookmark } from 'react-icons/fi';
import { BOOKMARKS_UPDATED_EVENT, isSameAyah, readBookmarks, writeBookmarks } from '../../../lib/bookmarks';

export default function AyatReader() {
  const { surahNumber } = useParams();
  const [result, setResult] = useState({ number: null, surah: null, error: '' });
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarkError, setBookmarkError] = useState('');
  const number = Number(surahNumber);
  const isValidNumber = Number.isInteger(number) && number >= 1 && number <= 114;
  const loading = isValidNumber && result.number !== number;
  const error = isValidNumber
    ? result.number === number ? result.error : ''
    : 'Nomor surah tidak valid. Pilih surah dari daftar yang tersedia.';
  const surah = result.number === number ? result.surah : null;

  useEffect(() => {
    if (!isValidNumber) return undefined;

    const controller = new AbortController();

    axios.get(`https://equran.id/api/v2/surat/${number}`, { signal: controller.signal })
      .then(({ data }) => setResult({ number, surah: data.data, error: '' }))
      .catch((requestError) => {
        if (!controller.signal.aborted) {
          console.error('Gagal memuat surah:', requestError);
          setResult({
            number,
            surah: null,
            error: 'Surah belum dapat dimuat. Periksa koneksi internet lalu coba lagi.',
          });
        }
      });

    return () => controller.abort();
  }, [isValidNumber, number]);

  useEffect(() => {
    const syncBookmarks = () => {
      try {
        setBookmarks(readBookmarks());
        setBookmarkError('');
      } catch (readError) {
        console.error('Gagal membaca bookmark:', readError);
        setBookmarkError('Bookmark tidak dapat dibaca dari penyimpanan browser.');
      }
    };

    syncBookmarks();
    window.addEventListener(BOOKMARKS_UPDATED_EVENT, syncBookmarks);
    window.addEventListener('storage', syncBookmarks);

    return () => {
      window.removeEventListener(BOOKMARKS_UPDATED_EVENT, syncBookmarks);
      window.removeEventListener('storage', syncBookmarks);
    };
  }, []);

  function toggleBookmark(ayah) {
    const isBookmarked = bookmarks.some((bookmark) => isSameAyah(bookmark, number, ayah.nomorAyat));
    const updatedBookmarks = isBookmarked
      ? bookmarks.filter((bookmark) => !isSameAyah(bookmark, number, ayah.nomorAyat))
      : [
        ...bookmarks,
        {
          surahNumber: number,
          surahName: surah.namaLatin,
          ayahNumber: ayah.nomorAyat,
          arabic: ayah.teksArab,
          latin: ayah.teksLatin,
          translation: ayah.teksIndonesia,
        },
      ];

    try {
      writeBookmarks(updatedBookmarks);
      setBookmarks(updatedBookmarks);
      setBookmarkError('');
    } catch (writeError) {
      console.error('Gagal menyimpan bookmark:', writeError);
      setBookmarkError('Bookmark gagal disimpan. Periksa pengaturan penyimpanan browser.');
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link href="/quran/surah" className="inline-flex items-center gap-2 text-sm font-semibold text-[#327b68] transition hover:text-[#124e43]">
        <span aria-hidden="true">←</span> Kembali ke daftar surah
      </Link>

      {loading && (
        <div className="space-y-4" aria-label="Memuat surah">
          <div className="h-48 animate-pulse rounded-[2rem] bg-[#e7e9df]" />
          <div className="h-40 animate-pulse rounded-2xl bg-white" />
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-800">
          {error}
        </div>
      )}

      {!loading && !error && surah && (
        <>
          <header className="rounded-[2rem] bg-[#124e43] px-6 py-9 text-center text-white shadow-lg shadow-emerald-950/10 sm:px-10 sm:py-12">
            <p className="text-sm font-medium text-emerald-50/75">{surah.tempatTurun} · {surah.jumlahAyat} ayat</p>
            <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">{surah.namaLatin}</h1>
            <p className="mt-2 text-emerald-50/80">{surah.arti}</p>
            <p lang="ar" dir="rtl" className="mt-6 text-4xl text-[#f1d99b]">{surah.nama}</p>
          </header>

          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-[#173d35]">Ayat</h2>
            <div className="flex items-center gap-3">
              <Link href="/quran/bookmarks" className="text-sm font-semibold text-[#327b68] hover:text-[#124e43]">
                Bookmark ({bookmarks.length})
              </Link>
              <span className="text-sm text-[#748179]">Surah {surah.nomor} dari 114</span>
            </div>
          </div>

          {bookmarkError && (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {bookmarkError}
            </div>
          )}

          <div className="space-y-4">
            {surah.ayat.map((ayat) => (
              <article id={`ayat-${ayat.nomorAyat}`} key={ayat.nomorAyat} className="scroll-mt-6 rounded-2xl border border-[#e6e2d7] bg-white p-5 shadow-sm sm:p-7">
                <div className="mb-6 flex items-center justify-between">
                  <span className="flex h-10 min-w-10 items-center justify-center rounded-xl bg-[#edf3ec] px-2 text-sm font-semibold text-[#276553]">
                    {ayat.nomorAyat}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleBookmark(ayat)}
                      aria-pressed={bookmarks.some((bookmark) => isSameAyah(bookmark, number, ayat.nomorAyat))}
                      aria-label={`${bookmarks.some((bookmark) => isSameAyah(bookmark, number, ayat.nomorAyat)) ? 'Hapus bookmark' : 'Simpan bookmark'} ayat ${ayat.nomorAyat}`}
                      className="flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-[#327b68] transition hover:bg-[#edf3ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#327b68]"
                    >
                      <FiBookmark
                        aria-hidden="true"
                        className={bookmarks.some((bookmark) => isSameAyah(bookmark, number, ayat.nomorAyat)) ? 'fill-current' : ''}
                      />
                      <span className="hidden sm:inline">
                        {bookmarks.some((bookmark) => isSameAyah(bookmark, number, ayat.nomorAyat)) ? 'Tersimpan' : 'Simpan'}
                      </span>
                    </button>
                    <audio
                      controls
                      preload="none"
                      className="h-9 max-w-[190px] sm:max-w-[240px]"
                      aria-label={`Putar audio ayat ${ayat.nomorAyat}`}
                    >
                      <source src={ayat.audio['01']} type="audio/mpeg" />
                      Browser Anda tidak mendukung pemutar audio.
                    </audio>
                  </div>
                </div>
                <p lang="ar" dir="rtl" className="text-right text-3xl leading-[2.2] text-[#173d35] sm:text-4xl">
                  {ayat.teksArab}
                </p>
                <p className="mt-5 text-sm italic leading-7 text-[#a77b2e]">{ayat.teksLatin}</p>
                <p className="mt-2 leading-7 text-[#52675f]">{ayat.teksIndonesia}</p>
              </article>
            ))}
          </div>

          <nav aria-label="Navigasi surah" className="flex justify-between gap-3 border-t border-[#e6e2d7] pt-5">
            {number > 1 ? (
              <Link href={`/quran/ayat/${number - 1}`} className="rounded-full border border-[#d9dfd5] bg-white px-5 py-2.5 text-sm font-semibold text-[#276553] hover:bg-[#edf3ec]">
                ← Surah sebelumnya
              </Link>
            ) : <span />}
            {number < 114 ? (
              <Link href={`/quran/ayat/${number + 1}`} className="rounded-full border border-[#d9dfd5] bg-white px-5 py-2.5 text-sm font-semibold text-[#276553] hover:bg-[#edf3ec]">
                Surah berikutnya →
              </Link>
            ) : <span />}
          </nav>
        </>
      )}
    </div>
  );
}
