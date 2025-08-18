import { create } from 'zustand';

interface GameStoreState {
  currentGameId: string | null;
  isPlaying: boolean;
  showInstructions: boolean;
}

interface GameStoreActions {
  setCurrentGameId: (id: string) => void;
  setIsPlaying: (playing: boolean) => void;
  setShowInstructions: (show: boolean) => void;
  clearGame: () => void;
}

export const useGameStore = create<GameStoreState & GameStoreActions>((set) => ({
  currentGameId: null,
  isPlaying: false,
  showInstructions: false,
  
  setCurrentGameId: (id: string) => set({ currentGameId: id }),
  setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),
  setShowInstructions: (show: boolean) => set({ showInstructions: show }),
  clearGame: () => set({ currentGameId: null, isPlaying: false }),
}));