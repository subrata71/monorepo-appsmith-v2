import { create } from 'zustand';
import type { RouletteState } from './types';
import { ROULETTE_SLOTS } from './types';

interface RouletteStore extends RouletteState {
  // Actions
  spin: () => void;
  reset: () => void;
  setWinningNumber: (number: number) => void;
  setSpinning: (spinning: boolean) => void;
}

export const useRouletteStore = create<RouletteStore>((set, get) => ({
  // Initial state
  isSpinning: false,
  winningNumber: null,
  slots: ROULETTE_SLOTS,

  // Actions
  spin: () => {
    const { isSpinning } = get();
    if (isSpinning) return;

    // Set spinning state
    set({ isSpinning: true, winningNumber: null });

    // Generate random winning number from available slots
    const randomIndex = Math.floor(Math.random() * ROULETTE_SLOTS.length);
    const winningSlot = ROULETTE_SLOTS[randomIndex];

    // Simulate spin duration (2-4 seconds)
    const spinDuration = 2000 + Math.random() * 2000;

    setTimeout(() => {
      set({
        isSpinning: false,
        winningNumber: winningSlot.number,
      });
    }, spinDuration);
  },

  reset: () => {
    set({
      isSpinning: false,
      winningNumber: null,
    });
  },

  setWinningNumber: (number: number) => {
    set({ winningNumber: number });
  },

  setSpinning: (spinning: boolean) => {
    set({ isSpinning: spinning });
  },
}));