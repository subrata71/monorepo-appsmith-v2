import React from 'react';
import type { Timer } from '@app/shared/api-types';
import { Button } from '@/shared/ui/button';
import { Play, Pause } from 'lucide-react';

interface StartPauseButtonProps {
  timer: Timer | null;
  onStartPause: () => void;
  className?: string;
}

/**
 * StartPauseButton Component
 *
 * Handles start/pause functionality for the Pomodoro timer.
 * Displays appropriate icon and text based on timer state.
 */
export const StartPauseButton = React.memo<StartPauseButtonProps>(
  ({ timer, onStartPause, className = '' }) => {
    const isRunning = timer?.status === 'running';
    const isFinished = timer?.currentSeconds === 0;

    // Determine button content based on timer state
    const getButtonContent = () => {
      if (isFinished) {
        return {
          icon: <Play className="w-5 h-5" />,
          text: 'Start New Session',
          ariaLabel: 'Start a new Pomodoro session',
        };
      }

      if (isRunning) {
        return {
          icon: <Pause className="w-5 h-5" />,
          text: 'Pause',
          ariaLabel: 'Pause timer',
        };
      }

      return {
        icon: <Play className="w-5 h-5" />,
        text: timer?.status === 'paused' ? 'Resume' : 'Start',
        ariaLabel: timer?.status === 'paused' ? 'Resume timer' : 'Start timer',
      };
    };

    const { icon, text, ariaLabel } = getButtonContent();

    return (
      <Button
        onClick={onStartPause}
        size="lg"
        variant="ghost"
        className={`min-w-[120px] h-11 text-base font-normal transition-all duration-300 
        border border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50 
        bg-transparent hover:shadow-sm rounded-sm ${className}`}
        aria-label={ariaLabel}
        data-testid="start-pause-button"
      >
        <span className="flex items-center gap-2 text-neutral-700">
          {icon}
          {text}
        </span>
      </Button>
    );
  }
);
