export interface Stopwatch {
  id: string;
  elapsedTime: number; // in milliseconds
  isRunning: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StopwatchState {
  elapsedTime: number; // in milliseconds
  isRunning: boolean;
}

export interface StopwatchActions {
  start: () => void;
  stop: () => void;
  reset: () => void;
  tick: () => void;
}

export interface StopwatchStore extends StopwatchState, StopwatchActions {}
