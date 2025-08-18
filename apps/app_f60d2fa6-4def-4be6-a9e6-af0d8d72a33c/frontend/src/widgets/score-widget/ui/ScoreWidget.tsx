import React, { useMemo } from 'react';
import { NeonText } from '@/shared/ui';

interface ScoreWidgetProps {
  score: number;
  lives: number;
  status: string;
}

export const ScoreWidget = React.memo<ScoreWidgetProps>(
  ({ score, lives, status }) => {
    const gameStatusText = useMemo(() => {
      switch (status) {
        case 'gameOver':
          return 'GAME OVER';
        case 'won':
          return 'YOU WIN!';
        case 'paused':
          return 'PAUSED';
        default:
          return 'PLAYING';
      }
    }, [status]);

    return (
      <div className="flex flex-col items-center space-y-4 p-6 bg-black/80 rounded-lg border-2 border-cyan-400">
        <div className="flex items-center space-x-8">
          <div className="text-center">
            <NeonText text="SCORE" size="sm" />
            <NeonText text={score.toString().padStart(6, '0')} size="lg" />
          </div>

          <div className="text-center">
            <NeonText text="LIVES" size="sm" />
            <div className="flex justify-center space-x-1 mt-2">
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full border ${
                    i < lives
                      ? 'bg-cyan-400 border-cyan-400 shadow-[0_0_10px_#00ffff]'
                      : 'border-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            <NeonText text="STATUS" size="sm" />
            <NeonText
              text={gameStatusText}
              size="md"
              color={
                status === 'gameOver'
                  ? '#ff0080'
                  : status === 'won'
                    ? '#80ff00'
                    : '#00ffff'
              }
            />
          </div>
        </div>
      </div>
    );
  }
);
