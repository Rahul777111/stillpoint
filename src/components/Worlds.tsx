import { LockSimple, ArrowRight } from '@phosphor-icons/react';
import { WORLDS, type World } from '../data/worlds';
import { Reveal } from './Reveal';

export function Worlds({ pro, onEnter }: { pro: boolean; onEnter: (w: World) => void }) {
  return (
    <section id="worlds" className="relative py-28 sm:py-36">
      <div className="container-site">
        <Reveal className="max-w-2xl">
          <h2 className="text-4xl font-semibold leading-tight text-mist md:text-5xl">
            Choose where you disappear.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-mist-muted">
            Each world is a hand-tuned scene with its own generative soundscape, built in your
            browser in real time. Pick one and the rest of the world goes quiet.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WORLDS.map((w, i) => {
            const locked = w.premium && !pro;
            return (
              <Reveal key={w.id} delay={(i % 3) * 0.08}>
                <button
                  onClick={() => onEnter(w)}
                  className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 text-left transition-colors hover:border-white/25"
                >
                  <img
                    src={w.image}
                    alt={w.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.07]"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

                  <span className="absolute right-3 top-3 flex items-center gap-1.5">
                    {w.premium ? (
                      <span className="flex items-center gap-1 rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-medium text-ember backdrop-blur">
                        {locked && <LockSimple size={12} weight="fill" />} Pro
                      </span>
                    ) : (
                      <span className="rounded-full bg-ink/70 px-2.5 py-1 text-[11px] font-medium text-mist-muted backdrop-blur">
                        Free
                      </span>
                    )}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-mist-dim" style={{ color: w.accent }}>
                      {w.location}
                    </p>
                    <h3 className="mt-1 font-display text-2xl font-semibold text-mist">{w.name}</h3>
                    <p className="mt-1 text-sm text-mist-muted">{w.tagline}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-mist opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {locked ? 'Unlock with Pro' : 'Enter world'} <ArrowRight size={15} />
                    </span>
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
