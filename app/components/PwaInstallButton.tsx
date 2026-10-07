'use client';

import { useEffect, useState } from 'react';
import { FiDownload, FiX } from 'react-icons/fi';

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

export default function PwaInstallButton() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setMessage('Quran Web berhasil ditambahkan ke perangkat.');
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
      setMessage(choice.outcome === 'accepted'
        ? 'Quran Web sedang ditambahkan ke perangkat.'
        : 'Instalasi dibatalkan. Kamu bisa memasangnya kapan saja dari menu browser.');
      setInstallPrompt(null);
    } catch (error) {
      console.error('Gagal memulai instalasi aplikasi:', error);
      setMessage('Instalasi belum dapat dimulai. Coba gunakan menu browser.');
    }
  };

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
