import { memo, useCallback } from 'react';
import { Button } from '@/shared/ui';
import { useRouletteStore } from '@/entities/roulette';

interface SpinControlProps {
  className?: string;
}

export const SpinControl = memo<SpinControlProps>(({ className = '' }) => {
  const isSpinning = useRouletteStore(state => state.isSpinning);
  const winningNumber = useRouletteStore(state => state.winningNumber);
  const spin = useRouletteStore(state => state.spin);
  const reset = useRouletteStore(state => state.reset);

  const handleSpin = useCallback(() => {
    spin();
  }, [spin]);

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="flex items-center gap-4">
        <Button
          onClick={handleSpin}
          disabled={isSpinning}
          size="lg"
          className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 min-w-[120px] text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100"
          aria-label={isSpinning ? 'Spinning...' : 'Spin the roulette wheel'}
        >
          {isSpinning ? 'Spinning...' : 'SPIN'}
        </Button>

        {winningNumber !== null && !isSpinning && (
          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="min-w-[100px]"
            aria-label="Reset the wheel"
          >
            Reset
          </Button>
        )}
      </div>

      {isSpinning && (
        <div className="text-sm text-gray-600 animate-pulse">
          The wheel is spinning...
        </div>
      )}
    </div>
  );
});

SpinControl.displayName = 'SpinControl';
