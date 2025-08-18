import type { GameState, Ball, Paddle, Brick } from './types';
import { GAME_CONFIG, COLORS } from './constants';

export const createInitialBall = (): Ball => ({
  x: GAME_CONFIG.canvasWidth / 2,
  y: GAME_CONFIG.canvasHeight - 30,
  radius: 10,
  velocityX: GAME_CONFIG.ballSpeed,
  velocityY: -GAME_CONFIG.ballSpeed,
  color: COLORS.ball,
});

export const createInitialPaddle = (): Paddle => ({
  x: (GAME_CONFIG.canvasWidth - 100) / 2,
  y: GAME_CONFIG.canvasHeight - 20,
  width: 100,
  height: 10,
  color: COLORS.paddle,
});

export const createInitialBricks = (): Brick[] => {
  const bricks: Brick[] = [];

  for (let row = 0; row < GAME_CONFIG.brickRows; row++) {
    for (let col = 0; col < GAME_CONFIG.brickCols; col++) {
      const brickX =
        col * (GAME_CONFIG.brickWidth + GAME_CONFIG.brickPadding) +
        GAME_CONFIG.brickOffsetLeft;
      const brickY =
        row * (GAME_CONFIG.brickHeight + GAME_CONFIG.brickPadding) +
        GAME_CONFIG.brickOffsetTop;

      bricks.push({
        id: `brick-${row}-${col}`,
        x: brickX,
        y: brickY,
        width: GAME_CONFIG.brickWidth,
        height: GAME_CONFIG.brickHeight,
        color: COLORS.bricks[row % COLORS.bricks.length],
        destroyed: false,
      });
    }
  }

  return bricks;
};

export const createInitialGameState = (): GameState => ({
  score: 0,
  bricks: createInitialBricks(),
  paddle: createInitialPaddle(),
  ball: createInitialBall(),
  status: 'playing',
  remainingLives: GAME_CONFIG.lives,
});
