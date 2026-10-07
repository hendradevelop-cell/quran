'use client';

import { useEffect, useState } from 'react';
import { FiCheck, FiMonitor, FiMoon, FiSun } from 'react-icons/fi';

type ThemeMode = 'light' | 'dark';
type ThemePreference = ThemeMode | 'system';

const STORAGE_KEY = 'quran-web-theme';
const THEME_COLORS: Record<ThemeMode, string> = {
  light: '#124e43',
  dark: '#15211d',
};

function getStoredPreference(): ThemePreference {
  try {
    const preference = window.localStorage.getItem(STORAGE_KEY);
    if (preference === 'light' || preference === 'dark') return preference;
  } catch (error) {
    console.error('Gagal membaca preferensi tema:', error);
  }

  return 'system';
}

function getSystemTheme(): ThemeMode {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[theme]);
}

export default function ThemeModeControl() {
  const [preference, setPreference] = useState<ThemePreference>('system');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const syncTheme = () => {
      const nextPreference = getStoredPreference();
      const nextTheme = nextPreference === 'system' ? getSystemTheme() : nextPreference;
      setPreference(nextPreference);
      setTheme(nextTheme);
      applyTheme(nextTheme);
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY || event.key === null) syncTheme();
    };

    syncTheme();
    mediaQuery.addEventListener('change', syncTheme);
    window.addEventListener('storage', handleStorage);

    return () => {
      mediaQuery.removeEventListener('change', syncTheme);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const choosePreference = (nextPreference: ThemePreference) => {
    const nextTheme = nextPreference === 'system' ? getSystemTheme() : nextPreference;

    try {
      if (nextPreference === 'system') {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, nextPreference);
      }
    } catch (error) {
      console.error('Gagal menyimpan preferensi tema:', error);
    }

    setPreference(nextPreference);
    setTheme(nextTheme);
    applyTheme(nextTheme);
    setIsOpen(false);
  };

  const CurrentIcon = theme === 'dark' ? FiMoon : FiSun;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label="Pilih tampilan siang, malam, atau otomatis"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls="theme-mode-menu"
        title="Atur mode tampilan"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e8e4d9] bg-white text-[#52675f] transition hover:bg-[#edf3ec] hover:text-[#124e43] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#327b68]"
      >
        <CurrentIcon aria-hidden="true" />
      </button>
      {isOpen && (
        <div
          id="theme-mode-menu"
          role="menu"
          aria-label="Mode tampilan"
          className="absolute right-0 top-full z-50 mt-3 w-48 rounded-2xl border border-[#e8e4d9] bg-white p-2 text-[#52675f] shadow-xl"
        >
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[#748179]">Mode tampilan</p>
          <button
            type="button"
            role="menuitemradio"
            aria-checked={preference === 'light'}
            onClick={() => choosePreference('light')}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition hover:bg-[#edf3ec]"
          >
            <FiSun aria-hidden="true" />
            <span className="flex-1 text-left">Siang</span>
            {preference === 'light' && <FiCheck aria-hidden="true" className="text-[#327b68]" />}
          </button>
          <button
            type="button"
            role="menuitemradio"
            aria-checked={preference === 'dark'}
            onClick={() => choosePreference('dark')}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition hover:bg-[#edf3ec]"
          >
            <FiMoon aria-hidden="true" />
            <span className="flex-1 text-left">Malam</span>
            {preference === 'dark' && <FiCheck aria-hidden="true" className="text-[#327b68]" />}
          </button>
          <button
            type="button"
            role="menuitemradio"
            aria-checked={preference === 'system'}
            onClick={() => choosePreference('system')}
            className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium transition hover:bg-[#edf3ec]"
          >
            <FiMonitor aria-hidden="true" />
            <span className="flex-1 text-left">Otomatis</span>
            {preference === 'system' && <FiCheck aria-hidden="true" className="text-[#327b68]" />}
          </button>
        </div>
      )}
    </div>
  );
}
