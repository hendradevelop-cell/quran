'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FiBookOpen,
  FiCheck,
  FiChevronRight,
  FiClock,
  FiCompass,
  FiHeart,
  FiMapPin,
  FiShare2,
  FiZap,
} from 'react-icons/fi';

type PrayerName = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
type PrayerTimes = Record<PrayerName, string>;
type City = { name: string; country: string; timezone: string };
type PrayerSchedule = { timings: PrayerTimes; timezone: string };
type LocationChoice = { kind: 'city'; city: City } | { kind: 'coordinates'; latitude: number; longitude: number };
type PrayerApiResponse = {
  code: number;
  status?: string;
  data?: { timings: PrayerTimes; meta?: { timezone?: string } };
};

const CITIES: City[] = [
  { name: 'Jakarta', country: 'Indonesia', timezone: 'Asia/Jakarta' },
  { name: 'Bandung', country: 'Indonesia', timezone: 'Asia/Jakarta' },
  { name: 'Surabaya', country: 'Indonesia', timezone: 'Asia/Jakarta' },
  { name: 'Yogyakarta', country: 'Indonesia', timezone: 'Asia/Jakarta' },
  { name: 'Medan', country: 'Indonesia', timezone: 'Asia/Jakarta' },
  { name: 'Makassar', country: 'Indonesia', timezone: 'Asia/Makassar' },
  { name: 'Denpasar', country: 'Indonesia', timezone: 'Asia/Makassar' },
];

const PRAYERS: { name: PrayerName; label: string }[] = [
  { name: 'Fajr', label: 'Subuh' },
  { name: 'Dhuhr', label: 'Zuhur' },
  { name: 'Asr', label: 'Asar' },
  { name: 'Maghrib', label: 'Magrib' },
  { name: 'Isha', label: 'Isya' },
];

const FEATURES = [
  {
    title: 'Al-Qur’an',
    description: 'Baca surah, pahami arti, dan simpan ayat favorit.',
    icon: FiBookOpen,
    href: '/quran/surah',
    action: 'Mulai membaca',
    style: 'bg-[#124e43] text-white',
    iconStyle: 'bg-white/10 text-[#f1d99b]',
    available: true,
  },
  {
    title: 'Doa harian',
    description: 'Kumpulan doa pendek untuk menemani keseharian.',
    icon: FiHeart,
    href: '/doa',
    action: 'Lihat doa',
    style: 'bg-white text-[#173d35]',
    iconStyle: 'bg-[#fff0e9] text-[#b66e54]',
    available: true,
  },
  {
    title: 'Panduan shalat',
    description: 'Pengingat waktu dan panduan ibadah dalam satu tempat.',
    icon: FiCompass,
    href: '/shalat',
    action: 'Lihat panduan',
    style: 'bg-white text-[#173d35]',
    iconStyle: 'bg-[#edf3ec] text-[#327b68]',
    available: true,
  },
  {
    title: 'Game kebaikan',
    description: 'Tantangan ringan untuk bikin rutinitas ibadah makin seru.',
    icon: FiZap,
    href: '/game',
    action: 'Main kuis',
    style: 'bg-white text-[#173d35]',
    iconStyle: 'bg-[#fff4dc] text-[#b6812e]',
    available: true,
  },
];

function getLocalDate(timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function getLocalClock(timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const hour = Number(parts.find(({ type }) => type === 'hour')?.value);
  const minute = Number(parts.find(({ type }) => type === 'minute')?.value);
  return hour * 60 + minute;
}

function getCountdown(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(remainingMinutes).padStart(2, '0')}`;
}

export default function PrayerDashboard() {
  const [location, setLocation] = useState<LocationChoice>({ kind: 'city', city: CITIES[0] });
  const [result, setResult] = useState<{ requestKey: string; schedule: PrayerSchedule | null; error: string }>({
    requestKey: '',
    schedule: null,
    error: '',
  });
  const [locationMessage, setLocationMessage] = useState('');
  const [clock, setClock] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const [shareMessage, setShareMessage] = useState('');

  const timeZone = location.kind === 'city' ? location.city.timezone : result.schedule?.timezone ?? 'Asia/Jakarta';
  const locationName = location.kind === 'city' ? location.city.name : 'Lokasi saya';
  const date = getLocalDate(timeZone);
  const requestKey = `${location.kind}:${location.kind === 'city'
    ? location.city.name
    : `${location.latitude},${location.longitude}`}:${date}:${refresh}`;
  const schedule = result.requestKey === requestKey ? result.schedule : null;
  const error = result.requestKey === requestKey ? result.error : '';
  const loading = !schedule && !error;
  const apiDate = date.split('-').reverse().join('-');
  const url = location.kind === 'city'
    ? `https://api.aladhan.com/v1/timingsByCity/${apiDate}?city=${encodeURIComponent(location.city.name)}&country=${encodeURIComponent(location.city.country)}&method=20`
    : `https://api.aladhan.com/v1/timings/${apiDate}?latitude=${location.latitude}&longitude=${location.longitude}&method=20`;

  useEffect(() => {
    const updateClock = () => setClock(getLocalClock(timeZone));
    updateClock();
    const intervalId = window.setInterval(updateClock, 30_000);
    return () => window.clearInterval(intervalId);
  }, [timeZone]);

  useEffect(() => {
    const controller = new AbortController();

    fetch(url, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error(`Prayer time service returned ${response.status}`);
        const apiResult: PrayerApiResponse = await response.json();
        if (apiResult.code !== 200 || !apiResult.data?.timings) {
          throw new Error(apiResult.status ?? 'Prayer times were not included in the response');
        }
        return apiResult.data;
      })
      .then((data) => {
        setResult({
          requestKey,
          schedule: {
            timings: data.timings,
            timezone: data.meta?.timezone ?? timeZone,
          },
          error: '',
        });
      })
      .catch((requestError: unknown) => {
        if (!controller.signal.aborted) {
          console.error('Gagal memuat jadwal shalat:', requestError);
          setResult({
            requestKey,
            schedule: null,
            error: 'Jadwal belum dapat dimuat. Periksa koneksi internet lalu coba lagi.',
          });
        }
      });

    return () => controller.abort();
  }, [requestKey, timeZone, url]);

  const nextPrayer = useMemo(() => {
    if (!schedule) return null;

    const upcoming = PRAYERS.map((prayer) => {
      const [hour, minute] = schedule.timings[prayer.name].split(':').map(Number);
      return { ...prayer, minutes: hour * 60 + minute };
    }).find((prayer) => prayer.minutes > clock);

    if (upcoming) return { ...upcoming, remaining: upcoming.minutes - clock };
    const nextDayFajr = PRAYERS[0];
    const [hour, minute] = schedule.timings.Fajr.split(':').map(Number);
    return { ...nextDayFajr, remaining: 24 * 60 - clock + hour * 60 + minute };
  }, [clock, schedule]);

  const displayDate = new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  }).format(new Date());

  const selectCity = (cityName: string) => {
    const city = CITIES.find((item) => item.name === cityName);
    if (city) {
      setLocation({ kind: 'city', city });
      setLocationMessage('');
    }
  };

  const useCurrentLocation = () => {
    if (!window.isSecureContext) {
      setLocationMessage('Browser memblokir GPS melalui HTTP biasa. Di komputer server, buka http://localhost:3000; dari perangkat lain, gunakan HTTPS dengan sertifikat valid. Lalu izinkan akses lokasi. Sementara itu, pilih kota pada menu “Atur kota”.');
      return;
    }

    if (!navigator.geolocation) {
      setLocationMessage('Browser ini tidak mendukung deteksi lokasi. Silakan pilih kota.');
      return;
    }

    setLocationMessage('Meminta izin lokasi…');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({ kind: 'coordinates', latitude: coords.latitude, longitude: coords.longitude });
        setLocationMessage('');
      },
      (locationError) => {
        const message = locationError.code === locationError.PERMISSION_DENIED
          ? 'Izin lokasi ditolak. Izinkan akses lokasi untuk situs ini di pengaturan browser, lalu coba lagi.'
          : locationError.code === locationError.TIMEOUT
            ? 'Permintaan lokasi terlalu lama. Coba lagi atau pilih kota secara manual.'
            : 'Lokasi tidak tersedia. Periksa pengaturan lokasi perangkat atau pilih kota secara manual.';
        setLocationMessage(message);
      },
      { enableHighAccuracy: false, timeout: 10_000 },
    );
  };

  const shareSchedule = useCallback(async () => {
    if (!schedule) return;
    const text = [
      `Jadwal shalat ${locationName} hari ini`,
      ...PRAYERS.map(({ name, label }) => `${label} ${schedule.timings[name]}`),
      'Yuk saling ingatkan untuk menjaga waktu shalat 🤍',
    ].join('\n');

    try {
      if (navigator.share) {
        await navigator.share({ title: 'Jadwal shalat hari ini', text });
        setShareMessage('Jadwal berhasil dibagikan.');
      } else {
        await navigator.clipboard.writeText(text);
        setShareMessage('Jadwal disalin. Bagikan ke teman atau grupmu!');
      }
    } catch (shareError) {
      if (shareError instanceof Error && shareError.name === 'AbortError') return;
      console.error('Gagal membagikan jadwal shalat:', shareError);
      setShareMessage('Jadwal tidak dapat dibagikan dari browser ini.');
    }
  }, [locationName, schedule]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
      <section className="relative overflow-hidden rounded-[1.5rem] bg-[#124e43] px-4 py-6 text-white shadow-xl shadow-emerald-950/10 sm:rounded-[2rem] sm:px-10 sm:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full border border-white/10 sm:h-[30rem] sm:w-[30rem]" />
        <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-20 h-64 w-64 rounded-full border border-white/10 sm:h-96 sm:w-96" />
        <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f1d99b]">Ruang ibadah harian</p>
            <h1 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-5xl">
              Jaga waktu, jaga hati.
            </h1>
            <p className="mt-4 max-w-md leading-7 text-emerald-50/80">
              Assalamu&apos;alaikum. Satu pengingat kecil untuk menemani hari yang lebih bermakna.
            </p>
            <p className="mt-6 text-sm capitalize text-emerald-50/70">{displayDate}</p>
          </div>

          <div className="rounded-[1.5rem] border border-white/15 bg-white/[0.08] p-4 backdrop-blur-sm sm:rounded-[1.75rem] sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-emerald-50/70">Jadwal shalat hari ini</p>
                <div className="mt-2 flex items-center gap-2 text-sm font-medium">
                  <FiMapPin aria-hidden="true" className="text-[#f1d99b]" />
                  <span>{locationName}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={useCurrentLocation}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-2 text-xs font-semibold transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f1d99b]"
              >
                <FiMapPin aria-hidden="true" />
                Gunakan lokasi saya
              </button>
            </div>

            {locationMessage && <p role="status" className="mt-3 text-xs text-[#f1d99b]">{locationMessage}</p>}

            {loading && (
              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-5" aria-label="Memuat jadwal shalat">
                {PRAYERS.map(({ name }) => (
                  <div key={name} className="h-20 animate-pulse rounded-2xl bg-white/10" />
                ))}
              </div>
            )}

            {error && (
              <div role="alert" className="mt-5 rounded-2xl border border-red-200/30 bg-red-950/20 p-4 text-sm text-white">
                <p>{error}</p>
                <button type="button" onClick={() => setRefresh((value) => value + 1)} className="mt-2 font-semibold text-[#f1d99b] underline underline-offset-4">
                  Coba lagi
                </button>
              </div>
            )}

            {!loading && !error && schedule && (
              <>
                {nextPrayer && (
                  <div className="mt-5 flex flex-wrap items-end justify-between gap-3 rounded-2xl bg-[#f1d99b] p-4 text-[#173d35]">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#527067]">Waktu berikutnya</p>
                      <p className="mt-1 text-xl font-semibold">{nextPrayer.label} <span className="font-normal">· {schedule.timings[nextPrayer.name]}</span></p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <FiClock aria-hidden="true" />
                      <span>{getCountdown(nextPrayer.remaining)} lagi</span>
                    </div>
                  </div>
                )}

                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                  {PRAYERS.map(({ name, label }) => {
                    const isNext = nextPrayer?.name === name;
                    return (
                      <div key={name} className={`rounded-2xl px-3 py-3 text-center ${isNext ? 'bg-white text-[#124e43]' : 'bg-white/[0.08] text-white'}`}>
                        <p className={`text-xs ${isNext ? 'text-[#668077]' : 'text-emerald-50/70'}`}>{label}</p>
                        <p className="mt-1 text-lg font-semibold tabular-nums">{schedule.timings[name]}</p>
                        {isNext && <span className="text-[10px] font-semibold uppercase tracking-wider text-[#327b68]">Berikutnya</span>}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-xs text-emerald-50/75">
                    Atur kota
                    <select
                      value={location.kind === 'city' ? location.city.name : ''}
                      onChange={(event) => selectCity(event.target.value)}
                      className="rounded-full border border-white/20 bg-[#124e43] px-3 py-2 text-xs font-semibold text-white outline-none focus-visible:ring-2 focus-visible:ring-[#f1d99b]"
                    >
                      {location.kind === 'coordinates' && <option value="">Lokasi saya</option>}
                      {CITIES.map((city) => <option key={city.name} value={city.name}>{city.name}</option>)}
                    </select>
                  </label>
                  <button
                    type="button"
                    onClick={shareSchedule}
                    className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold text-[#f1d99b] transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f1d99b]"
                  >
                    <FiShare2 aria-hidden="true" />
                    Bagikan jadwal
                  </button>
                </div>
                {shareMessage && <p role="status" className="mt-2 text-right text-xs text-[#f1d99b]">{shareMessage}</p>}
              </>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="features-title">
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a77b2e]">Pilih perjalananmu</p>
            <h2 id="features-title" className="mt-1 text-2xl font-semibold text-[#173d35] sm:text-3xl">
              Ibadah, dalam genggaman.
            </h2>
          </div>
          <p className="hidden max-w-sm text-sm leading-6 text-[#748179] sm:block">
            Mulai dari satu kebiasaan kecil. Ajak teman agar makin semangat.
          </p>
        </div>

        <p className="mb-3 text-xs font-medium text-[#748179] sm:hidden">Geser untuk menjelajahi fitur</p>
        <div className="mobile-feature-track -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
          {FEATURES.map(({ title, description, icon: Icon, href, action, style, iconStyle, available }) => {
            const content = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${iconStyle}`}>
                    <Icon aria-hidden="true" />
                  </span>
                  {available ? (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-[#f1d99b]">Mulai</span>
                  ) : (
                    <span className="rounded-full bg-[#f7f3e8] px-3 py-1 text-[11px] font-semibold text-[#8c764a]">Segera hadir</span>
                  )}
                </div>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className={`mt-2 min-h-12 text-sm leading-6 ${available ? 'text-emerald-50/75' : 'text-[#748179]'}`}>{description}</p>
                <span className={`mt-4 inline-flex items-center gap-2 text-sm font-semibold ${available ? 'text-[#f1d99b]' : 'text-[#a77b2e]'}`}>
                  {action}
                  {available ? <FiChevronRight aria-hidden="true" /> : <FiClock aria-hidden="true" />}
                </span>
              </>
            );

            return href ? (
              <Link
                key={title}
                href={href}
                className={`group min-w-[84%] snap-start rounded-[1.5rem] p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#327b68] sm:min-w-0 sm:rounded-[1.75rem] sm:p-5 ${style}`}
              >
                {content}
              </Link>
            ) : (
              <article key={title} className={`rounded-[1.75rem] border border-[#e6e2d7] p-5 shadow-sm ${style}`}>
                {content}
              </article>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-[1.75rem] border border-[#e6e2d7] bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#edf3ec] text-[#327b68]">
            <FiCheck aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-semibold text-[#173d35]">Mulai dari hari ini</h2>
            <p className="mt-1 text-sm leading-6 text-[#748179]">Pilih satu amalan kecil, lalu bagikan semangat baik ke orang terdekat.</p>
          </div>
        </div>
        <Link href="/quran/surah" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#124e43] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0c4037]">
          Buka Al-Qur&apos;an
          <FiChevronRight aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
