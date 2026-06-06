import { Check, ArrowUpRight } from '@phosphor-icons/react';
import { LINKS, PRICING } from '../data/config';
import { Reveal } from './Reveal';

const FREE = ['Three free worlds', 'Every timer length', 'Streaks and session history', 'Shareable focus cards'];
const PRO = [
  'All six worlds, plus every new one',
  'Generative soundscapes, unlimited',
  '4K wallpaper downloads of every scene',
  'Lifetime access, one payment',
];

export function Pricing({ pro, onStart, onRestore }: { pro: boolean; onStart: () => void; onRestore: () => void }) {
  return (
    <section id="pricing" className="relative border-t border-white/5 py-28 sm:py-36">
      <div className="container-site">
        <Reveal className="max-w-2xl">
          <span className="eyebrow"><span className="h-px w-6 bg-ember/60" />Pricing</span>
          <h2 className="mt-5 text-4xl font-semibold leading-tight text-mist md:text-5xl">
            Free to start. Yours for life.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-mist-muted">
            No subscription, no account, no upsell creep. Pay once if you want the full collection,
            or focus for free forever.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 lg:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-3xl border border-white/10 p-8 sm:p-10">
              <p className="font-display text-xl font-semibold text-mist">Free</p>
              <p className="mt-2 text-mist-muted">Everything you need to build the habit.</p>
              <p className="mt-6 font-display text-5xl font-semibold text-mist">$0</p>
              <ul className="mt-8 flex-1 space-y-3">
                {FREE.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-mist-muted">
                    <Check size={20} className="mt-0.5 shrink-0 text-mist-dim" /> {f}
                  </li>
                ))}
              </ul>
              <button onClick={onStart} className="btn-ghost mt-8 w-full">Start focusing</button>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-ember/40 bg-gradient-to-br from-ember/[0.07] to-transparent p-8 sm:p-10">
              <span className="absolute right-6 top-6 rounded-full bg-ember/15 px-3 py-1 text-xs font-medium text-ember">
                Most loved
              </span>
              <p className="font-display text-xl font-semibold text-mist">Stillpoint Pro</p>
              <p className="mt-2 text-mist-muted">The whole collection, forever.</p>
              <p className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-5xl font-semibold text-mist">{PRICING.proPrice}</span>
                <span className="text-mist-muted">{PRICING.proCadence}</span>
              </p>
              <ul className="mt-8 flex-1 space-y-3">
                {PRO.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-mist">
                    <Check size={20} weight="bold" className="mt-0.5 shrink-0 text-ember" /> {f}
                  </li>
                ))}
              </ul>
              {pro ? (
                <div className="btn-ghost mt-8 w-full cursor-default border-ember/40 text-ember">
                  <Check size={18} weight="bold" /> Pro unlocked
                </div>
              ) : (
                <>
                  <a href={LINKS.pro} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8 w-full">
                    Get Pro <ArrowUpRight size={18} />
                  </a>
                  <button onClick={onRestore} className="mt-3 text-sm text-mist-dim transition-colors hover:text-mist-muted">
                    Already bought it? Restore access
                  </button>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
