import './globals.css';
import type { Metadata, Viewport } from 'next';
import { FiBookOpen, FiBookmark, FiCompass, FiHeart, FiZap } from 'react-icons/fi';
import Link from 'next/link';
import BottomNavigation from './components/BottomNavigation';
import PwaInstallButton from './components/PwaInstallButton';
import ThemeModeControl from './components/ThemeModeControl';

const themeInitScript = `
  try {
    const preference = localStorage.getItem('quran-web-theme');
    const theme = preference === 'light' || preference === 'dark'
      ? preference
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch (error) {
    console.error('Gagal menerapkan preferensi tema:', error);
  }
`;

export const metadata: Metadata = {
  title: 'Quran Web — Teman Ibadah Harian',
  description: 'Baca Al-Qur’an, temukan doa harian, dan jaga rutinitas ibadah dalam satu aplikasi.',
  applicationName: 'Quran Web',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Quran Web',
    statusBarStyle: 'default',
  },
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#124e43',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

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

        <nav aria-label="Navigasi utama" className="hidden lg:block">
          <ul className="flex items-center gap-1 text-sm font-medium text-[#52675f]">
            <li>
              <Link href="/quran/surah" className="rounded-full px-3 py-2 transition hover:bg-[#edf3ec] hover:text-[#124e43]">Surah</Link>
            </li>
            <li>
              <Link href="/quran/ayat" className="rounded-full px-3 py-2 transition hover:bg-[#edf3ec] hover:text-[#124e43]">Ayat</Link>
            </li>
            <li>
              <Link href="/doa" className="flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-[#edf3ec] hover:text-[#124e43]">
                <FiHeart aria-hidden="true" />
                Doa
              </Link>
            </li>
            <li>
              <Link href="/game" className="flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-[#edf3ec] hover:text-[#124e43]">
                <FiZap aria-hidden="true" />
                Game
              </Link>
            </li>
            <li>
              <Link href="/shalat" className="flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-[#edf3ec] hover:text-[#124e43]">
                <FiCompass aria-hidden="true" />
                Shalat
              </Link>
            </li>
            <li>
              <Link href="/quran/bookmarks" className="flex items-center gap-2 rounded-full px-3 py-2 transition hover:bg-[#edf3ec] hover:text-[#124e43]">
                <FiBookmark aria-hidden="true" />
                Bookmark
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <ThemeModeControl />
          <PwaInstallButton />
        </div>
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
    <html lang="id" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <HeaderComponent />

        <main className="mx-auto min-h-[calc(100vh-160px)] max-w-6xl px-4 pb-28 pt-5 sm:px-6 sm:pt-10 sm:pb-28 lg:pb-10">
          {children}
        </main>

        <footer className="border-t border-[#e8e4d9] bg-[#fbfaf6] px-4 pb-24 pt-6 lg:pb-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 text-center text-sm text-[#748179] sm:flex-row sm:text-left">
            <p>© 2026 Quran Web</p>
            <p>Semoga setiap ayat membawa kebaikan.</p>
            <p>
              by{' '}
              <a className="font-semibold text-[#327b68] underline-offset-4 hover:underline" href="mailto:hendra.develop@gmail.com">
                Hendra
              </a>
            </p>
          </div>
        </footer>
        <BottomNavigation />
      </body>
    </html>
  );
}