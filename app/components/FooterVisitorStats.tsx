'use client';

import { useEffect, useState } from 'react';
import { FiActivity, FiUsers } from 'react-icons/fi';

const DEFAULT_TOTAL_VISITORS = 12840;
const ONLINE_TTL_MS = 45_000;
const VISITOR_TOTAL_KEY = 'quran-web-total-visitors';
const ONLINE_KEY = 'quran-web-online-visitors';
const HAS_VISITED_KEY = 'quran-web-has-visited';

function formatNumber(value: number) {
  return new Intl.NumberFormat('id-ID').format(value);
}

function getOnlineEntries() {
  if (typeof window === 'undefined') {
    return [] as Array<{ id: string; ts: number }>;
  }

  try {
    const raw = window.localStorage.getItem(ONLINE_KEY);
    if (!raw) {
      return [] as Array<{ id: string; ts: number }>;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [] as Array<{ id: string; ts: number }>;
    }

    return parsed.filter(
      (entry) =>
        entry &&
        typeof entry.id === 'string' &&
        typeof entry.ts === 'number'
    ) as Array<{ id: string; ts: number }>;
  } catch {
    return [] as Array<{ id: string; ts: number }>;
  }
}

export default function FooterVisitorStats() {
  const [totalVisitors, setTotalVisitors] = useState<number>(DEFAULT_TOTAL_VISITORS);
  const [onlineVisitors, setOnlineVisitors] = useState<number>(1);

  useEffect(() => {
    const tabId = window.sessionStorage.getItem('quran-web-tab-id') ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    window.sessionStorage.setItem('quran-web-tab-id', tabId);

    const syncTotalVisitors = () => {
      try {
        const value = Number(window.localStorage.getItem(VISITOR_TOTAL_KEY) ?? DEFAULT_TOTAL_VISITORS.toString());
        const baseValue = Number.isFinite(value) ? value : DEFAULT_TOTAL_VISITORS;

        if (!window.localStorage.getItem(HAS_VISITED_KEY)) {
          const nextValue = baseValue + 1;
          window.localStorage.setItem(VISITOR_TOTAL_KEY, String(nextValue));
          window.localStorage.setItem(HAS_VISITED_KEY, 'true');
          setTotalVisitors(nextValue);
          return;
        }

        setTotalVisitors(baseValue);
      } catch {
        setTotalVisitors(DEFAULT_TOTAL_VISITORS);
      }
    };

    const syncOnlineVisitors = () => {
      try {
        const now = Date.now();
        const currentEntries = getOnlineEntries().filter((entry) => now - entry.ts < ONLINE_TTL_MS);
        const entryIndex = currentEntries.findIndex((entry) => entry.id === tabId);

        if (entryIndex >= 0) {
          currentEntries[entryIndex] = { id: tabId, ts: now };
        } else {
          currentEntries.push({ id: tabId, ts: now });
        }

        window.localStorage.setItem(ONLINE_KEY, JSON.stringify(currentEntries));
        setOnlineVisitors(currentEntries.length);
      } catch {
        setOnlineVisitors(1);
      }
    };

    if (!window.localStorage.getItem(VISITOR_TOTAL_KEY)) {
      window.localStorage.setItem(VISITOR_TOTAL_KEY, String(DEFAULT_TOTAL_VISITORS));
    }

    syncTotalVisitors();
    syncOnlineVisitors();

    const heartbeat = window.setInterval(syncOnlineVisitors, 15_000);
    return () => window.clearInterval(heartbeat);
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-medium text-[#52675f] sm:justify-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#e2ddd1] bg-white/70 px-3 py-1.5 shadow-sm">
        <FiUsers aria-hidden="true" className="text-[#124e43]" />
        <span>Pengunjung</span>
        <strong className="font-semibold text-[#173d35]">{formatNumber(totalVisitors)}</strong>
      </div>

      <div className="inline-flex items-center gap-2 rounded-full border border-[#dfeee9] bg-[#edf8f4] px-3 py-1.5 shadow-sm">
        <FiActivity aria-hidden="true" className="text-[#327b68]" />
        <span>Online</span>
        <strong className="font-semibold text-[#173d35]">{formatNumber(onlineVisitors)}</strong>
      </div>
    </div>
  );
}
