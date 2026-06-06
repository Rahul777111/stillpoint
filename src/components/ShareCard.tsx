import { useEffect, useRef, useState } from 'react';
import { DownloadSimple, ShareNetwork, Check } from '@phosphor-icons/react';
import type { World } from '../data/worlds';
import type { Stats } from '../lib/useStats';
import { SITE } from '../data/config';

interface Props {
  minutes: number;
  world: World;
  stats: Stats;
}

const SIZE = 1080;

export function ShareCard({ minutes, world, stats }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = world.image;

    const draw = async () => {
      try { await (document as Document & { fonts: FontFaceSet }).fonts.ready; } catch { /* ignore */ }

      // cover-draw background
      const ar = SIZE / SIZE;
      const iw = img.naturalWidth || SIZE;
      const ih = img.naturalHeight || SIZE;
      let sw = iw, sh = ih, sx = 0, sy = 0;
      if (iw / ih > ar) { sw = ih * ar; sx = (iw - sw) / 2; }
      else { sh = iw / ar; sy = (ih - sh) / 2; }
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, SIZE, SIZE);

      // scrim
      const g = ctx.createLinearGradient(0, 0, 0, SIZE);
      g.addColorStop(0, 'rgba(10,12,16,0.55)');
      g.addColorStop(0.55, 'rgba(10,12,16,0.35)');
      g.addColorStop(1, 'rgba(10,12,16,0.95)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, SIZE, SIZE);

      // brand ring top-left
      const cx = 92, cy = 92;
      ctx.strokeStyle = 'rgba(231,181,99,0.35)';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(cx, cy, 30, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = '#E7B563';
      ctx.lineWidth = 6;
      ctx.beginPath(); ctx.arc(cx, cy, 19, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#F3CC82';
      ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#ECEBE3';
      ctx.font = '600 34px "Cabinet Grotesk", sans-serif';
      ctx.textBaseline = 'middle';
      ctx.fillText('Stillpoint', 138, 94);

      // big number
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = '#ECEBE3';
      ctx.font = '600 200px "Cabinet Grotesk", sans-serif';
      ctx.fillText(String(minutes), 80, 720);
      ctx.font = '500 56px "General Sans", sans-serif';
      ctx.fillStyle = '#E7B563';
      const numW = ctx.measureText(String(minutes)).width; // not used precisely
      void numW;
      ctx.fillText('minutes of', 88, 780);
      ctx.fillText('deep work', 88, 848);

      // world + streak chips
      ctx.font = '500 38px "General Sans", sans-serif';
      ctx.fillStyle = '#A7ACB6';
      ctx.fillText(`${world.name}  ·  ${stats.currentStreak}-day streak`, 88, 940);

      // footer url
      ctx.font = '500 34px "General Sans", sans-serif';
      ctx.fillStyle = 'rgba(236,235,227,0.7)';
      const url = SITE.url.replace(/^https?:\/\//, '');
      ctx.fillText(url, 88, 1010);

      setReady(true);
    };

    if (img.complete && img.naturalWidth) draw();
    else img.onload = draw;
  }, [minutes, world, stats.currentStreak]);

  const download = () => {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `stillpoint-${minutes}min.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    }, 'image/png');
  };

  const share = async () => {
    canvasRef.current?.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'stillpoint.png', { type: 'image/png' });
      const text = `I just focused ${minutes} minutes with Stillpoint. ${SITE.url}`;
      const navAny = navigator as Navigator & { canShare?: (d: unknown) => boolean };
      if (navAny.canShare && navAny.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], text, title: 'Stillpoint' }); return; } catch { /* cancelled */ }
      }
      try {
        await navigator.clipboard.writeText(text);
        setShared(true);
        setTimeout(() => setShared(false), 2200);
      } catch { download(); }
    }, 'image/png');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          className={`h-56 w-56 transition-opacity duration-500 ${ready ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
      <div className="flex gap-3">
        <button onClick={share} className="btn-primary text-sm">
          {shared ? <><Check size={18} /> Copied</> : <><ShareNetwork size={18} /> Share card</>}
        </button>
        <button onClick={download} className="btn-ghost text-sm">
          <DownloadSimple size={18} /> Save
        </button>
      </div>
    </div>
  );
}
