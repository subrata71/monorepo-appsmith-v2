import type { ObstacleState, ObstacleConfig } from './types';

// Default obstacle configuration
export const DEFAULT_OBSTACLE_CONFIG: ObstacleConfig = {
  speed: 3,
  spawnX: 850, // Spawn off-screen to the right
  groundY: 300, // Match runner's ground level
  types: {
    basic: { width: 30, height: 50 },
    tall: { width: 25, height: 80 },
    wide: { width: 50, height: 40 },
  },
};

// Create a new obstacle
export const createObstacle = (
  id: string,
  type: ObstacleState['type'] = 'basic',
  config: ObstacleConfig = DEFAULT_OBSTACLE_CONFIG
): ObstacleState => {
  const dimensions = config.types[type];

  return {
    id,
    position: {
      x: config.spawnX,
      y: config.groundY - dimensions.height, // Position bottom of obstacle on ground
    },
    velocity: {
      x: -config.speed, // Move left towards runner
      y: 0,
    },
    width: dimensions.width,
    height: dimensions.height,
    type,
  };
};

// Update obstacle physics (movement)
export const updateObstaclePhysics = (
  obstacle: ObstacleState,
  deltaTime: number = 1
): ObstacleState => {
  const newState = { ...obstacle };

  // Apply horizontal movement
  newState.position.x += newState.velocity.x * deltaTime;

  return newState;
};

// Check if obstacle should be removed (off-screen to the left)
export const shouldRemoveObstacle = (obstacle: ObstacleState): boolean => {
  return obstacle.position.x + obstacle.width < -50; // Remove when completely off-screen
};

// Generate random obstacle type
export const getRandomObstacleType = (): ObstacleState['type'] => {
  const types: ObstacleState['type'][] = ['basic', 'tall', 'wide'];
  return types[Math.floor(Math.random() * types.length)];
};
