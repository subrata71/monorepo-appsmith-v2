import { create } from 'zustand';
import type { VisualizationState } from './types';

interface VisualizationActions {
  initialize: (array: number[], speed?: number) => void;
  setArray: (array: number[]) => void;
  setArraySize: (size: number) => void;
  setStatus: (status: VisualizationState['status']) => void;
  step: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  setError: (error: string | null) => void;
}

type VisualizationStore = VisualizationState & VisualizationActions;

// Default array for demonstration
const DEFAULT_ARRAY = [64, 34, 25, 12, 22, 11, 90];

const initialState: VisualizationState = {
  array: [...DEFAULT_ARRAY],
  originalArray: [...DEFAULT_ARRAY],
  arraySize: DEFAULT_ARRAY.length,
  status: 'idle',
  currentStep: 0,
  highlightedIndices: [],
  sortedPartition: 0,
  animationSpeed: 1,
  error: null,
};

export const useVisualizationStore = create<VisualizationStore>((set, get) => ({
  ...initialState,

  initialize: (array: number[], speed = 1) => {
    set({
      array: [...array],
      originalArray: [...array],
      arraySize: array.length,
      status: 'idle',
      currentStep: 0,
      highlightedIndices: [],
      sortedPartition: 0,
      animationSpeed: speed,
      error: null,
    });
  },

  setArray: (array: number[]) => {
    set((state) => ({
      array: [...array],
      originalArray: [...array],
      arraySize: array.length,
      status: 'idle',
      currentStep: 0,
      highlightedIndices: [],
      sortedPartition: 0,
      error: null,
    }));
  },

  setArraySize: (size: number) => {
    set({ arraySize: size });
  },

  setStatus: (status: VisualizationState['status']) => {
    set({ status });
  },

  step: () => {
    const state = get();
    if (state.status === 'running' || state.status === 'paused') {
      set({ currentStep: state.currentStep + 1 });
    }
  },

  reset: () => {
    const state = get();
    set({
      array: [...state.originalArray],
      status: 'idle',
      currentStep: 0,
      highlightedIndices: [],
      sortedPartition: 0,
      error: null,
    });
  },

  setSpeed: (speed: number) => {
    set({ animationSpeed: speed });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));