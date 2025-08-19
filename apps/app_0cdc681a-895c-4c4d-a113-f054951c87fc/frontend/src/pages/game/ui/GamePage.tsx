import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MainGameArea, GameOverOverlay, ScoreSection } from '@/widgets';
import { useGameStore } from '@/shared';

export const GamePage: React.FC = () => {
  const gameState = useGameStore(state => state.gameState);
  const score = useGameStore(state => state.score);
  const resetGame = useGameStore(state => state.resetGame);

  return (
    <>
      <Helmet>
        <title>Runner Game</title>
      </Helmet>

      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Runner Game</h1>
          <p className="text-gray-600 text-lg">
            Use arrow keys or WASD to move and jump. Avoid obstacles and collect
            points!
          </p>
        </div>

        <div className="relative">
          <MainGameArea />
          <ScoreSection score={score} />
          <GameOverOverlay
            visible={gameState === 'gameOver'}
            onRestart={resetGame}
            score={score}
          />
        </div>

        <div className="mt-6 text-center text-sm text-gray-500 max-w-md">
          <p className="mb-2">
            <strong>Controls:</strong>
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>← → or A/D: Move left/right</div>
            <div>↑ or Space/W: Jump</div>
          </div>
        </div>
      </div>
    </>
  );
};
