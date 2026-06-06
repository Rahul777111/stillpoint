import { CloudRain, Waves, Wind, Campfire, Bird, BugBeetle, Drop, WaveSine } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';
import type { SoundLayer } from '../lib/audio';

export interface MixElement {
  id: string;
  name: string;
  icon: Icon;
  defaultLevel: number;
  layers: SoundLayer[];
}

export const MIX_ELEMENTS: MixElement[] = [
  {
    id: 'rain', name: 'Rain', icon: CloudRain, defaultLevel: 0.7,
    layers: [
      { kind: 'noise', color: 'pink', gain: 0.16, filter: { type: 'lowpass', freq: 3000, q: 0.7 } },
      { kind: 'events', shape: 'drop', rateMin: 0.08, rateMax: 0.3, gain: 0.13 },
    ],
  },
  {
    id: 'ocean', name: 'Ocean', icon: Waves, defaultLevel: 0.6,
    layers: [
      { kind: 'noise', color: 'brown', gain: 0.22, filter: { type: 'lowpass', freq: 900, q: 0.5 }, lfo: { rate: 0.09, depth: 0.18, target: 'gain' } },
      { kind: 'noise', color: 'white', gain: 0.06, filter: { type: 'bandpass', freq: 1400, q: 0.8 }, lfo: { rate: 0.09, depth: 0.06, target: 'filterFreq' } },
    ],
  },
  {
    id: 'wind', name: 'Wind', icon: Wind, defaultLevel: 0.5,
    layers: [
      { kind: 'noise', color: 'pink', gain: 0.16, filter: { type: 'lowpass', freq: 1100, q: 0.5 }, lfo: { rate: 0.05, depth: 0.14, target: 'gain' } },
      { kind: 'noise', color: 'white', gain: 0.04, filter: { type: 'bandpass', freq: 2200, q: 0.6 }, lfo: { rate: 0.04, depth: 0.06, target: 'filterFreq' } },
    ],
  },
  {
    id: 'fire', name: 'Fire', icon: Campfire, defaultLevel: 0.65,
    layers: [
      { kind: 'noise', color: 'brown', gain: 0.12, filter: { type: 'lowpass', freq: 520, q: 0.6 }, lfo: { rate: 0.12, depth: 0.06, target: 'gain' } },
      { kind: 'events', shape: 'crackle', rateMin: 0.1, rateMax: 0.8, gain: 0.24 },
    ],
  },
  {
    id: 'birds', name: 'Birds', icon: Bird, defaultLevel: 0.5,
    layers: [
      { kind: 'events', shape: 'chirp', rateMin: 1.8, rateMax: 5.5, gain: 0.1, pitchMin: 1800, pitchMax: 4200 },
      { kind: 'noise', color: 'pink', gain: 0.03, filter: { type: 'lowpass', freq: 2000, q: 0.6 } },
    ],
  },
  {
    id: 'crickets', name: 'Crickets', icon: BugBeetle, defaultLevel: 0.45,
    layers: [
      { kind: 'events', shape: 'chirp', rateMin: 0.3, rateMax: 0.65, gain: 0.06, pitchMin: 4200, pitchMax: 4800 },
    ],
  },
  {
    id: 'stream', name: 'Stream', icon: Drop, defaultLevel: 0.55,
    layers: [
      { kind: 'noise', color: 'white', gain: 0.08, filter: { type: 'bandpass', freq: 1500, q: 0.9 }, lfo: { rate: 0.3, depth: 0.1, target: 'filterFreq' } },
      { kind: 'noise', color: 'pink', gain: 0.1, filter: { type: 'lowpass', freq: 2200, q: 0.6 } },
      { kind: 'events', shape: 'drop', rateMin: 0.2, rateMax: 0.6, gain: 0.07 },
    ],
  },
  {
    id: 'hum', name: 'Deep hum', icon: WaveSine, defaultLevel: 0.5,
    layers: [
      { kind: 'noise', color: 'brown', gain: 0.16, filter: { type: 'lowpass', freq: 140, q: 0.7 }, lfo: { rate: 0.03, depth: 0.1, target: 'gain' } },
      { kind: 'noise', color: 'pink', gain: 0.05, filter: { type: 'lowpass', freq: 320, q: 0.6 } },
    ],
  },
];
