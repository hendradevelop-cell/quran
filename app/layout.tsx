import './globals.css';
import { FiBookOpen, FiBookmark, FiCompass, FiHeart, FiZap } from 'react-icons/fi';
import Link from 'next/link';

function HeaderComponent() {
  return (
    <header className="border-b border-[#e8e4d9] bg-[#fbfaf6]">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3 text-[#173d35]">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#124e43] text-lg text-[#f1d99b]">
            <FiBookOpen aria-hidden="true" />
          </span>
          <span>
            <span className="block text-lg font-bold tracking-tight">Quran Web</span>
            <span className="hidden text-xs text-[#7b8981] sm:block">Baca dengan tenang</span>
          </span>
        </Link>

        <nav aria-label="Navigasi utama">
          <ul className="flex items-center gap-1 text-sm font-medium text-[#52675f] sm:gap-2">
            <li>
              <Link href="/quran/surah" className="rounded-full px-3 py-2 transition hover:bg-[#edf3ec] hover:text-[#124e43] sm:px-4">Surah</Link>
            </li>
            <li>
              <Link href="/quran/ayat" className="rounded-full px-3 py-2 transition hover:bg-[#edf3ec] hover:text-[#124e43] sm:px-4">Ayat</Link>
            </li>
            <li>
              <Link href="/doa" className="flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-[#edf3ec] hover:text-[#124e43] sm:px-4">
                <FiHeart aria-hidden="true" />
                Doa
              </Link>
            </li>
            <li>
              <Link href="/game" className="flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-[#edf3ec] hover:text-[#124e43] sm:px-4">
                <FiZap aria-hidden="true" />
                Game
              </Link>
            </li>
            <li>
              <Link href="/shalat" className="flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-[#edf3ec] hover:text-[#124e43] sm:px-4">
                <FiCompass aria-hidden="true" />
                Shalat
              </Link>
            </li>
            <li>
              <Link href="/quran/bookmarks" className="flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-[#edf3ec] hover:text-[#124e43] sm:px-4">
                <FiBookmark aria-hidden="true" />
                Bookmark
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <HeaderComponent />

        <main className="mx-auto min-h-[calc(100vh-160px)] max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          {children}
        </main>

        <footer className="border-t border-[#e8e4d9] bg-[#fbfaf6] px-4 py-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-center text-sm text-[#748179] sm:flex-row sm:text-left">
            <p>© 2026 Quran Web</p>
            <p>Semoga setiap ayat membawa kebaikan.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}