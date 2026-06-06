import { XLogo, GithubLogo } from '@phosphor-icons/react';
import { Logo } from './Logo';
import { LINKS, SITE } from '../data/config';

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const COLS = [
  { title: 'Product', links: [['Worlds', 'worlds'], ['The Ritual', 'ritual'], ['Pricing', 'pricing'], ['Gear', 'gear']] as const },
];

export function Footer({ onStart, onOpenMixer }: { onStart: () => void; onOpenMixer: () => void }) {
  return (
    <footer className="relative border-t border-white/10 py-16">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-10 lg:flex-row">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 leading-relaxed text-mist-muted">
              A quiet place for deep work. Step into a world, start the timer, and disappear into
              what matters.
            </p>
            <button onClick={onStart} className="btn-primary mt-6">Begin a session</button>
          </div>

          <div className="flex gap-16">
            {COLS.map((c) => (
              <div key={c.title}>
                <p className="text-sm font-medium text-mist">{c.title}</p>
                <ul className="mt-4 space-y-3">
                  {c.links.map(([label, id]) => (
                    <li key={id}>
                      <button onClick={() => scrollTo(id)} className="text-sm text-mist-muted transition-colors hover:text-mist">
                        {label}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button onClick={onOpenMixer} className="text-sm text-mist-muted transition-colors hover:text-mist">Sound Mixer</button>
                  </li>
                </ul>
              </div>
            ))}
            <div>
              <p className="text-sm font-medium text-mist">Elsewhere</p>
              <div className="mt-4 flex gap-3">
                <a href={LINKS.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-mist-muted transition-colors hover:border-white/30 hover:text-mist">
                  <XLogo size={18} />
                </a>
                <a href={LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-mist-muted transition-colors hover:border-white/30 hover:text-mist">
                  <GithubLogo size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-8 text-sm text-mist-dim sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {SITE.name}. Made for people who need the noise to stop.</p>
          <p>Sound generated live in your browser.</p>
        </div>
      </div>
    </footer>
  );
}
