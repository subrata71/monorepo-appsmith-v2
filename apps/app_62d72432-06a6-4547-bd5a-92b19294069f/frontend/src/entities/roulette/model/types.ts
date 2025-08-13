export interface RouletteSlot {
  number: number;
  color: 'red' | 'black' | 'green';
}

export interface RouletteState {
  isSpinning: boolean;
  winningNumber: number | null;
  slots: RouletteSlot[];
}

// European roulette slots configuration
export const ROULETTE_SLOTS: RouletteSlot[] = [
  // Green zero
  { number: 0, color: 'green' },
  // Red numbers
  { number: 1, color: 'red' },
  { number: 3, color: 'red' },
  { number: 5, color: 'red' },
  { number: 7, color: 'red' },
  { number: 9, color: 'red' },
  { number: 12, color: 'red' },
  { number: 14, color: 'red' },
  { number: 16, color: 'red' },
  { number: 18, color: 'red' },
  { number: 19, color: 'red' },
  { number: 21, color: 'red' },
  { number: 23, color: 'red' },
  { number: 25, color: 'red' },
  { number: 27, color: 'red' },
  { number: 30, color: 'red' },
  { number: 32, color: 'red' },
  { number: 34, color: 'red' },
  { number: 36, color: 'red' },
  // Black numbers
  { number: 2, color: 'black' },
  { number: 4, color: 'black' },
  { number: 6, color: 'black' },
  { number: 8, color: 'black' },
  { number: 10, color: 'black' },
  { number: 11, color: 'black' },
  { number: 13, color: 'black' },
  { number: 15, color: 'black' },
  { number: 17, color: 'black' },
  { number: 20, color: 'black' },
  { number: 22, color: 'black' },
  { number: 24, color: 'black' },
  { number: 26, color: 'black' },
  { number: 28, color: 'black' },
  { number: 29, color: 'black' },
  { number: 31, color: 'black' },
  { number: 33, color: 'black' },
  { number: 35, color: 'black' },
].sort((a, b) => a.number - b.number);
