import { useState, type FormEvent } from 'react';
import { Heart, ArrowUpRight, EnvelopeSimple, Check } from '@phosphor-icons/react';
import { LINKS } from '../data/config';
import { Reveal } from './Reveal';

export function Support() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    if (LINKS.newsletter) return; // let the real form action handle it
    e.preventDefault();
    if (!email.includes('@')) return;
    setDone(true);
  };

  return (
    <section id="support" className="relative border-t border-white/5 py-28 sm:py-36">
      <div className="container-site grid gap-5 lg:grid-cols-2">
        <Reveal>
          <div className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-8 sm:p-10">
            <div>
              <Heart size={28} weight="light" className="text-ember" />
              <h3 className="mt-5 font-display text-2xl font-semibold text-mist">Keep the lights low and the rain falling.</h3>
              <p className="mt-3 max-w-md leading-relaxed text-mist-muted">
                Stillpoint is free and has no ads inside a session. If it has earned you an hour of
                real focus, you can leave a tip and keep new worlds coming.
              </p>
            </div>
            <a href={LINKS.tip} target="_blank" rel="noopener noreferrer" className="btn-primary mt-8 self-start">
              Leave a tip <ArrowUpRight size={18} />
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="flex h-full flex-col justify-between rounded-3xl border border-white/10 p-8 sm:p-10">
            <div>
              <EnvelopeSimple size={28} weight="light" className="text-ember" />
              <h3 className="mt-5 font-display text-2xl font-semibold text-mist">A note when a new world opens.</h3>
              <p className="mt-3 max-w-md leading-relaxed text-mist-muted">
                One short email when a new scene or soundscape lands. No spam, unsubscribe in a click.
              </p>
            </div>
            {done ? (
              <p className="mt-8 flex items-center gap-2 text-ember"><Check size={20} weight="bold" /> You are on the list.</p>
            ) : (
              <form
                onSubmit={submit}
                action={LINKS.newsletter || undefined}
                method={LINKS.newsletter ? 'POST' : undefined}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  name="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@studio.com"
                  aria-label="Email address"
                  className="w-full rounded-full border border-white/15 bg-white/[0.03] px-5 py-3.5 text-mist placeholder:text-mist-dim focus:border-ember/60 focus:outline-none focus:ring-2 focus:ring-ember/20"
                />
                <button type="submit" className="btn-primary shrink-0">Subscribe</button>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
