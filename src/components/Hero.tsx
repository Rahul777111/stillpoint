import { motion, useReducedMotion } from 'motion/react';

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function Hero({ onStart }: { onStart: () => void }) {
  const reduce = useReducedMotion();
  return (
    <section id="top" className="relative flex min-h-[100dvh] items-center overflow-hidden">
      {/* Cinematic video bed */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/55 to-ink" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-transparent to-transparent" />

      <div className="container-site relative z-10 pt-24">
        <div className="max-w-2xl">
          <motion.span
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="eyebrow"
          >
            <span className="h-px w-6 bg-ember/60" />
            Generative focus environments
          </motion.span>

          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 text-balance text-5xl font-semibold leading-[1.02] tracking-tightest text-mist md:text-6xl lg:text-[4.6rem]"
          >
            A quiet place for your deepest work.
          </motion.h1>

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-mist-muted"
          >
            Step into a living world, start the timer, and let generative soundscapes carry you
            into flow. No noise, no accounts, nothing to install.
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <button onClick={onStart} className="btn-primary">
              Begin a session
            </button>
            <button onClick={() => scrollTo('worlds')} className="btn-ghost">
              Explore the worlds
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
