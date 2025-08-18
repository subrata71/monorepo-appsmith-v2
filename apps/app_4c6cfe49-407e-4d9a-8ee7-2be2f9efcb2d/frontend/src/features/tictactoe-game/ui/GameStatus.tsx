import React from 'react';
import type { GameStatus, Player } from '@/entities/tictactoe';

interface GameStatusProps {
  status: GameStatus;
  currentPlayer: Player;
  winner: Player | null;
}

export const GameStatus = React.memo<GameStatusProps>(
  ({ status, currentPlayer }) => {
    const getStatusMessage = React.useMemo(() => {
      switch (status) {
        case 'playing':
          return `Current Player: ${currentPlayer}`;
        case 'X-wins':
          return 'Player X wins! 🎉';
        case 'O-wins':
          return 'Player O wins! 🎉';
        case 'draw':
          return "It's a draw! 🤝";
        default:
          return `Current Player: ${currentPlayer}`;
      }
    }, [status, currentPlayer]);

    const getStatusColor = React.useMemo(() => {
      switch (status) {
        case 'X-wins':
        case 'O-wins':
          return 'text-green-600 font-bold';
        case 'draw':
          return 'text-yellow-600 font-bold';
        default:
          return 'text-gray-700';
      }
    }, [status]);

    return (
      <div className="text-center space-y-2">
        <h2 className={`text-xl ${getStatusColor}`}>{getStatusMessage}</h2>
        {status === 'playing' && (
          <p className="text-gray-500 text-sm">
            Click on an empty cell to place your {currentPlayer}
          </p>
        )}
      </div>
    );
  }
);
