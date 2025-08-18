export type {
  GameState,
  Ball,
  Paddle,
  Brick,
  GameStatus,
  GameConfig,
} from './model/types';
export { GAME_CONFIG, COLORS } from './model/constants';
export {
  createInitialGameState,
  createInitialBall,
  createInitialPaddle,
  createInitialBricks,
} from './model/game-factory';
