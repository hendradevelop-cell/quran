import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Quran Web — Teman Ibadah Harian',
    short_name: 'Quran Web',
    description: 'Baca Al-Qur’an dan jaga rutinitas ibadah harian.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: '#f7f6f1',
    theme_color: '#124e43',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
