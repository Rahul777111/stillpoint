import { useCallback, useEffect, useState } from 'react';
import { loadJSON, saveJSON } from './storage';

const KEY = 'stillpoint.stats.v1';

export interface Stats {
  sessions: number;
  minutes: number;
  currentStreak: number;
  longestStreak: number;
  lastDay: string | null;
  pro: boolean;
}

const DEFAULT: Stats = {
  sessions: 0,
  minutes: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastDay: null,
  pro: false,
};

const dayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const daysBetween = (a: string, b: string) => {
  const da = new Date(a + 'T00:00:00');
  const db = new Date(b + 'T00:00:00');
  return Math.round((db.getTime() - da.getTime()) / 86_400_000);
};

export function useStats() {
  const [stats, setStats] = useState<Stats>(() => loadJSON(KEY, DEFAULT));

  useEffect(() => {
    saveJSON(KEY, stats);
  }, [stats]);

  const recordSession = useCallback((minutes: number) => {
    setStats((prev) => {
      const today = dayKey();
      let { currentStreak, longestStreak } = prev;
      if (prev.lastDay === null) {
        currentStreak = 1;
      } else if (prev.lastDay === today) {
        // already practised today — streak unchanged
      } else if (daysBetween(prev.lastDay, today) === 1) {
        currentStreak = prev.currentStreak + 1;
      } else {
        currentStreak = 1;
      }
      longestStreak = Math.max(longestStreak, currentStreak);
      return {
        ...prev,
        sessions: prev.sessions + 1,
        minutes: prev.minutes + minutes,
        currentStreak,
        longestStreak,
        lastDay: today,
      };
    });
  }, []);

  const unlockPro = useCallback(() => setStats((p) => ({ ...p, pro: true })), []);

  return { stats, recordSession, unlockPro };
}
