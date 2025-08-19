import { create } from 'zustand';

interface ResultsUiState {
  finalScore: number;
  isRestarting: boolean;
  setFinalScore: (score: number) => void;
  startRestart: () => void;
  completeRestart: () => void;
  setError: (error: string | null) => void;
}

export const useResultsUiStore = create<ResultsUiState>(set => ({
  finalScore: 0,
  isRestarting: false,
  setFinalScore: (score: number) => set({ finalScore: score }),
  startRestart: () => set({ isRestarting: true }),
  completeRestart: () => set({ isRestarting: false }),
  setError: () => {}, // Placeholder for error handling if needed
}));