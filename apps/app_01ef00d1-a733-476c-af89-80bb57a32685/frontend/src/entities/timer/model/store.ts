import { create } from 'zustand';
import type { Timer } from '@app/shared/api-types';

/**
 * Timer State Interface
 * Manages the state of the Pomodoro timer
 */
interface TimerState {
  timer: Timer | null;
  loading: boolean;
  error: string | null;
}

/**
 * Timer Actions Interface
 * Defines all actions that can be performed on the timer
 */
interface TimerActions {
  initializeTimer: (initialSeconds?: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  tick: () => void;
  resetTimer: () => void;
  setError: (error: string) => void;
  clearError: () => void;
}

/**
 * Timer Store Type
 * Combines state and actions
 */
type TimerStore = TimerState & TimerActions;

/**
 * Default Timer Configuration
 */
const DEFAULT_POMODORO_SECONDS = 25 * 60; // 25 minutes

/**
 * Create a default timer
 */
const createDefaultTimer = (initialSeconds = DEFAULT_POMODORO_SECONDS): Timer => ({
  id: 'default-timer',
  currentSeconds: initialSeconds,
  status: 'idle',
  initialSeconds: initialSeconds,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

/**
 * Timer Store
 * Zustand store for managing Pomodoro timer state
 */
export const useTimerStore = create<TimerStore>((set, get) => ({
  // Initial state
  timer: createDefaultTimer(),
  loading: false,
  error: null,

  // Actions
  initializeTimer: (initialSeconds = DEFAULT_POMODORO_SECONDS) => {
    set({
      timer: createDefaultTimer(initialSeconds),
      loading: false,
      error: null,
    });
  },

  startTimer: () => {
    const { timer } = get();
    if (!timer) return;

    set({
      timer: {
        ...timer,
        status: 'running',
        updatedAt: new Date().toISOString(),
      },
    });
  },

  pauseTimer: () => {
    const { timer } = get();
    if (!timer) return;

    set({
      timer: {
        ...timer,
        status: 'paused',
        updatedAt: new Date().toISOString(),
      },
    });
  },

  tick: () => {
    const { timer } = get();
    if (!timer || timer.status !== 'running' || timer.currentSeconds <= 0) return;

    set({
      timer: {
        ...timer,
        currentSeconds: timer.currentSeconds - 1,
        updatedAt: new Date().toISOString(),
      },
    });
  },

  resetTimer: () => {
    const { timer } = get();
    if (!timer) return;

    set({
      timer: {
        ...timer,
        currentSeconds: timer.initialSeconds,
        status: 'idle',
        updatedAt: new Date().toISOString(),
      },
    });
  },

  setError: (error: string) => {
    set({ error, loading: false });
  },

  clearError: () => {
    set({ error: null });
  },
}));