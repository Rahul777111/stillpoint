// Stillpoint — procedural ambient sound engine.
// Generates layered soundscapes entirely in the browser with the Web Audio API.
// No audio files, no licensing, works offline. Worlds use AmbientEngine; the
// free-form Sound Mixer uses MixerEngine. Both share the same layer builders.

export type NoiseColor = 'white' | 'pink' | 'brown';

export interface FilterSpec {
  type: BiquadFilterType;
  freq: number;
  q: number;
}

export interface LfoSpec {
  rate: number;
  depth: number;
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
  rateMin: number;
  rateMax: number;
  gain: number;
  pitchMin?: number;
  pitchMax?: number;
}

export type SoundLayer = NoiseLayer | EventLayer;
export interface StopHandle { stop: () => void }

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function makeNoiseBuffer(ctx: AudioContext, color: NoiseColor): AudioBuffer {
  const len = ctx.sampleRate * 4;
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  if (color === 'white') {
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  } else if (color === 'pink') {
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
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      data[i] = last * 3.5;
    }
  }
  return buffer;
}

function buildNoiseLayer(ctx: AudioContext, layer: NoiseLayer, dest: AudioNode): StopHandle {
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
  g.connect(dest);

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
  return {
    stop: () => {
      try { src.stop(); } catch { /* noop */ }
      try { lfoOsc?.stop(); } catch { /* noop */ }
      src.disconnect(); filter?.disconnect(); g.disconnect();
    },
  };
}

function buildEventLayer(ctx: AudioContext, layer: EventLayer, dest: AudioNode): StopHandle {
  let cancelled = false;
  const timers: number[] = [];

  const fire = () => {
    const t = ctx.currentTime;
    const pan = ctx.createStereoPanner();
    pan.pan.value = rand(-0.7, 0.7);
    pan.connect(dest);
    const env = ctx.createGain();
    env.gain.value = 0;
    env.connect(pan);

    if (layer.shape === 'drop') {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      const f0 = rand(620, 1150);
      osc.frequency.setValueAtTime(f0, t);
      osc.frequency.exponentialRampToValueAtTime(f0 * 0.55, t + 0.09);
      env.gain.linearRampToValueAtTime(layer.gain * rand(0.5, 1), t + 0.005);
      env.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      osc.connect(env); osc.start(t); osc.stop(t + 0.2);
    } else if (layer.shape === 'crackle') {
      const src = ctx.createBufferSource();
      src.buffer = makeNoiseBuffer(ctx, 'white');
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = rand(1400, 3200);
      env.gain.linearRampToValueAtTime(layer.gain * rand(0.4, 1), t + 0.004);
      env.gain.exponentialRampToValueAtTime(0.0001, t + rand(0.04, 0.12));
      src.connect(hp).connect(env); src.start(t, rand(0, 2), 0.2);
    } else {
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
      osc.connect(env); osc.start(t); osc.stop(tt + 0.1);
    }
  };

  const schedule = () => {
    if (cancelled) return;
    const id = window.setTimeout(() => {
      if (!cancelled) fire();
      schedule();
    }, rand(layer.rateMin, layer.rateMax) * 1000);
    timers.push(id);
  };
  schedule();
  return { stop: () => { cancelled = true; timers.forEach((id) => clearTimeout(id)); } };
}

function buildLayer(ctx: AudioContext, layer: SoundLayer, dest: AudioNode): StopHandle {
  return layer.kind === 'noise' ? buildNoiseLayer(ctx, layer, dest) : buildEventLayer(ctx, layer, dest);
}

function createContext(): { ctx: AudioContext; master: GainNode } {
  const AC: typeof AudioContext =
    window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  const ctx = new AC();
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18; comp.ratio.value = 4;
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(comp); comp.connect(ctx.destination);
  return { ctx, master };
}

/** World soundscapes — a fixed recipe, faded in and out as a whole. */
export class AmbientEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private active: StopHandle[] = [];
  public running = false;

  private ensure() {
    if (this.ctx) return;
    const { ctx, master } = createContext();
    this.ctx = ctx; this.master = master;
  }

  async start(layers: SoundLayer[], volume = 0.8) {
    this.ensure();
    if (!this.ctx || !this.master) return;
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    this.active.forEach((a) => a.stop());
    this.active = layers.map((l) => buildLayer(this.ctx!, l, this.master!));
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(Math.max(0.0001, this.master.gain.value), now);
    this.master.gain.linearRampToValueAtTime(volume, now + 2.2);
    this.running = true;
  }

  setVolume(v: number) {
    if (!this.ctx || !this.master) return;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(v, now + 0.3);
  }

  async stop(fade = 1.2) {
    if (!this.ctx || !this.master) { this.running = false; return; }
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0, now + fade);
    this.running = false;
    const handles = this.active; this.active = [];
    window.setTimeout(() => handles.forEach((a) => a.stop()), fade * 1000 + 60);
  }
}

/** Free-form mixer — independent channels the user blends live. */
export class MixerEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private channels = new Map<string, { gain: GainNode; handles: StopHandle[] }>();

  private ensure() {
    if (this.ctx) return;
    const { ctx, master } = createContext();
    this.ctx = ctx; this.master = master;
    master.gain.value = 0.9;
  }

  async enable(id: string, layers: SoundLayer[], level: number) {
    this.ensure();
    if (!this.ctx || !this.master) return;
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    if (this.channels.has(id)) return;
    const gain = this.ctx.createGain();
    gain.gain.value = 0;
    gain.connect(this.master);
    const handles = layers.map((l) => buildLayer(this.ctx!, l, gain));
    const now = this.ctx.currentTime;
    gain.gain.linearRampToValueAtTime(level, now + 0.8);
    this.channels.set(id, { gain, handles });
  }

  setLevel(id: string, level: number) {
    const ch = this.channels.get(id);
    if (!ch || !this.ctx) return;
    const now = this.ctx.currentTime;
    ch.gain.gain.cancelScheduledValues(now);
    ch.gain.gain.setValueAtTime(ch.gain.gain.value, now);
    ch.gain.gain.linearRampToValueAtTime(level, now + 0.2);
  }

  disable(id: string) {
    const ch = this.channels.get(id);
    if (!ch || !this.ctx) return;
    const now = this.ctx.currentTime;
    ch.gain.gain.cancelScheduledValues(now);
    ch.gain.gain.setValueAtTime(ch.gain.gain.value, now);
    ch.gain.gain.linearRampToValueAtTime(0, now + 0.5);
    const handles = ch.handles;
    window.setTimeout(() => { handles.forEach((h) => h.stop()); ch.gain.disconnect(); }, 600);
    this.channels.delete(id);
  }

  isOn(id: string) { return this.channels.has(id); }

  stopAll() {
    this.channels.forEach((ch) => { ch.handles.forEach((h) => h.stop()); ch.gain.disconnect(); });
    this.channels.clear();
  }
}

export const engine = new AmbientEngine();
export const mixer = new MixerEngine();
