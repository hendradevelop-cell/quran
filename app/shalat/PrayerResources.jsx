import { FiExternalLink } from 'react-icons/fi';

const PRAYER_RESOURCES = [
  {
    title: 'Doa Shalat',
    description: 'Kumpulan doa shalat dengan bacaan Arab, Latin, dan terjemahan.',
    href: 'https://quran.nu.or.id/doa/doa-shalat',
  },
  {
    title: 'Tahlil',
    description: 'Bacaan tahlil dari Quran NU Online.',
    href: 'https://quran.nu.or.id/tahlil',
  },
  {
    title: 'Hadits NU',
    description: 'Jelajahi kumpulan hadits dari NU Online.',
    href: 'https://hadits.nu.or.id/',
  },
  {
    title: 'Wirid Shalawat',
    description: 'Kumpulan wirid shalawat dari Quran NU Online.',
    href: 'https://quran.nu.or.id/wirid/shalawat',
  },
];

export default function PrayerResources() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="rounded-[2rem] bg-[#124e43] px-6 py-9 text-white shadow-xl shadow-emerald-950/10 sm:px-10 sm:py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f1d99b]">Rujukan ibadah</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Doa dan bacaan shalat</h1>
        <p className="mt-4 max-w-2xl leading-7 text-emerald-50/80">
          Pilih kumpulan bacaan dari Quran NU Online. Tautan akan dibuka di tab baru.
        </p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2" aria-label="Daftar bacaan shalat">
        {PRAYER_RESOURCES.map((resource) => (
          <li key={resource.href}>
            <a
              href={resource.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full items-center justify-between gap-4 rounded-2xl border border-[#e6e2d7] bg-white p-5 shadow-sm transition hover:border-[#adc6b8] hover:shadow-md sm:p-6"
            >
              <span>
                <span className="block text-xl font-semibold text-[#173d35]">{resource.title}</span>
                <span className="mt-2 block text-sm leading-6 text-[#748179]">{resource.description}</span>
              </span>
              <FiExternalLink aria-hidden="true" className="shrink-0 text-xl text-[#327b68] transition group-hover:text-[#124e43]" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
