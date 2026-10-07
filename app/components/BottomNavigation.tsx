'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiBookOpen, FiBookmark, FiCompass, FiHeart, FiHome, FiNavigation } from 'react-icons/fi';

const ITEMS = [
  { label: 'Beranda', href: '/', icon: FiHome },
  { label: 'Al-Qur’an', href: '/quran/surah', icon: FiBookOpen },
  { label: 'Kiblat', href: '/kiblat', icon: FiNavigation },
  { label: 'Doa', href: '/doa', icon: FiHeart },
  { label: 'Shalat', href: '/shalat', icon: FiCompass },
  { label: 'Simpan', href: '/quran/bookmarks', icon: FiBookmark },
];

export default function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navigasi utama" className="mobile-bottom-nav fixed inset-x-0 bottom-0 z-40 border-t border-[#e8e4d9] bg-[#fbfaf6]/95 backdrop-blur-lg lg:hidden">
      <ul className="mx-auto grid max-w-lg grid-cols-6 px-1 pt-2 sm:px-2">
        {ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = href === '/'
            ? pathname === '/'
            : pathname === href || pathname.startsWith(`${href}/`);

          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[10px] font-semibold transition ${
                  isActive ? 'text-[#124e43]' : 'text-[#748179] hover:text-[#124e43]'
                }`}
              >
                <Icon aria-hidden="true" className={`text-[19px] ${isActive ? 'stroke-[2.4]' : ''}`} />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
