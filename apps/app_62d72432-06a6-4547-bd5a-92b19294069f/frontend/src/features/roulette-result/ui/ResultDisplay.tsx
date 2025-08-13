import { memo, useEffect, useState } from 'react';
import { useRouletteStore, ROULETTE_SLOTS } from '@/entities/roulette';

interface ResultDisplayProps {
  className?: string;
}

export const ResultDisplay = memo<ResultDisplayProps>(({ className = '' }) => {
  const winningNumber = useRouletteStore(state => state.winningNumber);
  const isSpinning = useRouletteStore(state => state.isSpinning);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (winningNumber !== null && !isSpinning) {
      // Small delay to show result after spin completes
      const timer = setTimeout(() => {
        setShowResult(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowResult(false);
    }
  }, [winningNumber, isSpinning]);

  if (!showResult || winningNumber === null) {
    return (
      <div className={`text-center ${className}`}>
        <div className="text-lg text-gray-500">
          Click SPIN to play!
        </div>
      </div>
    );
  }

  const winningSlot = ROULETTE_SLOTS.find(slot => slot.number === winningNumber);
  const colorClass = winningSlot?.color === 'red' 
    ? 'text-red-600' 
    : winningSlot?.color === 'black' 
      ? 'text-gray-800' 
      : 'text-green-600';

  return (
    <div className={`text-center space-y-3 ${className}`}>
      <div className="animate-bounce">
        <div className="text-2xl font-bold text-gray-700">Winning Number</div>
        <div className={`text-6xl font-bold ${colorClass} drop-shadow-lg`}>
          {winningNumber}
        </div>
        <div className="text-lg text-gray-600 capitalize">
          {winningSlot?.color}
        </div>
      </div>
      
      {/* Accessible announcement for screen readers */}
      <div className="sr-only" role="status" aria-live="polite">
        The winning number is {winningNumber} {winningSlot?.color}
      </div>
    </div>
  );
});

ResultDisplay.displayName = 'ResultDisplay';