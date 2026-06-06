// Stillpoint — procedural ambient sound engine.
// Generates layered soundscapes entirely in the browser with the Web Audio API.
// No audio files, no licensing, works offline. Each world is described by a
// recipe of "layers" (filtered noise beds + randomised event generators).

export type NoiseColor = 'white' | 'pink' | 'brown';

export interface FilterSpec {
  type: BiquadFilterType;
  freq: number;
  q: number;
}

export interface LfoSpec {
  rate: number; // Hz
  depth: number; // 0..1 fraction of base value
  target: 'gain' | 'filterFreq';
}

export interface NoiseLayer {
  kind: 'noise';
  color: NoiseColor;
  gain: number;
  filter?: FilterSpec;
  lfo?: LfoSpec;
}

export interface EventLayer {
  kind: 'events';
  shape: 'drop' | 'crackle' | 'chirp';
  rateMin: number; // seconds between events (min)
  rateMax: number; // seconds between events (max)
  gain: number;
  pitchMin?: number;
  pitchMax?: number;
}

export type SoundLayer = NoiseLayer | EventLayer;

const rand = (a: number, b: number) => a + Math.random() * (b - a);

// Build a looping noise buffer of the requested colour.
function makeNoiseBuffer(ctx: AudioContext, color: NoiseColor): AudioBuffer {
  const seconds = 4;
  const len = ctx.sampleRate * seconds;
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  if (color === 'white') {
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  } else if (color === 'pink') {
    // Paul Kellet's economical pink-noise approximation.
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + w * 0.0555179;
      b1 = 0.99332 * b1 + w * 0.0750759;
      b2 = 0.969 * b2 + w * 0.153852;
      b3 = 0.8665 * b3 + w * 0.3104856;
      b4 = 0.55 * b4 + w * 0.5329522;
      b5 = -0.7616 * b5 - w * 0.016898;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11;
      b6 = w * 0.115926;
    }
  } else {
    // Brown noise via integration of white noise.
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      data[i] = last * 3.5;
    }
  }
  return buffer;
}

export class AmbientEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private comp: DynamicsCompressorNode | null = null;
  private active: Array<{ stop: () => void }> = [];
  private timers: number[] = [];
  public running = false;

  private ensureContext() {
    if (this.ctx) return;
    const AC: typeof AudioContext =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();
    this.comp = this.ctx.createDynamicsCompressor();
    this.comp.threshold.value = -18;
    this.comp.ratio.value = 4;
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.comp);
    this.comp.connect(this.ctx.destination);
  }

  async start(layers: SoundLayer[], volume = 0.8) {
    this.ensureContext();
    if (!this.ctx || !this.master) return;
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    this.stopLayers();
    layers.forEach((l) => (l.kind === 'noise' ? this.buildNoise(l) : this.buildEvents(l)));
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(Math.max(0.0001, this.master.gain.value), now);
    this.master.gain.linearRampToValueAtTime(volume, now + 2.2);
    this.running = true;
  }

  private buildNoise(layer: NoiseLayer) {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = makeNoiseBuffer(ctx, layer.color);
    src.loop = true;

    const g = ctx.createGain();
    g.gain.value = layer.gain;

    let tail: AudioNode = src;
    let filter: BiquadFilterNode | null = null;
    if (layer.filter) {
      filter = ctx.createBiquadFilter();
      filter.type = layer.filter.type;
      filter.frequency.value = layer.filter.freq;
      filter.Q.value = layer.filter.q;
      src.connect(filter);
      tail = filter;
    }
    tail.connect(g);
    g.connect(this.master!);

    let lfoOsc: OscillatorNode | null = null;
    if (layer.lfo) {
      lfoOsc = ctx.createOscillator();
      lfoOsc.type = 'sine';
      lfoOsc.frequency.value = layer.lfo.rate;
      const lfoGain = ctx.createGain();
      if (layer.lfo.target === 'gain') {
        lfoGain.gain.value = layer.gain * layer.lfo.depth;
        lfoOsc.connect(lfoGain).connect(g.gain);
      } else if (filter) {
        lfoGain.gain.value = layer.filter!.freq * layer.lfo.depth;
        lfoOsc.connect(lfoGain).connect(filter.frequency);
      }
      lfoOsc.start();
    }
    src.start();
    this.active.push({
      stop: () => {
        try { src.stop(); } catch { /* noop */ }
        try { lfoOsc?.stop(); } catch { /* noop */ }
        src.disconnect();
        filter?.disconnect();
        g.disconnect();
      },
    });
  }

  private buildEvents(layer: EventLayer) {
    let cancelled = false;
    const schedule = () => {
      if (cancelled || !this.ctx) return;
      const delay = rand(layer.rateMin, layer.rateMax) * 1000;
      const id = window.setTimeout(() => {
        if (!cancelled) this.fireEvent(layer);
        schedule();
      }, delay);
      this.timers.push(id);
    };
    schedule();
    this.active.push({ stop: () => { cancelled = true; } });
  }

  private fireEvent(layer: EventLayer) {
    const ctx = this.ctx!;
    const t = ctx.currentTime;
    const pan = ctx.createStereoPanner();
    pan.pan.value = rand(-0.7, 0.7);
    pan.connect(this.master!);
    const env = ctx.createGain();
    env.gain.value = 0;
    env.connect(pan);

    if (layer.shape === 'drop') {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      const f0 = rand(620, 1150);
      osc.frequency.setValueAtTime(f0, t);
      osc.frequency.exponentialRampToValueAtTime(f0 * 0.55, t + 0.09);
      const peak = layer.gain * rand(0.5, 1);
      env.gain.linearRampToValueAtTime(peak, t + 0.005);
      env.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      osc.connect(env);
      osc.start(t);
      osc.stop(t + 0.2);
    } else if (layer.shape === 'crackle') {
      const buf = makeNoiseBuffer(ctx, 'white');
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = rand(1400, 3200);
      const peak = layer.gain * rand(0.4, 1);
      env.gain.linearRampToValueAtTime(peak, t + 0.004);
      env.gain.exponentialRampToValueAtTime(0.0001, t + rand(0.04, 0.12));
      src.connect(hp).connect(env);
      src.start(t, rand(0, 2), 0.2);
    } else {
      // chirp — short pitched warble for birds / crickets
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      const p = rand(layer.pitchMin ?? 2000, layer.pitchMax ?? 4000);
      osc.frequency.setValueAtTime(p, t);
      osc.frequency.linearRampToValueAtTime(p * rand(1.02, 1.12), t + 0.05);
      const reps = Math.floor(rand(2, 5));
      let tt = t;
      for (let i = 0; i < reps; i++) {
        env.gain.setValueAtTime(0, tt);
        env.gain.linearRampToValueAtTime(layer.gain, tt + 0.012);
        env.gain.exponentialRampToValueAtTime(0.0001, tt + 0.06);
        tt += rand(0.07, 0.13);
      }
      osc.connect(env);
      osc.start(t);
      osc.stop(tt + 0.1);
    }
  }

  setVolume(v: number) {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(v, now + 0.3);
  }

  private stopLayers() {
    this.timers.forEach((id) => clearTimeout(id));
    this.timers = [];
    this.active.forEach((a) => a.stop());
    this.active = [];
  }

  async stop(fade = 1.2) {
    if (!this.ctx || !this.master) { this.running = false; return; }
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0, now + fade);
    this.running = false;
    window.setTimeout(() => this.stopLayers(), fade * 1000 + 60);
  }
}

export const engine = new AmbientEngine();
