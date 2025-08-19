import React, { useCallback, useEffect, useState } from 'react';
import {
  useGameStore,
  useKeyboardInput,
  useGameLoop,
  GAME_CONFIG,
} from '@/shared';
import {
  Runner,
  updateRunnerPhysics,
  createInitialRunnerState,
  DEFAULT_RUNNER_CONFIG,
  Obstacle,
  updateObstaclePhysics,
  shouldRemoveObstacle,
} from '@/entities';
import { useObstacleSpawner, useCollisionDetection } from '@/features';
import { normalizeDeltaTime } from '@/shared/lib/game-loop';

export const MainGameArea: React.FC = React.memo(() => {
  const gameState = useGameStore(state => state.gameState);
  const inputState = useGameStore(state => state.inputState);
  const obstacles = useGameStore(state => state.obstacles);
  const score = useGameStore(state => state.score);
  const setInput = useGameStore(state => state.setInput);
  const spawnObstacle = useGameStore(state => state.spawnObstacle);
  const updateObstacle = useGameStore(state => state.updateObstacle);
  const removeObstacle = useGameStore(state => state.removeObstacle);
  const updateScore = useGameStore(state => state.updateScore);
  const endGame = useGameStore(state => state.endGame);

  // Local runner state for physics calculations
  const [runnerState, setRunnerState] = useState(() =>
    createInitialRunnerState(DEFAULT_RUNNER_CONFIG)
  );

  // Score tracking with timer
  const [lastScoreUpdate, setLastScoreUpdate] = useState(() =>
    performance.now()
  );

  // Handle keyboard input
  useKeyboardInput({
    onInput: useCallback(
      input => {
        setInput(input);
      },
      [setInput]
    ),
  });

  // Obstacle spawning
  const { updateSpawner } = useObstacleSpawner({
    isActive: gameState === 'playing',
    onSpawn: useCallback(
      obstacle => {
        spawnObstacle(obstacle);
      },
      [spawnObstacle]
    ),
  });

  // Collision detection
  useCollisionDetection({
    runner: runnerState,
    obstacles,
    isActive: gameState === 'playing',
    onCollision: useCallback(() => {
      endGame();
    }, [endGame]),
  });

  // Game loop for physics updates
  useGameLoop({
    isRunning: gameState === 'playing',
    onTick: useCallback(
      (deltaTime: number) => {
        const normalizedDelta = normalizeDeltaTime(deltaTime);
        const currentTime = performance.now();

        // Update runner physics
        setRunnerState(currentState =>
          updateRunnerPhysics(currentState, inputState, DEFAULT_RUNNER_CONFIG)
        );

        // Update obstacle spawner
        updateSpawner(currentTime);

        // Update obstacle physics and remove off-screen obstacles
        const obstaclesToRemove: string[] = [];

        obstacles.forEach(obstacle => {
          const updatedObstacle = updateObstaclePhysics(
            obstacle,
            normalizedDelta
          );

          if (shouldRemoveObstacle(updatedObstacle)) {
            obstaclesToRemove.push(obstacle.id);
          } else if (updatedObstacle.position.x !== obstacle.position.x) {
            // Update obstacle position in store
            updateObstacle(obstacle.id, {
              position: {
                x: updatedObstacle.position.x,
                y: updatedObstacle.position.y,
              },
            });
          }
        });

        // Remove off-screen obstacles
        obstaclesToRemove.forEach(id => removeObstacle(id));

        // Update score (increment by 1 every 100ms)
        if (currentTime - lastScoreUpdate >= 100) {
          updateScore(score + 1);
          setLastScoreUpdate(currentTime);
        }
      },
      [
        inputState,
        updateSpawner,
        obstacles,
        removeObstacle,
        updateObstacle,
        score,
        updateScore,
        lastScoreUpdate,
        setLastScoreUpdate,
      ]
    ),
  });

  // Reset score timer when game starts
  useEffect(() => {
    if (gameState === 'playing') {
      setLastScoreUpdate(performance.now());
    }
  }, [gameState]);

  // Focus the game area on mount for keyboard events
  const gameAreaRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameAreaRef.current) {
      gameAreaRef.current.focus();
    }
  }, []);

  return (
    <div
      ref={gameAreaRef}
      className="relative bg-gradient-to-b from-sky-300 to-green-300 border-2 border-gray-300 focus:outline-none"
      style={{
        width: `${GAME_CONFIG.WIDTH}px`,
        height: `${GAME_CONFIG.HEIGHT}px`,
      }}
      tabIndex={0}
    >
      {/* Ground line */}
      <div
        className="absolute bg-green-600 w-full h-2"
        style={{
          top: `${GAME_CONFIG.GROUND_Y}px`,
        }}
      />

      {/* Runner */}
      <Runner runner={runnerState} />

      {/* Obstacles */}
      {obstacles.map(obstacle => (
        <Obstacle key={obstacle.id} obstacle={obstacle} />
      ))}

      {/* Game instructions overlay */}
      <div className="absolute top-4 left-4 text-sm text-gray-700 bg-white/80 rounded p-2">
        <div>Use ← → or A/D to move</div>
        <div>Use ↑ or Space/W to jump</div>
      </div>

      {/* Debug info (can be removed later) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 right-4 text-xs text-gray-700 bg-white/80 rounded p-2 font-mono">
          <div>Runner X: {Math.round(runnerState.position.x)}</div>
          <div>Runner Y: {Math.round(runnerState.position.y)}</div>
          <div>Grounded: {runnerState.isGrounded ? 'Yes' : 'No'}</div>
          <div>Jumping: {runnerState.isJumping ? 'Yes' : 'No'}</div>
          <div>Obstacles: {obstacles.length}</div>
        </div>
      )}
    </div>
  );
});

MainGameArea.displayName = 'MainGameArea';
