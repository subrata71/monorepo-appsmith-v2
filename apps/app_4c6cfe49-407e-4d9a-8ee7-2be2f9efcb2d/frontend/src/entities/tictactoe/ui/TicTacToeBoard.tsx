import React from 'react';
import { TicTacToeCell } from './TicTacToeCell';
import type { BoardProps } from '../model/types';

export const TicTacToeBoard = React.memo<BoardProps>(
  ({ board, onCellClick, disabled = false }) => {
    const handleCellClick = React.useCallback(
      (index: number) => {
        if (onCellClick) {
          onCellClick(index);
        }
      },
      [onCellClick]
    );

    return (
      <div
        className="grid grid-cols-3 gap-2 p-4 bg-white rounded-lg border border-gray-200 shadow-sm w-fit mx-auto"
        role="grid"
        aria-label="TicTacToe game board"
      >
        {board.map((cellValue, index) => (
          <TicTacToeCell
            key={index}
            value={cellValue}
            onClick={() => handleCellClick(index)}
            disabled={disabled}
            index={index}
          />
        ))}
      </div>
    );
  }
);
