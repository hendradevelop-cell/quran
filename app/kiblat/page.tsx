'use client';

import { useEffect, useRef, useState } from 'react';
import { FiAlertCircle, FiCompass, FiMapPin, FiNavigation, FiRefreshCw } from 'react-icons/fi';

const KAABA = { latitude: 21.4225, longitude: 39.8262 };
const CARDINAL_DIRECTIONS = ['Utara', 'Timur Laut', 'Timur', 'Tenggara', 'Selatan', 'Barat Daya', 'Barat', 'Barat Laut'];

type LocationFix = {
  latitude: number;
  longitude: number;
  accuracy: number;
};

type CompassEvent = DeviceOrientationEvent & {
  webkitCompassHeading?: number;
};

type DeviceOrientationPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<PermissionState>;
};

function getQiblaBearing(latitude: number, longitude: number) {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitudeRadians = toRadians(latitude);
  const kaabaLatitudeRadians = toRadians(KAABA.latitude);
  const longitudeDifference = toRadians(KAABA.longitude - longitude);
  const y = Math.sin(longitudeDifference) * Math.cos(kaabaLatitudeRadians);
  const x = Math.cos(latitudeRadians) * Math.sin(kaabaLatitudeRadians)
    - Math.sin(latitudeRadians) * Math.cos(kaabaLatitudeRadians) * Math.cos(longitudeDifference);

  return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

function getDistanceToKaaba(latitude: number, longitude: number) {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitudeDifference = toRadians(KAABA.latitude - latitude);
  const longitudeDifference = toRadians(KAABA.longitude - longitude);
  const haversine = Math.sin(latitudeDifference / 2) ** 2
    + Math.cos(toRadians(latitude)) * Math.cos(toRadians(KAABA.latitude))
    * Math.sin(longitudeDifference / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

function getCardinalDirection(degrees: number) {
  return CARDINAL_DIRECTIONS[Math.round(degrees / 45) % CARDINAL_DIRECTIONS.length];
}

function getLocationErrorMessage(error: GeolocationPositionError) {
  if (error.code === error.PERMISSION_DENIED) {
    return 'Izin lokasi ditolak. Aktifkan izin lokasi untuk situs ini di pengaturan browser, lalu coba lagi.';
  }
  if (error.code === error.TIMEOUT) {
    return 'GPS belum merespons. Coba lagi di area dengan sinyal GPS yang lebih baik.';
  }
  return 'Lokasi belum tersedia. Aktifkan layanan lokasi dan coba lagi di luar ruangan.';
}

function getCompassErrorMessage(error: unknown) {
  if (error instanceof Error && error.name === 'NotAllowedError') {
    return 'Izin sensor kompas ditolak. Izinkan akses Motion & Orientation di pengaturan browser.';
  }
  return 'Sensor kompas tidak tersedia. Gunakan browser di perangkat yang memiliki kompas, atau ikuti bearing GPS sebagai arah dari utara.';
}

export default function QiblaPage() {
  const [location, setLocation] = useState<LocationFix | null>(null);
  const [locationStatus, setLocationStatus] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [heading, setHeading] = useState<number | null>(null);
  const [isCompassActive, setIsCompassActive] = useState(false);
  const [compassMessage, setCompassMessage] = useState('');
  const headingRef = useRef<number | null>(null);

  const qiblaBearing = location ? getQiblaBearing(location.latitude, location.longitude) : null;
  const distanceToKaaba = location ? getDistanceToKaaba(location.latitude, location.longitude) : null;
  const relativeBearing = qiblaBearing !== null && heading !== null
    ? (qiblaBearing - heading + 360) % 360
    : qiblaBearing;

  const findLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocationStatus('Browser ini tidak mendukung GPS. Coba buka melalui browser di ponsel.');
      return;
    }

    if (!window.isSecureContext) {
      setLocationStatus('Browser memerlukan HTTPS untuk mengakses GPS. Gunakan HTTPS atau localhost.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('');
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
          accuracy: coords.accuracy,
        });
        setIsLocating(false);
        setLocationStatus('');
      },
      (error) => {
        setIsLocating(false);
        setLocationStatus(getLocationErrorMessage(error));
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20_000 },
    );
  };

  const startCompass = async () => {
    if (!('DeviceOrientationEvent' in window)) {
      setCompassMessage(getCompassErrorMessage(null));
      return;
    }

    try {
      const orientation = DeviceOrientationEvent as DeviceOrientationPermission;
      if (orientation.requestPermission) {
        const permission = await orientation.requestPermission();
        if (permission !== 'granted') {
          throw new DOMException('Izin sensor kompas ditolak.', 'NotAllowedError');
        }
      }

      headingRef.current = null;
      setHeading(null);
      setCompassMessage('Arahkan bagian atas ponsel ke depan dan jauhkan dari benda logam.');
      setIsCompassActive(true);
      window.setTimeout(() => {
        if (headingRef.current === null) {
          setCompassMessage('Kompas belum mengirim data. Coba gerakkan ponsel membentuk angka delapan, lalu aktifkan ulang sensor.');
        }
      }, 8000);
    } catch (error) {
      setIsCompassActive(false);
      setCompassMessage(getCompassErrorMessage(error));
    }
  };

  useEffect(() => {
    if (!isCompassActive) return undefined;

    const updateHeading = (event: Event) => {
      const orientation = event as CompassEvent;
      let nextHeading: number | null = null;

      if (typeof orientation.webkitCompassHeading === 'number') {
        nextHeading = orientation.webkitCompassHeading;
      } else if (orientation.absolute && typeof orientation.alpha === 'number') {
        const screenAngle = window.screen.orientation?.angle ?? 0;
        nextHeading = (360 - orientation.alpha + screenAngle + 360) % 360;
      }

      if (nextHeading !== null && Number.isFinite(nextHeading)) {
        const normalizedHeading = (nextHeading + 360) % 360;
        headingRef.current = normalizedHeading;
        setHeading(normalizedHeading);
      }
    };

    window.addEventListener('deviceorientation', updateHeading);
    window.addEventListener('deviceorientationabsolute', updateHeading);

    return () => {
      window.removeEventListener('deviceorientation', updateHeading);
      window.removeEventListener('deviceorientationabsolute', updateHeading);
    };
  }, [isCompassActive]);

  return (
    <div className="mx-auto max-w-4xl space-y-6 sm:space-y-8">
      <section className="relative overflow-hidden rounded-[1.75rem] bg-[#124e43] px-5 py-7 text-white shadow-xl shadow-emerald-950/10 sm:rounded-[2rem] sm:px-10 sm:py-10">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full border border-white/10" />
        <p className="relative text-sm font-semibold uppercase tracking-[0.2em] text-[#f1d99b]">Panduan arah ibadah</p>
        <h1 className="relative mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">Temukan arah kiblat.</h1>
        <p className="relative mt-4 max-w-2xl leading-7 text-emerald-50/80">
          Bearing dihitung dari koordinat GPS menuju Ka’bah. Aktifkan kompas untuk melihat arah kiblat relatif terhadap posisi ponsel.
        </p>
      </section>

      <section className="grid gap-6 rounded-[1.75rem] border border-[#e6e2d7] bg-white p-5 shadow-sm sm:grid-cols-[1fr_1.1fr] sm:items-center sm:p-8">
        <div className="flex flex-col items-center">
          <div
            role="img"
            aria-label={relativeBearing === null
              ? 'Kompas belum tersedia sebelum lokasi ditentukan'
              : `Arah kiblat berada pada bearing ${Math.round(qiblaBearing ?? 0)} derajat dari utara`}
            className="relative flex h-64 w-64 items-center justify-center rounded-full border border-[#e6e2d7] bg-[#fbfaf6] shadow-inner sm:h-72 sm:w-72"
          >
            <div className="absolute inset-3 rounded-full border border-[#dce8dd]" />
            <div className="absolute inset-7 rounded-full border border-dashed border-[#d5d8ca]" />
            <div
              className="absolute inset-0 transition-transform duration-300 ease-out"
              style={{ transform: `rotate(${heading === null ? 0 : -heading}deg)` }}
            >
              <span className="absolute left-1/2 top-5 -translate-x-1/2 text-sm font-bold text-[#9b5b4b]">U</span>
              <span className="absolute right-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#748179]">T</span>
              <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm font-semibold text-[#748179]">S</span>
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#748179]">B</span>
              {relativeBearing !== null && (
                <div
                  className="absolute left-1/2 top-1/2 h-[40%] w-0 -translate-x-1/2 -translate-y-full transition-transform duration-300 ease-out"
                  style={{ transform: `translate(-50%, -100%) rotate(${qiblaBearing ?? 0}deg)`, transformOrigin: '50% 100%' }}
                >
                  <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[#b6812e]">
                    <FiNavigation aria-hidden="true" className="fill-current text-3xl drop-shadow" />
                  </span>
                </div>
              )}
            </div>
            <span aria-hidden="true" className="z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-[#124e43] text-xl text-[#f1d99b] shadow-md">
              <FiCompass />
            </span>
          </div>
          <p className="mt-4 text-center text-sm text-[#748179]">
            {heading === null ? 'Tanda U menunjukkan utara' : `Arah ponsel: ${Math.round(heading)}° · ${getCardinalDirection(heading)}`}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#a77b2e]">Arah menuju Ka’bah</p>
          {qiblaBearing === null ? (
            <>
              <h2 className="mt-2 text-2xl font-semibold text-[#173d35]">Aktifkan lokasi GPS</h2>
              <p className="mt-2 leading-7 text-[#748179]">
                Kami perlu posisi perangkat untuk menghitung arah kiblat dari tempatmu, bukan memakai perkiraan kota.
              </p>
            </>
          ) : (
            <>
              <h2 className="mt-2 text-4xl font-bold tabular-nums text-[#173d35]">{Math.round(qiblaBearing)}°</h2>
              <p className="mt-1 text-lg font-semibold text-[#327b68]">{getCardinalDirection(qiblaBearing)} dari utara</p>
              <p className="mt-3 text-sm leading-6 text-[#748179]">
                Jarak garis lurus ke Ka’bah sekitar {Math.round(distanceToKaaba ?? 0).toLocaleString('id-ID')} km.
              </p>
              <p className="mt-1 text-xs text-[#748179]">
                Akurasi GPS: ±{Math.round(location?.accuracy ?? 0)} m · Koordinat {location?.latitude.toFixed(4)}, {location?.longitude.toFixed(4)}
              </p>
            </>
          )}

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={findLocation}
              disabled={isLocating}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#124e43] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0c4037] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#327b68] disabled:cursor-wait disabled:opacity-70"
            >
              {location ? <FiRefreshCw aria-hidden="true" /> : <FiMapPin aria-hidden="true" />}
              {isLocating ? 'Mencari GPS…' : location ? 'Perbarui lokasi' : 'Gunakan lokasi GPS'}
            </button>
            {location && (
              <button
                type="button"
                onClick={isCompassActive ? () => setIsCompassActive(false) : startCompass}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#d5d8ca] px-5 py-3 text-sm font-semibold text-[#124e43] transition hover:bg-[#edf3ec] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#327b68]"
              >
                <FiCompass aria-hidden="true" />
                {isCompassActive ? 'Matikan kompas' : 'Aktifkan kompas'}
              </button>
            )}
          </div>

          {locationStatus && (
            <p role="alert" className="mt-3 flex items-start gap-2 text-sm leading-6 text-[#9b5b4b]">
              <FiAlertCircle aria-hidden="true" className="mt-1 shrink-0" />
              {locationStatus}
            </p>
          )}
          {compassMessage && (
            <p role="status" className="mt-3 flex items-start gap-2 text-sm leading-6 text-[#748179]">
              <FiAlertCircle aria-hidden="true" className="mt-1 shrink-0" />
              {compassMessage}
            </p>
          )}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-[#e6e2d7] bg-white p-5 sm:p-7">
        <h2 className="text-lg font-semibold text-[#173d35]">Tips agar arah lebih akurat</h2>
        <ol className="mt-4 grid gap-4 text-sm leading-6 text-[#52675f] sm:grid-cols-2">
          <li className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#edf3ec] font-semibold text-[#327b68]">1</span>
            <span>Aktifkan lokasi presisi tinggi dan tunggu GPS stabil. Perhatikan nilai akurasi lokasi yang ditampilkan.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#edf3ec] font-semibold text-[#327b68]">2</span>
            <span>Jauhkan ponsel dari magnet, casing magnetik, kendaraan, dan benda logam; sensor kompas mudah terpengaruh.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#edf3ec] font-semibold text-[#327b68]">3</span>
            <span>Gerakkan ponsel membentuk angka delapan untuk kalibrasi, lalu pegang mendatar dan arahkan sisi atas ponsel ke depan.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#edf3ec] font-semibold text-[#327b68]">4</span>
            <span>Untuk kepastian saat shalat, cocokkan dengan arah mihrab masjid setempat. Kompas ponsel tetap dapat memiliki deviasi magnetik.</span>
          </li>
        </ol>
        <p className="mt-5 border-t border-[#e6e2d7] pt-4 text-xs leading-5 text-[#748179]">
          Bearing dihitung secara geodesik dari koordinat perangkat ke Ka’bah (21.4225° LU, 39.8262° BT). Akurasi akhir bergantung pada GPS dan kalibrasi sensor kompas; aplikasi browser tidak dapat menjamin ketelitian survei.
        </p>
      </section>
    </div>
  );
}
