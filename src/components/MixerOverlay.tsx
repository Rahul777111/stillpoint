import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { X } from '@phosphor-icons/react';
import { MIX_ELEMENTS } from '../data/mix';
import { mixer } from '../lib/audio';

interface ChannelState { on: boolean; level: number }

const PRESETS: { name: string; ids: string[] }[] = [
  { name: 'Rainy night', ids: ['rain', 'hum'] },
  { name: 'Forest morning', ids: ['birds', 'stream', 'wind'] },
  { name: 'By the hearth', ids: ['fire', 'rain'] },
  { name: 'Open shore', ids: ['ocean', 'wind'] },
];

export function MixerOverlay({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<Record<string, ChannelState>>(() =>
    Object.fromEntries(MIX_ELEMENTS.map((e) => [e.id, { on: false, level: e.defaultLevel }]))
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); mixer.stopAll(); };
  }, [onClose]);

  const toggle = (id: string) => {
    setState((prev) => {
      const cur = prev[id];
      const el = MIX_ELEMENTS.find((e) => e.id === id)!;
      if (cur.on) mixer.disable(id);
      else mixer.enable(id, el.layers, cur.level);
      return { ...prev, [id]: { ...cur, on: !cur.on } };
    });
  };

  const setLevel = (id: string, level: number) => {
    setState((prev) => {
      if (prev[id].on) mixer.setLevel(id, level);
      return { ...prev, [id]: { ...prev[id], level } };
    });
  };

  const applyPreset = (ids: string[]) => {
    setState((prev) => {
      const next = { ...prev };
      MIX_ELEMENTS.forEach((el) => {
        const want = ids.includes(el.id);
        const cur = next[el.id];
        if (want && !cur.on) mixer.enable(el.id, el.layers, cur.level);
        if (!want && cur.on) mixer.disable(el.id);
        next[el.id] = { ...cur, on: want };
      });
      return next;
    });
  };

  const activeCount = Object.values(state).filter((s) => s.on).length;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{ backgroundColor: '#0A0C10' }}
      className="fixed inset-0 z-[100] overflow-y-auto"
    >
      <div className="pointer-events-none absolute inset-0 z-0 radial-vignette" />
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-5 sm:p-7">
        <div>
          <p className="font-display text-lg font-semibold text-mist">Sound Mixer</p>
          <p className="text-sm text-mist-muted">
            {activeCount ? `${activeCount} layer${activeCount > 1 ? 's' : ''} playing` : 'Blend your own atmosphere'}
          </p>
        </div>
        <button onClick={onClose} aria-label="Close mixer" className="glass flex h-11 w-11 items-center justify-center rounded-full text-mist transition-transform hover:scale-105">
          <X size={20} />
        </button>
      </div>

      <div className="container-site relative z-10 flex min-h-[100dvh] flex-col justify-center py-28">
        {/* presets */}
        <div className="mb-10 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p.ids)}
              className="rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-mist-muted transition-all hover:border-white/30 hover:text-mist"
            >
              {p.name}
            </button>
          ))}
          {activeCount > 0 && (
            <button onClick={() => applyPreset([])} className="rounded-full px-4 py-2 text-sm text-mist-dim transition-colors hover:text-mist-muted">
              Clear
            </button>
          )}
        </div>

        {/* element board */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {MIX_ELEMENTS.map((el) => {
            const s = state[el.id];
            const Icon = el.icon;
            return (
              <div
                key={el.id}
                className={`rounded-2xl border p-5 transition-all ${
                  s.on ? 'border-ember/50 bg-ember/[0.06]' : 'border-white/10 bg-white/[0.02]'
                }`}
              >
                <button onClick={() => toggle(el.id)} className="flex w-full items-center gap-3 text-left">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${s.on ? 'bg-ember/20 text-ember' : 'bg-white/5 text-mist-muted'}`}>
                    <Icon size={22} weight={s.on ? 'fill' : 'regular'} />
                  </span>
                  <span>
                    <span className={`block font-display font-semibold ${s.on ? 'text-mist' : 'text-mist-muted'}`}>{el.name}</span>
                    <span className="text-xs text-mist-dim">{s.on ? 'on' : 'tap to add'}</span>
                  </span>
                </button>
                <input
                  type="range" min={0} max={1} step={0.01} value={s.level}
                  onChange={(e) => setLevel(el.id, parseFloat(e.target.value))}
                  disabled={!s.on}
                  aria-label={`${el.name} level`}
                  className={`mt-4 h-1 w-full cursor-pointer appearance-none rounded-full accent-ember ${s.on ? 'bg-white/15' : 'bg-white/5 opacity-40'}`}
                />
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-mist-dim">
          Every layer is generated live in your browser. Mix freely, it never repeats.
        </p>
      </div>
    </motion.div>
  );
}
