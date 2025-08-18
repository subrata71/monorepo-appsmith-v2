import React from 'react';
import type { GameState } from '@/entities/game';
import { GameCanvas } from '@/features/game-canvas';

interface GameCanvasWidgetProps {
  gameState: GameState;
  onGameStateChange: (gameState: GameState) => void;
}

export const GameCanvasWidget = React.memo<GameCanvasWidgetProps>(
  ({ gameState, onGameStateChange }) => {
    return (
      <div className="flex justify-center items-center p-4">
        <GameCanvas
          gameState={gameState}
          onGameStateChange={onGameStateChange}
        />
      </div>
    );
  }
);
