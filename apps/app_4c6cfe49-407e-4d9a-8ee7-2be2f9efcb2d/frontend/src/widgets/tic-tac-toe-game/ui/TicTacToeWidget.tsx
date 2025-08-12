import React from 'react';
import { TicTacToeBoard } from '@/entities/tictactoe';
import { Container } from '@/shared/ui';
import type { GameBoard } from '@/entities/tictactoe';

export const TicTacToeWidget = React.memo(() => {
  // Initialize empty board - all cells empty
  const initialBoard: GameBoard = React.useMemo(
    () => ['', '', '', '', '', '', '', '', ''],
    []
  );

  const [board] = React.useState<GameBoard>(initialBoard);

  const handleCellClick = React.useCallback((index: number) => {
    // For now, just log the cell click - game logic will be added in future sub-items
    console.log(`Cell ${index} clicked`);
  }, []);

  return (
    <Container className="py-8">
      <div className="flex flex-col items-center space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">TicTacToe Game</h1>
          <p className="text-gray-600">Click on any cell to start playing</p>
        </div>

        <TicTacToeBoard board={board} onCellClick={handleCellClick} />

        <div className="text-center text-sm text-gray-500">
          Game grid ready - game logic coming soon!
        </div>
      </div>
    </Container>
  );
});
