import { useState } from 'react';
import { useScroll, useMotionValueEvent, AnimatePresence, motion } from 'motion/react';
import { List, X } from '@phosphor-icons/react';
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

export function Nav({ onStart }: { onStart: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => {
    const s = y > 24;
    if (s !== scrolled) setScrolled(s);
  });

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'border-b border-white/10 bg-ink/80 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <nav className="container-site flex h-[68px] items-center justify-between">
        <button onClick={() => scrollTo('top')} aria-label="Stillpoint home" className="transition-opacity hover:opacity-80">
          <Logo />
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => scrollTo(n.id)}
              className="text-sm text-mist-muted transition-colors hover:text-mist"
            >
              {n.label}
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <button onClick={onStart} className="btn-primary text-sm">
            Start focusing
          </button>
        </div>

        <button
          className="text-mist md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <List size={24} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-white/10 bg-ink/95 backdrop-blur-xl md:hidden"
          >
            <div className="container-site flex flex-col gap-1 py-4">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => { scrollTo(n.id); setOpen(false); }}
                  className="rounded-lg px-2 py-3 text-left text-base text-mist-muted transition-colors hover:bg-white/5 hover:text-mist"
                >
                  {n.label}
                </button>
              ))}
              <button onClick={() => { onStart(); setOpen(false); }} className="btn-primary mt-2 w-full">
                Start focusing
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
