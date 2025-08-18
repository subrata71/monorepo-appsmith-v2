import { useEffect, useCallback } from 'react';
import { GameTile } from './GameTile';
import { useMakeMove } from '@/entities/game';
import type { Direction } from '@/entities/game';
import { useGameStore } from '../model/gameStore';

interface GameGridProps {
  grid: number[][];
  gameId: string;
  gameStatus: 'playing' | 'won' | 'lost';
}

export function GameGrid({ grid, gameId, gameStatus }: GameGridProps) {
  const makeMove = useMakeMove();
  const isPlaying = useGameStore(state => state.isPlaying);

  const handleMove = useCallback((direction: Direction) => {
    if (gameStatus !== 'playing' || !isPlaying) return;
    makeMove.mutate({ id: gameId, direction });
  }, [gameId, gameStatus, isPlaying, makeMove]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (gameStatus !== 'playing' || !isPlaying) return;
    
    event.preventDefault();
    switch (event.key) {
      case 'ArrowUp':
        handleMove('up');
        break;
      case 'ArrowDown':
        handleMove('down');
        break;
      case 'ArrowLeft':
        handleMove('left');
        break;
      case 'ArrowRight':
        handleMove('right');
        break;
    }
  }, [handleMove, gameStatus, isPlaying]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Touch handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    const startX = e.touches[0].clientX;
    const startY = e.touches[0].clientY;

    const handleTouchEnd = (endEvent: TouchEvent) => {
      const endX = endEvent.changedTouches[0].clientX;
      const endY = endEvent.changedTouches[0].clientY;
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const minSwipeDistance = 50;

      if (Math.abs(deltaX) > minSwipeDistance || Math.abs(deltaY) > minSwipeDistance) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          handleMove(deltaX > 0 ? 'right' : 'left');
        } else {
          handleMove(deltaY > 0 ? 'down' : 'up');
        }
      }

      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div 
      className="grid grid-cols-4 gap-2 p-4 bg-gray-300 rounded-lg shadow-lg max-w-md mx-auto"
      onTouchStart={handleTouchStart}
    >
      {grid.flat().map((value, index) => (
        <GameTile
          key={index}
          value={value}
          className="aspect-square text-xl md:text-2xl"
        />
      ))}
    </div>
  );
}