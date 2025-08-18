export interface Ball {
  x: number;
  y: number;
  radius: number;
  velocityX: number;
  velocityY: number;
  color: string;
}

export interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface Brick {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  destroyed: boolean;
}

export type GameStatus = 'playing' | 'paused' | 'gameOver' | 'won';

export interface GameState {
  score: number;
  bricks: Brick[];
  paddle: Paddle;
  ball: Ball;
  status: GameStatus;
  remainingLives: number;
}

export interface GameConfig {
  canvasWidth: number;
  canvasHeight: number;
  paddleSpeed: number;
  ballSpeed: number;
  brickRows: number;
  brickCols: number;
  brickWidth: number;
  brickHeight: number;
  brickPadding: number;
  brickOffsetTop: number;
  brickOffsetLeft: number;
  lives: number;
}
