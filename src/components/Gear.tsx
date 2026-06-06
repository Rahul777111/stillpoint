import { ArrowUpRight } from '@phosphor-icons/react';
import { GEAR } from '../data/config';
import { Reveal } from './Reveal';

export function Gear() {
  return (
    <section id="gear" className="relative border-t border-white/5 py-28 sm:py-36">
      <div className="container-site">
        <Reveal className="max-w-2xl">
          <h2 className="text-4xl font-semibold leading-tight text-mist md:text-5xl">
            The desk we focus from.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-mist-muted">
            A short, honest list of the gear that pairs well with a Stillpoint session. We earn a
            small commission if you buy through these links, at no cost to you.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GEAR.map((g, i) => (
            <Reveal key={g.name} delay={(i % 4) * 0.06}>
              <a
                href={g.href}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="group flex h-full flex-col justify-between rounded-2xl border border-white/10 p-6 transition-all hover:-translate-y-1 hover:border-white/25"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.16em] text-ember">{g.category}</span>
                    <span className="text-sm text-mist-dim">{g.price}</span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-mist">{g.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist-muted">{g.blurb}</p>
                </div>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-mist-muted transition-colors group-hover:text-mist">
                  View <ArrowUpRight size={15} />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
