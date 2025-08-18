import React from 'react';
import type { Timer } from '@app/shared/api-types';
import { formatSeconds } from '@/shared/lib/utils';

interface TimerDisplayProps {
  timer: Timer | null;
  className?: string;
}

/**
 * TimerDisplay Component
 * Displays the timer in large, centered format
 */
export const TimerDisplay = React.memo<TimerDisplayProps>(({ timer, className = '' }) => {
  const displayTime = timer ? formatSeconds(timer.currentSeconds) : '25:00';
  const isRunning = timer?.status === 'running';

  return (
    <div 
      className={`text-center minimal-timer-transition ${className}`}
      role="timer" 
      aria-live="polite"
      aria-label={`Timer: ${displayTime}`}
    >
      <div 
        className={`text-7xl md:text-8xl font-light font-mono tracking-wide minimal-timer-transition ${
          isRunning 
            ? 'text-neutral-900' 
            : timer?.status === 'paused' 
              ? 'text-neutral-600' 
              : 'text-neutral-800'
        }`}
        data-testid="timer-display"
      >
        {displayTime}
      </div>
      <div className="mt-8 text-sm font-normal text-neutral-500 uppercase tracking-wider minimal-timer-transition">
        {timer?.status === 'running' && 'Focus'}
        {timer?.status === 'paused' && 'Paused'}
        {timer?.status === 'idle' && 'Ready'}
        {timer?.currentSeconds === 0 && 'Complete'}
      </div>
    </div>
  );
});