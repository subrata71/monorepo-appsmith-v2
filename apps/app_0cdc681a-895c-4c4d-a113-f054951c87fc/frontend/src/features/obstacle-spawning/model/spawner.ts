import {
  createObstacle,
  getRandomObstacleType,
  DEFAULT_OBSTACLE_CONFIG,
} from '@/entities';
import type { ObstacleState } from '@/entities';

export interface ObstacleSpawnerConfig {
  minSpawnInterval: number; // Minimum time between spawns (ms)
  maxSpawnInterval: number; // Maximum time between spawns (ms)
  initialDelay: number; // Initial delay before first spawn (ms)
}

export const DEFAULT_SPAWNER_CONFIG: ObstacleSpawnerConfig = {
  minSpawnInterval: 2000, // 2 seconds
  maxSpawnInterval: 4000, // 4 seconds
  initialDelay: 3000, // 3 seconds
};

export class ObstacleSpawner {
  private config: ObstacleSpawnerConfig;
  private lastSpawnTime: number = 0;
  private nextSpawnTime: number = 0;
  private obstacleIdCounter: number = 0;
  private isActive: boolean = false;

  constructor(config: ObstacleSpawnerConfig = DEFAULT_SPAWNER_CONFIG) {
    this.config = config;
    this.reset();
  }

  // Start the spawner
  start(): void {
    this.isActive = true;
    this.lastSpawnTime = performance.now();
    this.scheduleNextSpawn();
  }

  // Stop the spawner
  stop(): void {
    this.isActive = false;
  }

  // Reset spawner state
  reset(): void {
    this.lastSpawnTime = 0;
    this.nextSpawnTime = 0;
    this.obstacleIdCounter = 0;
    this.isActive = false;
  }

  // Check if it's time to spawn and return a new obstacle if so
  update(currentTime: number): ObstacleState | null {
    if (!this.isActive) {
      return null;
    }

    if (currentTime >= this.nextSpawnTime) {
      const obstacle = this.spawnObstacle();
      this.scheduleNextSpawn();
      return obstacle;
    }

    return null;
  }

  // Create a new obstacle
  private spawnObstacle(): ObstacleState {
    this.obstacleIdCounter++;
    const obstacleId = `obstacle_${this.obstacleIdCounter}_${Date.now()}`;
    const obstacleType = getRandomObstacleType();

    return createObstacle(obstacleId, obstacleType, DEFAULT_OBSTACLE_CONFIG);
  }

  // Schedule the next spawn time
  private scheduleNextSpawn(): void {
    const currentTime = performance.now();
    const spawnInterval = this.getRandomSpawnInterval();

    this.lastSpawnTime = currentTime;
    this.nextSpawnTime = currentTime + spawnInterval;
  }

  // Get a random spawn interval within the configured range
  private getRandomSpawnInterval(): number {
    return (
      Math.random() *
        (this.config.maxSpawnInterval - this.config.minSpawnInterval) +
      this.config.minSpawnInterval
    );
  }

  // Get time until next spawn (for debugging)
  getTimeUntilNextSpawn(currentTime: number): number {
    return Math.max(0, this.nextSpawnTime - currentTime);
  }
}
