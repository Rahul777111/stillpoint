import { loadJSON, saveJSON } from './storage';

const KEY = 'stillpoint.prefs.v1';

export interface Prefs {
  worldId: string | null;
  minutes: number;
  volume: number;
  voiceOn: boolean;
}

export const DEFAULT_PREFS: Prefs = {
  worldId: null,
  minutes: 25,
  volume: 0.8,
  voiceOn: true,
};

export const loadPrefs = (): Prefs => loadJSON(KEY, DEFAULT_PREFS);

export const savePrefs = (prefs: Prefs): void => saveJSON(KEY, prefs);
