import type { SoundLayer } from '../lib/audio';

export interface World {
  id: string;
  name: string;
  location: string;
  tagline: string;
  description: string;
  image: string;
  video: string;
  accent: string; // hex used for per-world UI tinting
  premium: boolean;
  layers: SoundLayer[];
}

export const WORLDS: World[] = [
  {
    id: 'rainforest',
    name: 'Rainforest Dawn',
    location: 'Pacific temperate forest',
    tagline: 'Soft rain, distant birdsong, a quiet stream.',
    description:
      'Mist drifts between old-growth pines as light rain settles the world. A clear creek runs nearby and unseen birds call through the canopy.',
    image: '/worlds/rainforest.jpg',
    video: '/worlds/rainforest.mp4',
    accent: '#7FB069',
    premium: false,
    layers: [
      { kind: 'noise', color: 'pink', gain: 0.12, filter: { type: 'lowpass', freq: 2600, q: 0.7 } },
      { kind: 'noise', color: 'white', gain: 0.05, filter: { type: 'bandpass', freq: 5200, q: 0.9 }, lfo: { rate: 0.07, depth: 0.03, target: 'gain' } },
      { kind: 'events', shape: 'drop', rateMin: 0.18, rateMax: 0.55, gain: 0.16 },
      { kind: 'events', shape: 'chirp', rateMin: 2.2, rateMax: 6.5, gain: 0.09, pitchMin: 1800, pitchMax: 4200 },
      { kind: 'noise', color: 'brown', gain: 0.06, filter: { type: 'lowpass', freq: 700, q: 0.6 } },
    ],
  },
  {
    id: 'ocean',
    name: 'Deep Ocean',
    location: 'Open blue water',
    tagline: 'Slow rolling swells beneath shafts of light.',
    description:
      'Long, slow waves rise and fall in a vast calm. Low water pressure hums beneath the surface as the swell breathes in and out.',
    image: '/worlds/ocean.jpg',
    video: '/worlds/ocean.mp4',
    accent: '#4FA3C7',
    premium: false,
    layers: [
      { kind: 'noise', color: 'brown', gain: 0.2, filter: { type: 'lowpass', freq: 900, q: 0.5 }, lfo: { rate: 0.09, depth: 0.16, target: 'gain' } },
      { kind: 'noise', color: 'white', gain: 0.07, filter: { type: 'bandpass', freq: 1400, q: 0.8 }, lfo: { rate: 0.09, depth: 0.06, target: 'filterFreq' } },
      { kind: 'noise', color: 'pink', gain: 0.05, filter: { type: 'lowpass', freq: 300, q: 0.6 } },
    ],
  },
  {
    id: 'snowfall',
    name: 'Alpine Snowfall',
    location: 'High mountain ridge',
    tagline: 'Hushed wind across a sleeping range.',
    description:
      'Snow falls without a sound across the peaks. A gentle, shifting wind moves over the ridgeline, soft and endless.',
    image: '/worlds/snowfall.jpg',
    video: '/worlds/snowfall.mp4',
    accent: '#9AB4D4',
    premium: false,
    layers: [
      { kind: 'noise', color: 'pink', gain: 0.13, filter: { type: 'lowpass', freq: 1100, q: 0.5 }, lfo: { rate: 0.05, depth: 0.1, target: 'gain' } },
      { kind: 'noise', color: 'white', gain: 0.04, filter: { type: 'bandpass', freq: 2200, q: 0.6 }, lfo: { rate: 0.04, depth: 0.05, target: 'filterFreq' } },
      { kind: 'noise', color: 'brown', gain: 0.05, filter: { type: 'lowpass', freq: 240, q: 0.6 } },
    ],
  },
  {
    id: 'tokyo',
    name: 'Tokyo Rain',
    location: 'Backstreet at midnight',
    tagline: 'City rain on neon-lit pavement.',
    description:
      'Steady rain falls on an empty lane. Water runs from the eaves, a far-off hum of the city rolls under it all, and the night feels yours alone.',
    image: '/worlds/tokyo.jpg',
    video: '/worlds/tokyo.mp4',
    accent: '#E08A5B',
    premium: true,
    layers: [
      { kind: 'noise', color: 'pink', gain: 0.16, filter: { type: 'lowpass', freq: 3200, q: 0.7 } },
      { kind: 'events', shape: 'drop', rateMin: 0.06, rateMax: 0.22, gain: 0.14 },
      { kind: 'noise', color: 'brown', gain: 0.09, filter: { type: 'lowpass', freq: 180, q: 0.7 }, lfo: { rate: 0.03, depth: 0.04, target: 'gain' } },
      { kind: 'noise', color: 'white', gain: 0.04, filter: { type: 'bandpass', freq: 6000, q: 1.1 } },
    ],
  },
  {
    id: 'fireside',
    name: 'Fireside Cabin',
    location: 'A cabin in the rain',
    tagline: 'A crackling fire, rain on the window.',
    description:
      'A wood fire pops and settles in the hearth while rain taps the glass. Warm, close, and safe from the weather outside.',
    image: '/worlds/fireside.jpg',
    video: '/worlds/fireside.mp4',
    accent: '#E7943B',
    premium: true,
    layers: [
      { kind: 'noise', color: 'brown', gain: 0.1, filter: { type: 'lowpass', freq: 520, q: 0.6 }, lfo: { rate: 0.12, depth: 0.05, target: 'gain' } },
      { kind: 'events', shape: 'crackle', rateMin: 0.12, rateMax: 0.9, gain: 0.22 },
      { kind: 'events', shape: 'drop', rateMin: 0.5, rateMax: 1.4, gain: 0.08 },
      { kind: 'noise', color: 'pink', gain: 0.05, filter: { type: 'bandpass', freq: 1600, q: 0.8 } },
    ],
  },
  {
    id: 'desert',
    name: 'Desert Night',
    location: 'Under the milky way',
    tagline: 'Crickets and a warm desert breeze.',
    description:
      'A wide, still desert beneath a river of stars. A dry breeze moves over the dunes while crickets keep the dark company.',
    image: '/worlds/desert.jpg',
    video: '/worlds/desert.mp4',
    accent: '#C8A24A',
    premium: true,
    layers: [
      { kind: 'noise', color: 'pink', gain: 0.08, filter: { type: 'lowpass', freq: 900, q: 0.5 }, lfo: { rate: 0.045, depth: 0.08, target: 'gain' } },
      { kind: 'events', shape: 'chirp', rateMin: 0.35, rateMax: 0.7, gain: 0.05, pitchMin: 4200, pitchMax: 4800 },
      { kind: 'noise', color: 'brown', gain: 0.05, filter: { type: 'lowpass', freq: 200, q: 0.6 } },
    ],
  },
];

export const getWorld = (id: string | null): World =>
  WORLDS.find((w) => w.id === id) ?? WORLDS[0];
