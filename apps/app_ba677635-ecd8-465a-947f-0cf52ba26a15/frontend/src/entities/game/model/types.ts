export interface Game {
  id: string;
  grid: number[][];
  score: number;
  bestScore: number;
  status: 'playing' | 'won' | 'lost';
  createdAt: string;
  updatedAt: string;
}

export interface NewGame {
  grid: number[][];
  score: number;
  bestScore: number;
  status: 'playing' | 'won' | 'lost';
}

export type Direction = 'up' | 'down' | 'left' | 'right';