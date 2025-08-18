import React, { useRef, useEffect, useCallback, useMemo } from 'react';
import type { GameState } from '@/entities/game';
import { GAME_CONFIG } from '@/entities/game';
import { useAnimationFrame } from '@/shared/lib/hooks/useAnimationFrame';
import { useKeyboardControls } from '@/shared/lib/hooks/useKeyboardControls';
import { useMouseControls } from '@/shared/lib/hooks/useMouseControls';
import { renderGame } from '../lib/rendering';
import {
  updateBallPosition,
  checkWallCollisions,
  checkPaddleCollision,
  checkBrickCollisions,
  movePaddle,
  checkGameEnd,
} from '../lib/game-physics';

interface GameCanvasProps {
  gameState: GameState;
  onGameStateChange: (gameState: GameState) => void;
}

export const GameCanvas = React.memo<GameCanvasProps>(
  ({ gameState, onGameStateChange }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const moveLeft = useCallback(() => {
      if (gameState.status === 'playing') {
        onGameStateChange(movePaddle(gameState, 'left'));
      }
    }, [gameState, onGameStateChange]);

    const moveRight = useCallback(() => {
      if (gameState.status === 'playing') {
        onGameStateChange(movePaddle(gameState, 'right'));
      }
    }, [gameState, onGameStateChange]);

    const handleMouseMove = useCallback(
      (x: number) => {
        if (gameState.status === 'playing') {
          onGameStateChange(movePaddle(gameState, x));
        }
      },
      [gameState, onGameStateChange]
    );

    useKeyboardControls({
      onLeft: moveLeft,
      onRight: moveRight,
    });

    useMouseControls({
      canvasRef,
      onMove: handleMouseMove,
    });

    const gameLoop = useCallback(() => {
      if (gameState.status !== 'playing') return;

      let updatedState = gameState;
      updatedState = updateBallPosition(updatedState);
      updatedState = checkWallCollisions(updatedState);
      updatedState = checkPaddleCollision(updatedState);
      updatedState = checkBrickCollisions(updatedState);
      updatedState = checkGameEnd(updatedState);

      if (updatedState !== gameState) {
        onGameStateChange(updatedState);
      }
    }, [gameState, onGameStateChange]);

    useAnimationFrame(gameLoop, gameState.status === 'playing');

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      renderGame(ctx, gameState);
    }, [gameState]);

    const canvasStyle = useMemo(
      () => ({
        border: '2px solid #00ffff',
        borderRadius: '4px',
        backgroundColor: '#0a0a0a',
        display: 'block',
        cursor: 'none',
      }),
      []
    );

    return (
      <canvas
        ref={canvasRef}
        width={GAME_CONFIG.canvasWidth}
        height={GAME_CONFIG.canvasHeight}
        style={canvasStyle}
      />
    );
  }
);
