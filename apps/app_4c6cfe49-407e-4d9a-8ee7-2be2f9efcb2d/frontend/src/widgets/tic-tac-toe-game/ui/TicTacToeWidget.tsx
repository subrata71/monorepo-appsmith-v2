import React from 'react';
import { TicTacToeBoard } from '@/entities/tictactoe';
import { useTicTacToeGameStore, GameStatus, ResetGame } from '@/features';
import { Container } from '@/shared/ui';

export const TicTacToeWidget = React.memo(() => {
  // Use store state following Zustand individual value selection pattern
  const board = useTicTacToeGameStore(state => state.game.board);
  const currentPlayer = useTicTacToeGameStore(state => state.game.currentPlayer);
  const status = useTicTacToeGameStore(state => state.game.status);
  const winner = useTicTacToeGameStore(state => state.game.winner);
  const makeMove = useTicTacToeGameStore(state => state.makeMove);
  const resetGame = useTicTacToeGameStore(state => state.resetGame);

  const handleCellClick = React.useCallback((index: number) => {
    makeMove(index);
  }, [makeMove]);

  const handleReset = React.useCallback(() => {
    resetGame();
  }, [resetGame]);

  const isBoardDisabled = React.useMemo(() => {
    return status !== 'playing';
  }, [status]);

  return (
    <Container className="py-8">
      <div className="flex flex-col items-center space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">TicTacToe Game</h1>
        </div>

        <GameStatus
          status={status}
          currentPlayer={currentPlayer}
          winner={winner}
        />

        <TicTacToeBoard 
          board={board} 
          onCellClick={handleCellClick}
          disabled={isBoardDisabled}
        />

        <ResetGame onReset={handleReset} />
      </div>
    </Container>
  );
});
