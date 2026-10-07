import Link from 'next/link';
import { FiArrowLeft, FiCheck, FiInfo } from 'react-icons/fi';
import { AFTER_PRAYER_DHIKR, OBLIGATORY_PRAYERS, SALAH_STEPS } from '../data';

const PRAYER_GROUPS = [
  { title: '2 rakaat', names: 'Subuh' },
  { title: '3 rakaat', names: 'Magrib' },
  { title: '4 rakaat', names: 'Zuhur, Asar, dan Isya' },
];

export default function ObligatoryPrayerPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <Link href="/shalat" className="inline-flex items-center gap-2 text-sm font-semibold text-[#327b68] hover:text-[#124e43]">
        <FiArrowLeft aria-hidden="true" /> Kembali ke panduan shalat
      </Link>

      <header className="rounded-[2rem] bg-[#124e43] px-6 py-9 text-white shadow-xl shadow-emerald-950/10 sm:px-10 sm:py-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f1d99b]">Panduan praktis</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Tata cara shalat wajib</h1>
        <p className="mt-4 max-w-2xl leading-7 text-emerald-50/80">
          Rangkuman urutan shalat dari persiapan hingga zikir setelah salam. Sesuaikan detailnya dengan tuntunan mazhab yang Anda ikuti.
        </p>
      </header>

      <section className="rounded-2xl border border-[#e6e2d7] bg-white p-5 shadow-sm sm:p-7">
        <h2 className="text-xl font-semibold text-[#173d35]">Jumlah rakaat shalat fardu</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {PRAYER_GROUPS.map((group) => (
            <div key={group.title} className="rounded-2xl bg-[#edf3ec] p-4">
              <p className="text-lg font-semibold text-[#276553]">{group.title}</p>
              <p className="mt-1 text-sm text-[#52675f]">{group.names}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-6 text-[#748179]">
          {OBLIGATORY_PRAYERS.map((prayer) => `${prayer.name}: ${prayer.rakah}`).join(' · ')}.
        </p>
      </section>

      <section className="space-y-3" aria-labelledby="steps-title">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a77b2e]">Urutan ibadah</p>
          <h2 id="steps-title" className="mt-1 text-2xl font-semibold text-[#173d35]">Langkah-langkah shalat</h2>
        </div>
        {SALAH_STEPS.map((step) => (
          <article key={step.title} className="rounded-2xl border border-[#e6e2d7] bg-white p-5 shadow-sm sm:p-6">
            <h3 className="font-semibold text-[#173d35]">{step.title}</h3>
            <p className="mt-2 text-sm leading-7 text-[#52675f]">{step.body}</p>
          </article>
        ))}
      </section>

      <section className="space-y-4" aria-labelledby="after-prayer-title">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a77b2e]">Setelah salam</p>
          <h2 id="after-prayer-title" className="mt-1 text-2xl font-semibold text-[#173d35]">Zikir dan doa</h2>
          <p className="mt-2 text-sm leading-6 text-[#748179]">Berikut contoh zikir yang diriwayatkan setelah shalat fardu.</p>
        </div>
        {AFTER_PRAYER_DHIKR.map((dhikr) => (
          <article key={dhikr.latin} className="rounded-2xl border border-[#e6e2d7] bg-white p-5 shadow-sm sm:p-7">
            <p lang="ar" dir="rtl" className="text-right text-2xl leading-[2.1] text-[#173d35] sm:text-3xl">{dhikr.arabic}</p>
            <p className="mt-4 text-sm italic leading-7 text-[#a77b2e]">{dhikr.latin}</p>
            <p className="mt-2 leading-7 text-[#52675f]">{dhikr.translation}</p>
            <p className="mt-3 rounded-xl bg-[#fbfaf6] p-3 text-sm leading-6 text-[#748179]">{dhikr.note}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-[#dce8dd] bg-[#f2f7f1] p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <FiInfo aria-hidden="true" className="mt-0.5 shrink-0 text-lg text-[#327b68]" />
          <div>
            <h2 className="font-semibold text-[#173d35]">Catatan perbedaan fikih</h2>
            <p className="mt-2 text-sm leading-7 text-[#52675f]">
              Rincian seperti posisi tangan, bacaan makmum, basmalah, tasyahud, gerakan jari, dan jumlah salam memiliki variasi antarmazhab dan riwayat. Perbedaan tersebut tidak dirangkum sebagai satu-satunya cara yang benar di halaman ini. Pelajari tata cara lengkap dari guru atau imam tepercaya.
            </p>
          </div>
        </div>
      </section>

      <aside className="rounded-2xl border border-[#e6e2d7] bg-white p-5 text-sm leading-6 text-[#748179]">
        <h2 className="font-semibold text-[#173d35]">Rujukan ringkas</h2>
        <ul className="mt-2 list-inside list-disc space-y-1">
          <li>Hadis “Shalatlah kalian sebagaimana kalian melihat aku shalat” — Sahih al-Bukhari 631.</li>
          <li>Istigfar dan doa “Allahumma antas-salam” setelah salam — Sahih Muslim 591.</li>
          <li>Doa “Allahumma la mani‘a lima a‘thaita” setelah shalat — Sahih al-Bukhari 844.</li>
          <li>Zikir tasbih, tahmid, dan takbir setelah shalat — Sahih Muslim 597.</li>
        </ul>
        <p className="mt-3">Rujukan hadis menjelaskan dasar amalan; rincian penerapan fikih dapat berbeda.</p>
      </aside>

      <Link href="/shalat/sunah" className="inline-flex items-center gap-2 rounded-full bg-[#124e43] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0c4037]">
        Lanjut ke panduan shalat sunah <FiCheck aria-hidden="true" />
      </Link>
    </div>
  );
}
