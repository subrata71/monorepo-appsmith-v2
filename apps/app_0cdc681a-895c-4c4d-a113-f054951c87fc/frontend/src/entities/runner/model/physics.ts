import type { RunnerState, RunnerConfig } from './types';
import type { InputState } from '@/shared/model/game-store';

// Default runner configuration
export const DEFAULT_RUNNER_CONFIG: RunnerConfig = {
  moveSpeed: 5,
  jumpForce: -12,
  gravity: 0.5,
  groundY: 300,
  maxX: 750,
  minX: 50,
};

// Initial runner state
export const createInitialRunnerState = (
  config: RunnerConfig = DEFAULT_RUNNER_CONFIG
): RunnerState => ({
  position: {
    x: 100,
    y: config.groundY,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  isJumping: false,
  isGrounded: true,
  width: 40,
  height: 40,
});

// Update runner physics based on input and time
export const updateRunnerPhysics = (
  runner: RunnerState,
  input: InputState,
  config: RunnerConfig = DEFAULT_RUNNER_CONFIG
): RunnerState => {
  const newState = { ...runner };

  // Horizontal movement
  let velocityX = 0;
  if (input.left && !input.right) {
    velocityX = -config.moveSpeed;
  } else if (input.right && !input.left) {
    velocityX = config.moveSpeed;
  }

  // Apply horizontal velocity
  newState.velocity.x = velocityX;
  newState.position.x += newState.velocity.x;

  // Constrain horizontal position
  newState.position.x = Math.max(
    config.minX,
    Math.min(config.maxX, newState.position.x)
  );

  // Jump logic
  if (input.jump && newState.isGrounded && !newState.isJumping) {
    newState.velocity.y = config.jumpForce;
    newState.isJumping = true;
    newState.isGrounded = false;
  }

  // Apply gravity
  if (!newState.isGrounded) {
    newState.velocity.y += config.gravity;
  }

  // Apply vertical velocity
  newState.position.y += newState.velocity.y;

  // Ground collision
  if (newState.position.y >= config.groundY) {
    newState.position.y = config.groundY;
    newState.velocity.y = 0;
    newState.isGrounded = true;
    newState.isJumping = false;
  } else {
    newState.isGrounded = false;
  }

  return newState;
};

// Check if runner is moving
export const isRunnerMoving = (runner: RunnerState): boolean => {
  return Math.abs(runner.velocity.x) > 0 || Math.abs(runner.velocity.y) > 0;
};
