import { useState } from 'react';
import { useScroll, useMotionValueEvent, AnimatePresence, motion } from 'motion/react';
import { List, X, ChartBar, Waveform } from '@phosphor-icons/react';
import { Logo } from './Logo';

const NAV = [
  { label: 'Worlds', id: 'worlds' },
  { label: 'The Ritual', id: 'ritual' },
  { label: 'Pro', id: 'pricing' },
  { label: 'Gear', id: 'gear' },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

interface Props {
  onStart: () => void;
  onOpenMixer: () => void;
  onOpenStats: () => void;
}

export function Nav({ onStart, onOpenMixer, onOpenStats }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => {
    const s = y > 24;
    if (s !== scrolled) setScrolled(s);
  });

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'border-b border-white/10 bg-ink/80 backdrop-blur-xl' : 'border-b border-transparent'}`}>
      <nav className="container-site flex h-[68px] items-center justify-between">
        <button onClick={() => scrollTo('top')} aria-label="Stillpoint home" className="transition-opacity hover:opacity-80">
          <Logo />
        </button>

        <div className="hidden items-center gap-7 lg:flex">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => scrollTo(n.id)} className="text-sm text-mist-muted transition-colors hover:text-mist">{n.label}</button>
          ))}
          <button onClick={onOpenMixer} className="flex items-center gap-1.5 text-sm text-mist-muted transition-colors hover:text-mist">
            <Waveform size={16} /> Mixer
          </button>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button onClick={onOpenStats} aria-label="Your stats" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-mist-muted transition-colors hover:border-white/30 hover:text-mist">
            <ChartBar size={18} />
          </button>
          <button onClick={onStart} className="btn-primary text-sm">Start focusing</button>
        </div>

        <button className="text-mist lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X size={24} /> : <List size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-white/10 bg-ink/95 backdrop-blur-xl lg:hidden">
            <div className="container-site flex flex-col gap-1 py-4">
              {NAV.map((n) => (
                <button key={n.id} onClick={() => { scrollTo(n.id); setOpen(false); }} className="rounded-lg px-2 py-3 text-left text-base text-mist-muted transition-colors hover:bg-white/5 hover:text-mist">{n.label}</button>
              ))}
              <button onClick={() => { onOpenMixer(); setOpen(false); }} className="flex items-center gap-2 rounded-lg px-2 py-3 text-left text-base text-mist-muted transition-colors hover:bg-white/5 hover:text-mist"><Waveform size={18} /> Sound Mixer</button>
              <button onClick={() => { onOpenStats(); setOpen(false); }} className="flex items-center gap-2 rounded-lg px-2 py-3 text-left text-base text-mist-muted transition-colors hover:bg-white/5 hover:text-mist"><ChartBar size={18} /> Your stats</button>
              <button onClick={() => { onStart(); setOpen(false); }} className="btn-primary mt-2 w-full">Start focusing</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
