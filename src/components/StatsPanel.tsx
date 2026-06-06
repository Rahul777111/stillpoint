import { motion } from 'motion/react';
import { X, Flame, Timer, Stack, Clock } from '@phosphor-icons/react';
import type { Stats } from '../lib/useStats';

const WEEKS = 14;

function buildGrid(history: Record<string, number>) {
  const days: { key: string; minutes: number }[] = [];
  const today = new Date();
  // start on the Sunday WEEKS*7 days back, aligned to weeks
  const start = new Date(today);
  start.setDate(start.getDate() - (WEEKS * 7 - 1));
  start.setDate(start.getDate() - start.getDay());
  const cursor = new Date(start);
  while (cursor <= today) {
    const key = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, '0')}-${String(cursor.getDate()).padStart(2, '0')}`;
    days.push({ key, minutes: history[key] ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function level(min: number) {
  if (min <= 0) return 'bg-white/[0.04]';
  if (min < 20) return 'bg-ember/25';
  if (min < 45) return 'bg-ember/45';
  if (min < 90) return 'bg-ember/70';
  return 'bg-ember';
}

export function StatsPanel({ stats, onClose }: { stats: Stats; onClose: () => void }) {
  const grid = buildGrid(stats.history);
  const hours = Math.round((stats.minutes / 60) * 10) / 10;
  const cards = [
    { icon: Flame, label: 'Current streak', value: `${stats.currentStreak}d` },
    { icon: Timer, label: 'Longest streak', value: `${stats.longestStreak}d` },
    { icon: Stack, label: 'Sessions', value: String(stats.sessions) },
    { icon: Clock, label: 'Hours focused', value: String(hours) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[105] flex items-center justify-center p-5"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 14 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="glass relative w-full max-w-lg rounded-3xl p-7 sm:p-9"
      >
        <button onClick={onClose} aria-label="Close" className="absolute right-5 top-5 text-mist/80 hover:text-mist">
          <X size={22} />
        </button>
        <h3 className="font-display text-2xl font-semibold text-mist">Your focus</h3>
        <p className="mt-1 text-mist-muted">Stored on this device. Yours alone.</p>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="rounded-2xl border border-white/10 p-4">
              <c.icon size={20} className="text-ember" />
              <p className="mt-3 font-display text-2xl font-semibold text-mist">{c.value}</p>
              <p className="text-xs text-mist-dim">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <p className="mb-3 text-sm text-mist-muted">Last {WEEKS} weeks</p>
          <div className="grid grid-flow-col gap-[3px]" style={{ gridTemplateRows: 'repeat(7, 1fr)' }}>
            {grid.map((d) => (
              <div key={d.key} title={`${d.key}: ${d.minutes}m`} className={`h-3 w-3 rounded-[3px] ${level(d.minutes)}`} />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
