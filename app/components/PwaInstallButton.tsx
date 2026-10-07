'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { FiDownload, FiX } from 'react-icons/fi';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

const INSTALLED_STORAGE_KEY = 'quran-web-installed';

function isAppInstalled() {
  if (
    window.matchMedia('(display-mode: standalone)').matches
    || Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  ) {
    return true;
  }

  try {
    return window.localStorage.getItem(INSTALLED_STORAGE_KEY) === 'true';
  } catch (error) {
    console.error('Gagal membaca status instalasi aplikasi:', error);
    return false;
  }
}

function subscribeToInstallState(onChange: () => void) {
  const displayMode = window.matchMedia('(display-mode: standalone)');
  window.addEventListener('appinstalled', onChange);
  window.addEventListener('storage', onChange);
  displayMode.addEventListener('change', onChange);

  return () => {
    window.removeEventListener('appinstalled', onChange);
    window.removeEventListener('storage', onChange);
    displayMode.removeEventListener('change', onChange);
  };
}

export default function PwaInstallButton() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [message, setMessage] = useState('');
  const [installing, setInstalling] = useState(false);
  const isInstalled = useSyncExternalStore(subscribeToInstallState, isAppInstalled, () => false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      if (isAppInstalled()) return;
      event.preventDefault();
      setInstalling(false);
      setInstallPrompt(event as InstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setInstalling(true);
      setMessage('');
      try {
        window.localStorage.setItem(INSTALLED_STORAGE_KEY, 'true');
      } catch (error) {
        console.error('Gagal menyimpan status instalasi aplikasi:', error);
      }
    };
    const registerServiceWorker = () => {
      navigator.serviceWorker.register('/sw.js').catch((error: unknown) => {
        console.error('Gagal mendaftarkan service worker:', error);
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    if ('serviceWorker' in navigator) {
      if (document.readyState === 'complete') {
        registerServiceWorker();
      } else {
        window.addEventListener('load', registerServiceWorker, { once: true });
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('load', registerServiceWorker);
    };
  }, []);

  const installApp = async () => {
    if (!installPrompt) {
      const isAppleMobile = /iphone|ipad|ipod/i.test(navigator.userAgent);
      setMessage(isAppleMobile
        ? 'Di Safari, ketuk Bagikan lalu pilih “Tambahkan ke Layar Utama”.'
        : 'Buka menu browser (⋮), lalu pilih “Instal aplikasi” atau “Tambahkan ke layar utama”.');
      return;
    }

    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      setInstallPrompt(null);
      if (choice.outcome === 'accepted') {
        setInstalling(true);
        setMessage('');
        try {
          window.localStorage.setItem(INSTALLED_STORAGE_KEY, 'true');
        } catch (error) {
          console.error('Gagal menyimpan status instalasi aplikasi:', error);
        }
      } else {
        setMessage('Instalasi dibatalkan. Kamu bisa memasangnya kapan saja dari menu browser.');
      }
    } catch (error) {
      console.error('Gagal memulai instalasi aplikasi:', error);
      setMessage('Instalasi belum dapat dimulai. Coba gunakan menu browser.');
    }
  };

  if (isInstalled || installing) return null;

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={installApp}
        aria-expanded={Boolean(message)}
        aria-controls="install-help"
        className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#124e43] px-3 text-xs font-semibold text-white transition hover:bg-[#0c4037] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#327b68] sm:px-4 sm:text-sm"
      >
        <FiDownload aria-hidden="true" />
        <span className="sm:hidden">Instal</span>
        <span className="hidden sm:inline">Instal aplikasi</span>
      </button>
      {message && (
        <div
          id="install-help"
          role="status"
          className="absolute right-0 top-full z-50 mt-3 flex w-72 items-start gap-3 rounded-2xl border border-[#e8e4d9] bg-white p-4 text-sm leading-6 text-[#52675f] shadow-xl"
        >
          <p className="flex-1">{message}</p>
          <button
            type="button"
            onClick={() => setMessage('')}
            aria-label="Tutup petunjuk instalasi"
            className="rounded-full p-1 text-[#748179] hover:bg-[#f7f6f1]"
          >
            <FiX aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
