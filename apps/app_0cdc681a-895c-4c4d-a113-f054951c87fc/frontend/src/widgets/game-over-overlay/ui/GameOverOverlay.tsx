import React from 'react';
import { Button } from '@/shared/ui';

export interface GameOverOverlayProps {
  visible: boolean;
  onRestart: () => void;
  score?: number;
}

export const GameOverOverlay: React.FC<GameOverOverlayProps> = ({
  visible,
  onRestart,
  score = 0,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
      <div className="bg-white rounded-lg p-8 text-center shadow-2xl max-w-sm w-full mx-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Over!</h2>

        {score > 0 && (
          <p className="text-lg text-gray-600 mb-6">
            Final Score:{' '}
            <span className="font-bold text-blue-600">{score}</span>
          </p>
        )}

        <Button
          onClick={onRestart}
          className="w-full py-3 text-lg font-semibold"
        >
          Play Again
        </Button>

        <p className="text-sm text-gray-500 mt-4">
          Use arrow keys or WASD to play
        </p>
      </div>
    </div>
  );
};
