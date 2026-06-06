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
import { MixerOverlay } from './components/MixerOverlay';
import { StatsPanel } from './components/StatsPanel';
import { WORLDS, type World } from './data/worlds';
import { useStats } from './lib/useStats';

export default function App() {
  const { stats, recordSession, unlockPro } = useStats();
  const [world, setWorld] = useState<World>(WORLDS[0]);
  const [sessionOpen, setSessionOpen] = useState(false);
  const [mixerOpen, setMixerOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [upgradeWorld, setUpgradeWorld] = useState<World | null>(null);

  const anyOverlay = sessionOpen || mixerOpen;
  useEffect(() => {
    document.body.style.overflow = anyOverlay ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [anyOverlay]);

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
      <Nav onStart={startDefault} onOpenMixer={() => setMixerOpen(true)} onOpenStats={() => setStatsOpen(true)} />
      <main>
        <Hero onStart={startDefault} />
        <Ritual onOpenMixer={() => setMixerOpen(true)} />
        <Worlds pro={stats.pro} onEnter={enterWorld} />
        <Pricing pro={stats.pro} onStart={startDefault} onRestore={unlockPro} />
        <Gear />
        <Support />
      </main>
      <Footer onStart={startDefault} onOpenMixer={() => setMixerOpen(true)} />

      <AnimatePresence>
        {sessionOpen && (
          <FocusOverlay
            world={world} worlds={WORLDS} pro={stats.pro} stats={stats}
            onSelectWorld={setWorld} onComplete={recordSession}
            onUpgrade={() => setUpgradeWorld(world)} onClose={() => setSessionOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mixerOpen && <MixerOverlay onClose={() => setMixerOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {statsOpen && <StatsPanel stats={stats} onClose={() => setStatsOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {upgradeWorld && <UpgradeModal world={upgradeWorld} onRestore={unlockPro} onClose={() => setUpgradeWorld(null)} />}
      </AnimatePresence>
    </div>
  );
}
