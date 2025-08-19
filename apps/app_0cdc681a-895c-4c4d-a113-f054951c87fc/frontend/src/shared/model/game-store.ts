import { create } from 'zustand';

export interface RunnerPosition {
  x: number;
  y: number;
}

export interface Obstacle {
  id: string;
  position: {
    x: number;
    y: number;
  };
  velocity: {
    x: number;
    y: number;
  };
  width: number;
  height: number;
  type: 'basic' | 'tall' | 'wide';
}

export interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
}

export interface GameState {
  gameState: 'playing' | 'gameOver';
  score: number;
  runnerPosition: RunnerPosition;
  obstacles: Obstacle[];
  inputState: InputState;
}

export interface GameActions {
  startGame: () => void;
  endGame: () => void;
  updateScore: (score: number) => void;
  moveRunner: (position: RunnerPosition) => void;
  spawnObstacle: (obstacle: Obstacle) => void;
  updateObstacle: (id: string, updates: Partial<Obstacle>) => void;
  removeObstacle: (id: string) => void;
  setInput: (input: Partial<InputState>) => void;
  resetGame: () => void;
}

export type GameStore = GameState & GameActions;

const INITIAL_RUNNER_POSITION: RunnerPosition = { x: 100, y: 300 };
const INITIAL_INPUT_STATE: InputState = {
  left: false,
  right: false,
  jump: false,
};

export const useGameStore = create<GameStore>(set => ({
  // Initial state
  gameState: 'playing',
  score: 0,
  runnerPosition: INITIAL_RUNNER_POSITION,
  obstacles: [],
  inputState: INITIAL_INPUT_STATE,

  // Actions
  startGame: () => set({ gameState: 'playing' }),

  endGame: () => set({ gameState: 'gameOver' }),

  updateScore: (score: number) => set({ score }),

  moveRunner: (position: RunnerPosition) => set({ runnerPosition: position }),

  spawnObstacle: (obstacle: Obstacle) =>
    set(state => ({
      obstacles: [...state.obstacles, obstacle],
    })),

  updateObstacle: (id: string, updates: Partial<Obstacle>) =>
    set(state => ({
      obstacles: state.obstacles.map(obstacle =>
        obstacle.id === id ? { ...obstacle, ...updates } : obstacle
      ),
    })),

  removeObstacle: (id: string) =>
    set(state => ({
      obstacles: state.obstacles.filter(obstacle => obstacle.id !== id),
    })),

  setInput: (input: Partial<InputState>) =>
    set(state => ({
      inputState: { ...state.inputState, ...input },
    })),

  resetGame: () =>
    set({
      gameState: 'playing',
      score: 0,
      runnerPosition: INITIAL_RUNNER_POSITION,
      obstacles: [],
      inputState: INITIAL_INPUT_STATE,
    }),
}));
