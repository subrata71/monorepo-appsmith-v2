import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { SmileyFeatures, MouthType, EyeType, ColorType } from './types';
import { MOUTH_OPTIONS, EYE_OPTIONS, COLOR_OPTIONS } from './types';

interface SmileyStore extends SmileyFeatures {
  setMouth: (mouth: string) => void;
  setEyes: (eyes: string) => void;
  setColor: (color: string) => void;
  randomize: () => void;
}

// Helper functions to get random options
const getRandomMouth = (): MouthType => {
  const mouths = Object.keys(MOUTH_OPTIONS) as MouthType[];
  return mouths[Math.floor(Math.random() * mouths.length)];
};

const getRandomEyes = (): EyeType => {
  const eyes = Object.keys(EYE_OPTIONS) as EyeType[];
  return eyes[Math.floor(Math.random() * eyes.length)];
};

const getRandomColor = (): ColorType => {
  return COLOR_OPTIONS[Math.floor(Math.random() * COLOR_OPTIONS.length)];
};

export const useSmileyStore = create<SmileyStore>()(
  subscribeWithSelector(set => ({
    // Initial state
    mouth: 'happy',
    eyes: 'normal',
    color: '#FFD700',

    // Actions
    setMouth: mouth => set({ mouth }),
    setEyes: eyes => set({ eyes }),
    setColor: color => set({ color }),
    randomize: () =>
      set({
        mouth: getRandomMouth(),
        eyes: getRandomEyes(),
        color: getRandomColor(),
      }),
  }))
);
