'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FiBookmark, FiTrash2 } from 'react-icons/fi';
import { BOOKMARKS_UPDATED_EVENT, readBookmarks, writeBookmarks } from '../../lib/bookmarks';

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const syncBookmarks = () => {
      try {
        setBookmarks(readBookmarks());
        setError('');
      } catch (readError) {
        console.error('Gagal membaca bookmark:', readError);
        setError('Bookmark tidak dapat dibaca dari penyimpanan browser.');
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

  function removeBookmark(bookmark) {
    const updatedBookmarks = bookmarks.filter((item) => (
      item.surahNumber !== bookmark.surahNumber || item.ayahNumber !== bookmark.ayahNumber
    ));

    try {
      writeBookmarks(updatedBookmarks);
      setBookmarks(updatedBookmarks);
      setError('');
    } catch (writeError) {
      console.error('Gagal menghapus bookmark:', writeError);
      setError('Bookmark gagal dihapus. Periksa pengaturan penyimpanan browser.');
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="rounded-[2rem] bg-[#124e43] px-6 py-9 text-white shadow-lg shadow-emerald-950/10 sm:px-10 sm:py-12">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#f1d99b]">
            <FiBookmark aria-hidden="true" className="text-xl" />
          </span>
          <div>
            <p className="text-sm font-medium text-emerald-50/75">Catatan bacaan pribadi</p>
            <h1 className="mt-1 text-3xl font-semibold sm:text-4xl">Ayat tersimpan</h1>
          </div>
        </div>
        <p className="mt-5 text-sm text-emerald-50/80">
          {bookmarks.length} {bookmarks.length === 1 ? 'ayat' : 'ayat'} disimpan di browser ini.
        </p>
      </header>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {!error && bookmarks.length === 0 && (
        <section className="rounded-2xl border border-dashed border-[#d5d8ca] bg-white px-6 py-12 text-center">
          <FiBookmark aria-hidden="true" className="mx-auto text-3xl text-[#91a098]" />
          <h2 className="mt-4 text-lg font-semibold text-[#173d35]">Belum ada ayat tersimpan</h2>
          <p className="mt-2 text-sm text-[#748179]">Tekan tombol Simpan pada ayat untuk menemukannya lagi nanti.</p>
          <Link href="/quran/surah" className="mt-6 inline-flex rounded-full bg-[#124e43] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0c4037]">
            Jelajahi surah
          </Link>
        </section>
      )}

      {bookmarks.length > 0 && (
        <div className="space-y-4">
          {bookmarks.map((bookmark) => (
            <article
              key={`${bookmark.surahNumber}:${bookmark.ayahNumber}`}
              className="rounded-2xl border border-[#e6e2d7] bg-white p-5 shadow-sm sm:p-7"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <Link
                  href={`/quran/ayat/${bookmark.surahNumber}#ayat-${bookmark.ayahNumber}`}
                  className="text-sm font-semibold text-[#327b68] hover:text-[#124e43]"
                >
                  {bookmark.surahName} · Ayat {bookmark.ayahNumber}
                </Link>
                <button
                  type="button"
                  onClick={() => removeBookmark(bookmark)}
                  aria-label={`Hapus bookmark ${bookmark.surahName} ayat ${bookmark.ayahNumber}`}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#9b5b4b] transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9b5b4b]"
                >
                  <FiTrash2 aria-hidden="true" />
                </button>
              </div>
              <p lang="ar" dir="rtl" className="text-right text-3xl leading-[2.2] text-[#173d35] sm:text-4xl">
                {bookmark.arabic}
              </p>
              <p className="mt-4 text-sm italic leading-7 text-[#a77b2e]">{bookmark.latin}</p>
              <p className="mt-2 leading-7 text-[#52675f]">{bookmark.translation}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
