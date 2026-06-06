import { useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Ritual } from './components/Ritual';
import { Worlds } from './components/Worlds';
import { Pricing } from './components/Pricing';
import { Gear } from './components/Gear';
import { Support } from './components/Support';
import { Footer } from './components/Footer';
import { FocusOverlay } from './components/FocusOverlay';
import { UpgradeModal } from './components/UpgradeModal';
import { WORLDS, type World } from './data/worlds';
import { useStats } from './lib/useStats';

export default function App() {
  const { stats, recordSession, unlockPro } = useStats();
  const [world, setWorld] = useState<World>(WORLDS[0]);
  const [sessionOpen, setSessionOpen] = useState(false);
  const [upgradeWorld, setUpgradeWorld] = useState<World | null>(null);

  // lock body scroll while immersive overlay is open
  useEffect(() => {
    document.body.style.overflow = sessionOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sessionOpen]);

  const enterWorld = (w: World) => {
    if (w.premium && !stats.pro) { setUpgradeWorld(w); return; }
    setWorld(w);
    setSessionOpen(true);
  };

  const startDefault = () => {
    if (world.premium && !stats.pro) setWorld(WORLDS[0]);
    setSessionOpen(true);
  };

  return (
    <div className="grain min-h-screen bg-ink">
      <Nav onStart={startDefault} />
      <main>
        <Hero onStart={startDefault} />
        <Ritual />
        <Worlds pro={stats.pro} onEnter={enterWorld} />
        <Pricing pro={stats.pro} onStart={startDefault} onRestore={unlockPro} />
        <Gear />
        <Support />
      </main>
      <Footer onStart={startDefault} />

      <AnimatePresence>
        {sessionOpen && (
          <FocusOverlay
            world={world}
            worlds={WORLDS}
            pro={stats.pro}
            stats={stats}
            onSelectWorld={setWorld}
            onComplete={recordSession}
            onUpgrade={() => setUpgradeWorld(world)}
            onClose={() => setSessionOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {upgradeWorld && (
          <UpgradeModal
            world={upgradeWorld}
            onRestore={unlockPro}
            onClose={() => setUpgradeWorld(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
