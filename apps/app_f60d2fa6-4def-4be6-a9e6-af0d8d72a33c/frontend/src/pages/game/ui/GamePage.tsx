import React, { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import type { GameState } from '@/entities/game';
import { createInitialGameState } from '@/entities/game';
import { GameCanvasWidget, ScoreWidget, ControlsHintWidget } from '@/widgets';
import { NeonText, Button } from '@/shared/ui';

export const GamePage = React.memo(() => {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);

  const handleGameStateChange = useCallback((newGameState: GameState) => {
    setGameState(newGameState);
  }, []);

  const resetGame = useCallback(() => {
    setGameState(createInitialGameState());
  }, []);

  return (
    <>
      <Helmet>
        <title>DX Ball Game</title>
        <meta
          name="description"
          content="Classic DX Ball game - Break all the bricks with your paddle!"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <NeonText text="DX BALL" size="xl" className="mb-2" />
            <NeonText text="Classic Breakout Game" size="md" color="#ff8000" />
          </div>

          {/* Score Widget */}
          <div className="flex justify-center mb-6">
            <ScoreWidget
              score={gameState.score}
              lives={gameState.remainingLives}
              status={gameState.status}
            />
          </div>

          {/* Game Canvas */}
          <GameCanvasWidget
            gameState={gameState}
            onGameStateChange={handleGameStateChange}
          />

          {/* Game Over / Win Overlay */}
          {(gameState.status === 'gameOver' || gameState.status === 'won') && (
            <div className="flex justify-center mt-6">
              <div className="bg-black/90 border-2 border-cyan-400 rounded-lg p-8 text-center">
                <NeonText
                  text={
                    gameState.status === 'won'
                      ? 'CONGRATULATIONS!'
                      : 'GAME OVER'
                  }
                  size="xl"
                  color={gameState.status === 'won' ? '#80ff00' : '#ff0080'}
                  className="mb-4"
                />
                <NeonText
                  text={`Final Score: ${gameState.score.toString().padStart(6, '0')}`}
                  size="lg"
                  className="mb-6"
                />
                <Button
                  onClick={resetGame}
                  className="bg-cyan-600 hover:bg-cyan-700 text-black font-bold px-8 py-3 rounded-lg border-2 border-cyan-400 shadow-[0_0_15px_#00ffff]"
                >
                  <NeonText text="PLAY AGAIN" size="md" color="#000000" />
                </Button>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="mt-8">
            <ControlsHintWidget />
          </div>

          {/* Game Controls */}
          <div className="flex justify-center mt-6 space-x-4">
            {gameState.status === 'playing' && (
              <Button
                onClick={() =>
                  handleGameStateChange({ ...gameState, status: 'paused' })
                }
                className="bg-amber-600 hover:bg-amber-700 text-black font-bold px-6 py-2 rounded border-2 border-amber-400"
              >
                <NeonText text="PAUSE" size="sm" color="#000000" />
              </Button>
            )}

            {gameState.status === 'paused' && (
              <Button
                onClick={() =>
                  handleGameStateChange({ ...gameState, status: 'playing' })
                }
                className="bg-green-600 hover:bg-green-700 text-black font-bold px-6 py-2 rounded border-2 border-green-400"
              >
                <NeonText text="RESUME" size="sm" color="#000000" />
              </Button>
            )}

            <Button
              onClick={resetGame}
              className="bg-red-600 hover:bg-red-700 text-black font-bold px-6 py-2 rounded border-2 border-red-400"
            >
              <NeonText text="RESET" size="sm" color="#000000" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
});
