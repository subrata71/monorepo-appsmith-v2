import type { GameConfig } from './types';

export const GAME_CONFIG: GameConfig = {
  canvasWidth: 800,
  canvasHeight: 600,
  paddleSpeed: 8,
  ballSpeed: 5,
  brickRows: 5,
  brickCols: 10,
  brickWidth: 70,
  brickHeight: 20,
  brickPadding: 10,
  brickOffsetTop: 60,
  brickOffsetLeft: 35,
  lives: 3,
};

export const COLORS = {
  background: '#0a0a0a',
  paddle: '#00ffff',
  ball: '#ffffff',
  bricks: [
    '#ff0080', // Pink
    '#ff8000', // Orange
    '#ffff00', // Yellow
    '#80ff00', // Green
    '#0080ff', // Blue
  ],
  text: '#00ffff',
  border: '#333333',
} as const;
