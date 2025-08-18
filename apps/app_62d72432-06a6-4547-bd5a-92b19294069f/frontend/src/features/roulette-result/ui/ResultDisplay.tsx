import { memo, useEffect, useState } from 'react';
import { useRouletteStore, ROULETTE_SLOTS } from '@/entities/roulette';

interface ResultDisplayProps {
  className?: string;
}

export const ResultDisplay = memo<ResultDisplayProps>(({ className = '' }) => {
  const winningNumber = useRouletteStore(state => state.winningNumber);
  const isSpinning = useRouletteStore(state => state.isSpinning);
  const [showResult, setShowResult] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (winningNumber !== null && !isSpinning) {
      // Start the result reveal animation
      setIsAnimating(true);

      // First, show the result container
      const showTimer = setTimeout(() => {
        setShowResult(true);
      }, 200);

      // Then trigger the main animation
      const animateTimer = setTimeout(() => {
        setIsAnimating(false);
      }, 800);

      return () => {
        clearTimeout(showTimer);
        clearTimeout(animateTimer);
      };
    } else {
      setShowResult(false);
      setIsAnimating(false);
    }
  }, [winningNumber, isSpinning]);

  if (!showResult || winningNumber === null) {
    return (
      <div
        className={`text-center min-h-[120px] flex items-center justify-center ${className}`}
      >
        <div className="text-lg text-gray-500">
          {isSpinning ? 'Spinning...' : 'Click SPIN to play!'}
        </div>
      </div>
    );
  }

  const winningSlot = ROULETTE_SLOTS.find(
    slot => slot.number === winningNumber
  );
  const colorClass =
    winningSlot?.color === 'red'
      ? 'text-red-600'
      : winningSlot?.color === 'black'
        ? 'text-gray-800'
        : 'text-green-600';

  const backgroundClass =
    winningSlot?.color === 'red'
      ? 'bg-red-50 border-red-200'
      : winningSlot?.color === 'black'
        ? 'bg-gray-50 border-gray-200'
        : 'bg-green-50 border-green-200';

  return (
    <div className={`text-center space-y-4 ${className}`}>
      {/* Main result card with enhanced styling */}
      <div
        className={`
        relative overflow-hidden
        ${backgroundClass}
        border-2 rounded-2xl p-6 shadow-lg
        transform transition-all duration-700 ease-out
        ${isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
      `}
      >
        {/* Celebration sparkles overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className={`
            absolute top-2 left-4 w-2 h-2 bg-yellow-400 rounded-full
            animate-ping animation-delay-100
          `}
          />
          <div
            className={`
            absolute top-6 right-8 w-1.5 h-1.5 bg-yellow-400 rounded-full
            animate-ping animation-delay-300
          `}
          />
          <div
            className={`
            absolute bottom-4 left-8 w-1 h-1 bg-yellow-400 rounded-full
            animate-ping animation-delay-500
          `}
          />
          <div
            className={`
            absolute bottom-8 right-4 w-2 h-2 bg-yellow-400 rounded-full
            animate-ping animation-delay-700
          `}
          />
        </div>

        <div
          className={`
          space-y-2
          animate-bounce animation-duration-1000
        `}
        >
          <div className="text-xl font-bold text-gray-700">
            🎉 Winning Number
          </div>
          <div
            className={`
            text-7xl font-bold ${colorClass} 
            drop-shadow-lg filter 
            transition-all duration-500
            ${!isAnimating ? 'animate-pulse' : ''}
          `}
          >
            {winningNumber}
          </div>
          <div className="text-lg text-gray-600 capitalize font-medium">
            {winningSlot?.color}
          </div>
        </div>
      </div>

      {/* Additional result info */}
      <div className="text-sm text-gray-500 space-y-1">
        <p>🎯 The ball landed on slot {winningNumber}</p>
        {winningSlot?.color === 'green' && (
          <p className="text-green-600 font-medium">🍀 House number!</p>
        )}
      </div>

      {/* Accessible announcement for screen readers */}
      <div className="sr-only" role="status" aria-live="polite">
        The winning number is {winningNumber} {winningSlot?.color}.
        {winningSlot?.color === 'green' ? ' This is a house number.' : ''}
      </div>
    </div>
  );
});

ResultDisplay.displayName = 'ResultDisplay';
