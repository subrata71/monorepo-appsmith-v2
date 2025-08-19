import { describe, expect, it } from 'vitest';
import {
  checkRectangleCollision,
  runnerToRectangle,
  obstacleToRectangle,
  checkRunnerObstacleCollision,
} from './collision';
import type { RunnerState } from '@/entities/runner';
import type { Obstacle } from '@/shared/model/game-store';

describe('collision detection', () => {
  describe('checkRectangleCollision', () => {
    it('should detect collision when rectangles overlap', () => {
      const rectA = { x: 10, y: 10, width: 50, height: 50 };
      const rectB = { x: 30, y: 30, width: 40, height: 40 };

      expect(checkRectangleCollision(rectA, rectB)).toBe(true);
    });

    it('should not detect collision when rectangles do not overlap', () => {
      const rectA = { x: 10, y: 10, width: 50, height: 50 };
      const rectB = { x: 100, y: 100, width: 40, height: 40 };

      expect(checkRectangleCollision(rectA, rectB)).toBe(false);
    });

    it('should not detect collision when rectangles are adjacent but not overlapping', () => {
      const rectA = { x: 10, y: 10, width: 50, height: 50 };
      const rectB = { x: 60, y: 10, width: 40, height: 40 };

      expect(checkRectangleCollision(rectA, rectB)).toBe(false);
    });
  });

  describe('runnerToRectangle', () => {
    it('should convert runner state to collision rectangle', () => {
      const runner: RunnerState = {
        position: { x: 100, y: 300 },
        velocity: { x: 0, y: 0 },
        isJumping: false,
        isGrounded: true,
        width: 40,
        height: 40,
      };

      const rect = runnerToRectangle(runner);

      expect(rect).toEqual({
        x: 100,
        y: 260, // y position minus height (300 - 40)
        width: 40,
        height: 40,
      });
    });
  });

  describe('obstacleToRectangle', () => {
    it('should convert obstacle to collision rectangle', () => {
      const obstacle: Obstacle = {
        id: 'test-1',
        position: { x: 200, y: 250 },
        velocity: { x: -3, y: 0 },
        width: 30,
        height: 50,
        type: 'basic',
      };

      const rect = obstacleToRectangle(obstacle);

      expect(rect).toEqual({
        x: 200,
        y: 250,
        width: 30,
        height: 50,
      });
    });
  });

  describe('checkRunnerObstacleCollision', () => {
    const runner: RunnerState = {
      position: { x: 100, y: 300 },
      velocity: { x: 0, y: 0 },
      isJumping: false,
      isGrounded: true,
      width: 40,
      height: 40,
    };

    it('should detect collision when runner overlaps with obstacle', () => {
      const obstacles: Obstacle[] = [
        {
          id: 'test-1',
          position: { x: 120, y: 280 }, // Overlaps with runner
          velocity: { x: -3, y: 0 },
          width: 30,
          height: 50,
          type: 'basic',
        },
      ];

      expect(checkRunnerObstacleCollision(runner, obstacles)).toBe(true);
    });

    it('should not detect collision when runner does not overlap with obstacles', () => {
      const obstacles: Obstacle[] = [
        {
          id: 'test-1',
          position: { x: 200, y: 250 }, // Far from runner
          velocity: { x: -3, y: 0 },
          width: 30,
          height: 50,
          type: 'basic',
        },
      ];

      expect(checkRunnerObstacleCollision(runner, obstacles)).toBe(false);
    });

    it('should detect collision with any obstacle in array', () => {
      const obstacles: Obstacle[] = [
        {
          id: 'test-1',
          position: { x: 200, y: 250 }, // No overlap
          velocity: { x: -3, y: 0 },
          width: 30,
          height: 50,
          type: 'basic',
        },
        {
          id: 'test-2',
          position: { x: 120, y: 280 }, // Overlaps with runner
          velocity: { x: -3, y: 0 },
          width: 30,
          height: 50,
          type: 'basic',
        },
      ];

      expect(checkRunnerObstacleCollision(runner, obstacles)).toBe(true);
    });

    it('should return false for empty obstacles array', () => {
      expect(checkRunnerObstacleCollision(runner, [])).toBe(false);
    });
  });
});
