import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  X, Play, Pause, SpeakerHigh, SpeakerSlash, LockSimple, ArrowsClockwise, Infinity as InfinityIcon,
} from '@phosphor-icons/react';
import type { World } from '../data/worlds';
import { TIMER_PRESETS } from '../data/config';
import { engine } from '../lib/audio';
import type { Stats } from '../lib/useStats';
import { loadPrefs, savePrefs } from '../lib/prefs';
import { ShareCard } from './ShareCard';

type Phase = 'setup' | 'running' | 'paused' | 'done';

interface Props {
  world: World;
  worlds: World[];
  pro: boolean;
  stats: Stats;
  onSelectWorld: (w: World) => void;
  onComplete: (minutes: number) => void;
  onUpgrade: () => void;
  onClose: () => void;
}

const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

export function FocusOverlay({
  world, worlds, pro, stats, onSelectWorld, onComplete, onUpgrade, onClose,
}: Props) {
  const reduce = useReducedMotion();
  const initialPrefs = useRef(loadPrefs()).current;
  const [phase, setPhase] = useState<Phase>('setup');
  const [minutes, setMinutes] = useState(initialPrefs.minutes); // 0 = open-ended ambient
  const [remaining, setRemaining] = useState(initialPrefs.minutes * 60);
  const [elapsed, setElapsed] = useState(0);
  const [volume, setVolume] = useState(initialPrefs.volume);
  const [voiceOn, setVoiceOn] = useState(initialPrefs.voiceOn);
  const [finishedMinutes, setFinishedMinutes] = useState(0);

  const endRef = useRef(0);
  const startRef = useRef(0);
  const tickRef = useRef<number | null>(null);
  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const open = minutes === 0;

  const playVoice = useCallback((src: string) => {
    if (!voiceOn) return;
    try {
      voiceRef.current?.pause();
      const a = new Audio(src);
      a.volume = 0.92;
      voiceRef.current = a;
      a.play().catch(() => {});
    } catch { /* ignore */ }
  }, [voiceOn]);

  const clearTick = () => { if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; } };

  const finish = useCallback((elapsedSecs?: number) => {
    clearTick();
    engine.stop(2);
    const done = open ? Math.max(1, Math.round((elapsedSecs ?? elapsed) / 60)) : minutes;
    setFinishedMinutes(done);
    onComplete(done);
    playVoice('/audio/voice_complete.mp3');
    setPhase('done');
  }, [minutes, open, elapsed, onComplete, playVoice]);

  const runTimer = useCallback(() => {
    clearTick();
    tickRef.current = window.setInterval(() => {
      if (open) {
        setElapsed(Math.round((Date.now() - startRef.current) / 1000));
      } else {
        const left = Math.max(0, Math.round((endRef.current - Date.now()) / 1000));
        setRemaining(left);
        if (left <= 0) finish();
      }
    }, 250);
  }, [open, finish]);

  const begin = useCallback(async () => {
    if (open) { startRef.current = Date.now(); setElapsed(0); }
    else { setRemaining(minutes * 60); endRef.current = Date.now() + minutes * 60 * 1000; }
    await engine.start(world.layers, volume);
    playVoice('/audio/voice_begin.mp3');
    setPhase('running');
    runTimer();
  }, [minutes, open, volume, world.layers, playVoice, runTimer]);

  const pause = useCallback(() => { clearTick(); engine.setVolume(0.0001); setPhase('paused'); }, []);

  const resume = useCallback(() => {
    if (open) startRef.current = Date.now() - elapsed * 1000;
    else endRef.current = Date.now() + remaining * 1000;
    engine.setVolume(volume);
    setPhase('running');
    runTimer();
  }, [open, elapsed, remaining, volume, runTimer]);

  const switchWorld = useCallback((w: World) => {
    if (w.premium && !pro) { onUpgrade(); return; }
    onSelectWorld(w);
    if (phase === 'running') engine.start(w.layers, volume);
  }, [phase, pro, volume, onSelectWorld, onUpgrade]);

  useEffect(() => { if (phase === 'running') engine.setVolume(volume); }, [volume, phase]);

  useEffect(() => {
    savePrefs({ ...loadPrefs(), minutes, volume, voiceOn });
  }, [minutes, volume, voiceOn]);

  // keyboard: esc closes, space controls transport
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        if (phase === 'setup') begin();
        else if (phase === 'running') pause();
        else if (phase === 'paused') resume();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, begin, pause, resume, onClose]);

  useEffect(() => () => { clearTick(); engine.stop(0.4); voiceRef.current?.pause(); }, []);

  const total = minutes * 60;
  const progress = phase === 'setup' || open ? 0 : 1 - remaining / total;
  const R = 130;
  const C = 2 * Math.PI * R;
  const running = phase === 'running';
  const display = open ? fmt(elapsed) : fmt(remaining);

  const setPreset = (m: number) => { setMinutes(m); setRemaining(m * 60); setElapsed(0); };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] overflow-hidden bg-ink"
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={world.id} src={world.image} alt={world.name}
          initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: reduce ? 1.05 : 1.12 }} exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.1 }, scale: { duration: 30, ease: 'easeInOut' } }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-ink/55" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/60" />

      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-5 sm:p-7">
        <div>
          <p className="font-display text-lg font-semibold text-mist">{world.name}</p>
          <p className="text-sm text-mist-muted">{world.location}</p>
        </div>
        <button onClick={onClose} aria-label="Close session" className="glass flex h-11 w-11 items-center justify-center rounded-full text-mist transition-transform hover:scale-105">
          <X size={20} />
        </button>
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-5">
        <AnimatePresence mode="wait">
          {phase === 'done' ? (
            <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
              <p className="eyebrow justify-center">Session complete</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-mist">{finishedMinutes} minutes of deep work.</h2>
              <p className="mt-2 text-mist-muted">
                {stats.currentStreak}-day streak. {stats.sessions} sessions, {Math.round(stats.minutes / 60 * 10) / 10} hours total.
              </p>
              <div className="mt-6"><ShareCard minutes={finishedMinutes} world={world} stats={stats} /></div>
              <div className="mt-6 flex justify-center gap-3">
                <button onClick={() => { setPhase('setup'); setRemaining(minutes * 60); setElapsed(0); }} className="btn-ghost">
                  <ArrowsClockwise size={18} /> Again
                </button>
                <button onClick={onClose} className="btn-primary">Done</button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="timer" className="flex flex-col items-center">
              <div className="relative">
                {!reduce && running && <span className="absolute inset-0 -z-10 animate-breathe rounded-full bg-ember/20 blur-2xl" />}
                <svg width="300" height="300" viewBox="0 0 300 300" className="-rotate-90">
                  <circle cx="150" cy="150" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                  {!open && (
                    <circle cx="150" cy="150" r={R} fill="none" stroke="#E7B563" strokeWidth="4" strokeLinecap="round"
                      strokeDasharray={C} strokeDashoffset={C * (1 - progress)}
                      style={{ transition: 'stroke-dashoffset 0.5s linear', filter: 'drop-shadow(0 0 10px rgba(231,181,99,0.5))' }} />
                  )}
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-6xl font-semibold tabular-nums text-mist">{display}</span>
                  <span className="mt-1 text-sm text-mist-muted">
                    {phase === 'setup' ? 'ready when you are' : running ? (open ? 'ambient' : 'in flow') : 'paused'}
                  </span>
                </div>
              </div>

              {phase === 'setup' && (
                <div className="mt-9 flex flex-wrap justify-center gap-2">
                  {TIMER_PRESETS.map((p) => (
                    <button key={p.minutes} onClick={() => setPreset(p.minutes)}
                      className={`rounded-full border px-5 py-2.5 text-sm transition-all ${minutes === p.minutes ? 'border-ember bg-ember/15 text-ember' : 'border-white/15 text-mist-muted hover:border-white/30 hover:text-mist'}`}>
                      {p.label} <span className="opacity-60">{p.minutes}m</span>
                    </button>
                  ))}
                  <button onClick={() => setPreset(0)}
                    className={`flex items-center gap-1.5 rounded-full border px-5 py-2.5 text-sm transition-all ${open ? 'border-ember bg-ember/15 text-ember' : 'border-white/15 text-mist-muted hover:border-white/30 hover:text-mist'}`}>
                    <InfinityIcon size={16} /> Open
                  </button>
                </div>
              )}

              <div className="mt-8 flex items-center gap-4">
                {phase === 'setup' && (
                  <button onClick={begin} className="btn-primary px-9 py-4 text-base"><Play size={20} weight="fill" /> Begin</button>
                )}
                {running && (
                  <button onClick={pause} className="glass flex h-14 w-14 items-center justify-center rounded-full text-mist transition-transform hover:scale-105"><Pause size={24} weight="fill" /></button>
                )}
                {phase === 'paused' && (
                  <>
                    <button onClick={resume} className="btn-primary px-9 py-4 text-base"><Play size={20} weight="fill" /> Resume</button>
                    <button onClick={() => finish()} className="btn-ghost">End</button>
                  </>
                )}
                {running && open && (
                  <button onClick={() => finish()} className="btn-ghost">End</button>
                )}
              </div>

              <div className="mt-8 flex items-center gap-5">
                <button onClick={() => setVoiceOn((v) => !v)} className="flex items-center gap-2 text-sm text-mist-muted transition-colors hover:text-mist" aria-label="Toggle voice">
                  {voiceOn ? <SpeakerHigh size={18} /> : <SpeakerSlash size={18} />} voice
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-wider text-mist-dim">sound</span>
                  <input type="range" min={0} max={1} step={0.01} value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="h-1 w-32 cursor-pointer appearance-none rounded-full bg-white/15 accent-ember" aria-label="Volume" />
                </div>
              </div>
              {phase === 'setup' && <p className="mt-6 text-xs text-mist-dim">Tip: press space to start and pause.</p>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {phase !== 'done' && (
        <div className="absolute inset-x-0 bottom-0 z-10 p-4 sm:p-6">
          <div className="container-site flex gap-3 overflow-x-auto pb-1">
            {worlds.map((w) => {
              const locked = w.premium && !pro;
              const activeW = w.id === world.id;
              return (
                <button key={w.id} onClick={() => switchWorld(w)}
                  className={`group relative h-16 w-28 shrink-0 overflow-hidden rounded-xl border transition-all ${activeW ? 'border-ember' : 'border-white/10 hover:border-white/30'}`}>
                  <img src={w.image} alt={w.name} className="h-full w-full object-cover opacity-70 transition-opacity group-hover:opacity-100" />
                  <span className="absolute inset-0 bg-ink/40" />
                  <span className="absolute bottom-1 left-2 text-[11px] font-medium text-mist">{w.name.split(' ')[0]}</span>
                  {locked && <span className="absolute right-1.5 top-1.5 text-ember"><LockSimple size={14} weight="fill" /></span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
