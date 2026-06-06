import { motion } from 'motion/react';
import { X, ArrowUpRight, Check } from '@phosphor-icons/react';
import type { World } from '../data/worlds';
import { LINKS, PRICING } from '../data/config';

interface Props {
  world: World | null;
  onRestore: () => void;
  onClose: () => void;
}

export function UpgradeModal({ world, onRestore, onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-5"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="glass relative w-full max-w-md overflow-hidden rounded-3xl"
      >
        {world && (
          <div className="relative h-40">
            <img src={world.image} alt={world.name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
            <p className="absolute bottom-4 left-6 font-display text-xl font-semibold text-mist">{world.name}</p>
          </div>
        )}
        <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 text-mist/80 hover:text-mist">
          <X size={22} />
        </button>

        <div className="p-7">
          <h3 className="font-display text-2xl font-semibold text-mist">Unlock the full collection.</h3>
          <p className="mt-2 text-mist-muted">
            This world is part of Stillpoint Pro. One payment of {PRICING.proPrice}, every world and
            soundscape, forever.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-mist-muted">
            <li className="flex gap-2"><Check size={18} className="text-ember" /> All six worlds, plus every future one</li>
            <li className="flex gap-2"><Check size={18} className="text-ember" /> 4K wallpaper downloads</li>
            <li className="flex gap-2"><Check size={18} className="text-ember" /> Lifetime access, no subscription</li>
          </ul>
          <a href={LINKS.pro} target="_blank" rel="noopener noreferrer" className="btn-primary mt-6 w-full">
            Get Pro for {PRICING.proPrice} <ArrowUpRight size={18} />
          </a>
          <button onClick={() => { onRestore(); onClose(); }} className="mt-3 w-full text-sm text-mist-dim transition-colors hover:text-mist-muted">
            Already bought it? Restore access
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
