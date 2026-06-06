import { Compass, Timer, Waveform } from '@phosphor-icons/react';
import { motion, useReducedMotion } from 'motion/react';
import { Reveal } from './Reveal';

const STEPS = [
  { icon: Compass, title: 'Choose a world', body: 'Rainforest, deep ocean, a cabin in the rain. Pick the place that fits the work.' },
  { icon: Timer, title: 'Set the timer', body: 'Fifteen minutes or ninety. A guided voice settles you in as the session begins.' },
  { icon: Waveform, title: 'Let it carry you', body: 'Generative sound rises around you and holds steady until your time is done.' },
];

function EqBars() {
  const reduce = useReducedMotion();
  const bars = [0.4, 0.8, 0.5, 1, 0.65, 0.9, 0.45, 0.75, 0.55];
  return (
    <div className="flex h-20 items-end gap-1.5" aria-hidden="true">
      {bars.map((h, i) => (
        <motion.span
          key={i}
          className="w-2.5 rounded-full bg-ember"
          style={{ opacity: 0.55 + h * 0.4 }}
          initial={{ height: `${h * 40}%` }}
          animate={reduce ? { height: `${h * 70}%` } : { height: [`${h * 35}%`, `${h * 100}%`, `${h * 45}%`] }}
          transition={reduce ? {} : { duration: 1.6 + i * 0.18, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

export function Ritual() {
  return (
    <section id="ritual" className="relative border-t border-white/5 py-28 sm:py-36">
      <div className="container-site">
        <Reveal className="max-w-2xl">
          <h2 className="text-4xl font-semibold leading-tight text-mist md:text-5xl">
            Focus, turned into a ritual.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-mist-muted">
            Stillpoint is not another to-do list. It is a small, repeatable act that tells your
            mind it is time to go deep.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-16 grid grid-cols-1 divide-y divide-white/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {STEPS.map((s) => (
              <div key={s.title} className="px-0 py-8 sm:px-8 sm:py-0 sm:first:pl-0 sm:last:pr-0">
                <s.icon size={28} className="text-ember" weight="light" />
                <h3 className="mt-4 font-display text-xl font-semibold text-mist">{s.title}</h3>
                <p className="mt-2 text-mist-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Signature feature band */}
        <Reveal delay={0.05}>
          <div className="mt-20 grid items-center gap-10 rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-8 sm:p-12 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h3 className="text-3xl font-semibold leading-tight text-mist md:text-4xl">
                Sound that is generated, not streamed.
              </h3>
              <p className="mt-4 max-w-lg leading-relaxed text-mist-muted">
                Every soundscape is synthesised live in your browser from layered noise and tiny
                randomised events. Rain never loops. The fire never repeats. It costs nothing to
                run, works fully offline, and never plays the same minute twice.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <EqBars />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
