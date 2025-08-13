import { create } from 'zustand';
import type { StopwatchStore } from './types';

export const useStopwatchStore = create<StopwatchStore>((set, get) => ({
  elapsedTime: 0,
  isRunning: false,

  start: () => {
    set({ isRunning: true });
  },

  stop: () => {
    set({ isRunning: false });
  },

  reset: () => {
    set({ elapsedTime: 0, isRunning: false });
  },

  tick: () => {
    const { isRunning } = get();
    if (isRunning) {
      set(state => ({ elapsedTime: state.elapsedTime + 1000 })); // Increment by 1 second
    }
  },
}));
