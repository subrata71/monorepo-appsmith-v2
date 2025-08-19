import type { RunnerState } from '@/entities/runner';
import type { Obstacle } from '@/shared/model/game-store';

/**
 * Rectangle collision detection using AABB (Axis-Aligned Bounding Box)
 */
export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Check if two rectangles are colliding
 */
export const checkRectangleCollision = (
  rectA: Rectangle,
  rectB: Rectangle
): boolean => {
  return (
    rectA.x < rectB.x + rectB.width &&
    rectA.x + rectA.width > rectB.x &&
    rectA.y < rectB.y + rectB.height &&
    rectA.y + rectA.height > rectB.y
  );
};

/**
 * Convert runner state to rectangle for collision detection
 */
export const runnerToRectangle = (runner: RunnerState): Rectangle => ({
  x: runner.position.x,
  y: runner.position.y - runner.height, // Runner position is bottom-center, adjust to top-left
  width: runner.width,
  height: runner.height,
});

/**
 * Convert obstacle to rectangle for collision detection
 */
export const obstacleToRectangle = (obstacle: Obstacle): Rectangle => ({
  x: obstacle.position.x,
  y: obstacle.position.y,
  width: obstacle.width,
  height: obstacle.height,
});

/**
 * Check if runner is colliding with any obstacle
 */
export const checkRunnerObstacleCollision = (
  runner: RunnerState,
  obstacles: Obstacle[]
): boolean => {
  const runnerRect = runnerToRectangle(runner);

  return obstacles.some(obstacle => {
    const obstacleRect = obstacleToRectangle(obstacle);
    return checkRectangleCollision(runnerRect, obstacleRect);
  });
};
