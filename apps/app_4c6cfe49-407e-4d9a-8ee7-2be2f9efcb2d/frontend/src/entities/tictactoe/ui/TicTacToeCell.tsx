import React from 'react';
import { Button } from '@/shared/ui';
import type { CellProps } from '../model/types';

export const TicTacToeCell = React.memo<CellProps>(
  ({ value, onClick, disabled = false, index }) => {
    const handleClick = React.useCallback(() => {
      if (!disabled && !value && onClick) {
        onClick();
      }
    }, [disabled, value, onClick]);

    return (
      <Button
        variant="outline"
        size="icon"
        onClick={handleClick}
        disabled={disabled || Boolean(value)}
        className="h-16 w-16 text-2xl font-bold hover:bg-gray-50 border-gray-300"
        aria-label={`Cell ${index + 1}, ${value || 'empty'}`}
      >
        {value}
      </Button>
    );
  }
);
