import { create } from 'zustand';
import type { VisualizationState } from './types';
import { HeapSortAlgorithm, type SortStep } from '../lib/heap-sort-algorithm';

interface VisualizationActions {
  initialize: (array: number[], speed?: number) => void;
  setArray: (array: number[]) => void;
  setArraySize: (size: number) => void;
  setStatus: (status: VisualizationState['status']) => void;
  start: () => void;
  pause: () => void;
  step: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  setError: (error: string | null) => void;
}

type VisualizationStore = VisualizationState &
  VisualizationActions & {
    sortSteps: SortStep[];
    totalSteps: number;
    currentDescription: string;
  };

// Default array for demonstration
const DEFAULT_ARRAY = [64, 34, 25, 12, 22, 11, 90];

// Generate initial sort steps
const initialAlgorithm = new HeapSortAlgorithm(DEFAULT_ARRAY);
const initialSortSteps = initialAlgorithm.getSteps();

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

const initialExtendedState = {
  ...initialState,
  sortSteps: initialSortSteps,
  totalSteps: initialSortSteps.length,
  currentDescription: 'Ready to start heap sort visualization',
  animationTimeoutId: null as NodeJS.Timeout | null,
};

let animationTimeoutId: NodeJS.Timeout | null = null;

export const useVisualizationStore = create<VisualizationStore>((set, get) => ({
  ...initialExtendedState,

  initialize: (array: number[], speed = 1) => {
    const algorithm = new HeapSortAlgorithm(array);
    const sortSteps = algorithm.getSteps();

    // Clear any existing animation
    if (animationTimeoutId) {
      clearTimeout(animationTimeoutId);
      animationTimeoutId = null;
    }

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
      sortSteps,
      totalSteps: sortSteps.length,
      currentDescription: 'Ready to start heap sort visualization',
    });
  },

  setArray: (array: number[]) => {
    const algorithm = new HeapSortAlgorithm(array);
    const sortSteps = algorithm.getSteps();

    // Clear any existing animation
    if (animationTimeoutId) {
      clearTimeout(animationTimeoutId);
      animationTimeoutId = null;
    }

    set({
      array: [...array],
      originalArray: [...array],
      arraySize: array.length,
      status: 'idle',
      currentStep: 0,
      highlightedIndices: [],
      sortedPartition: 0,
      error: null,
      sortSteps,
      totalSteps: sortSteps.length,
      currentDescription: 'Ready to start heap sort visualization',
    });
  },

  setArraySize: (size: number) => {
    set({ arraySize: size });
  },

  setStatus: (status: VisualizationState['status']) => {
    set({ status });
  },

  start: () => {
    const state = get();
    if (state.array.length === 0 || state.status === 'running') return;

    set({ status: 'running' });

    const runAnimation = () => {
      const currentState = get();

      if (currentState.status !== 'running') return;

      if (currentState.currentStep >= currentState.totalSteps) {
        set({ status: 'completed' });
        return;
      }

      // Execute the current step
      const step = currentState.sortSteps[currentState.currentStep];
      if (step) {
        set({
          array: [...step.array],
          highlightedIndices: step.highlightedIndices,
          sortedPartition: step.sortedPartition,
          currentDescription: step.description,
          currentStep: currentState.currentStep + 1,
        });
      }

      // Schedule next step based on animation speed
      const delay = Math.max(100, 1000 / currentState.animationSpeed);
      animationTimeoutId = setTimeout(runAnimation, delay);
    };

    runAnimation();
  },

  pause: () => {
    if (animationTimeoutId) {
      clearTimeout(animationTimeoutId);
      animationTimeoutId = null;
    }
    set({ status: 'paused' });
  },

  step: () => {
    const state = get();

    if (state.currentStep >= state.totalSteps) {
      set({ status: 'completed' });
      return;
    }

    const step = state.sortSteps[state.currentStep];
    if (step) {
      set({
        array: [...step.array],
        highlightedIndices: step.highlightedIndices,
        sortedPartition: step.sortedPartition,
        currentDescription: step.description,
        currentStep: state.currentStep + 1,
        status:
          state.currentStep + 1 >= state.totalSteps ? 'completed' : 'paused',
      });
    }
  },

  reset: () => {
    const state = get();

    // Clear any existing animation
    if (animationTimeoutId) {
      clearTimeout(animationTimeoutId);
      animationTimeoutId = null;
    }

    set({
      array: [...state.originalArray],
      status: 'idle',
      currentStep: 0,
      highlightedIndices: [],
      sortedPartition: 0,
      error: null,
      currentDescription: 'Ready to start heap sort visualization',
    });
  },

  setSpeed: (speed: number) => {
    set({ animationSpeed: speed });
  },

  setError: (error: string | null) => {
    set({ error });
  },
}));
