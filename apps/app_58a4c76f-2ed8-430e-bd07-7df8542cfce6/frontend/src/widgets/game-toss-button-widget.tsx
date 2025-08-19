import React, { useCallback, useState } from 'react';
import { Button } from '@/shared';

interface GameTossButtonWidgetProps {
  text?: string;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  fullWidth?: boolean;
  disabled?: boolean;
  onToss?: () => void;
  ariaLabel?: string;
}

export const GameTossButtonWidget = React.memo(
  ({
    text = 'TOSS!',
    size = 'lg',
    fullWidth = true,
    disabled = false,
    onToss,
    ariaLabel = 'Press to toss',
  }: GameTossButtonWidgetProps) => {
    const [isTossing, setIsTossing] = useState(false);

    const handleClick = useCallback(async () => {
      if (isTossing || disabled) return;

      setIsTossing(true);

      // Small delay for button feedback and to prevent rapid clicking
      setTimeout(() => {
        onToss?.();
        setIsTossing(false);
      }, 150);
    }, [isTossing, disabled, onToss]);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          handleClick();
        }
      },
      [handleClick]
    );

    return (
      <Button
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        size={size}
        variant="default"
        disabled={disabled || isTossing}
        className={`
          ${fullWidth ? 'w-full' : ''}
          text-2xl font-bold py-8 px-12 
          transform transition-all duration-150 
          hover:scale-105 active:scale-95
          shadow-lg hover:shadow-xl
          min-h-[120px]
        `}
        aria-label={ariaLabel}
        aria-pressed={isTossing}
      >
        {isTossing ? 'TOSSING...' : text}
      </Button>
    );
  }
);
