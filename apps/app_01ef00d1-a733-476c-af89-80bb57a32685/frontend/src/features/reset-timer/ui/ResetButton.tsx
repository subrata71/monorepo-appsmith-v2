import React from 'react';
import type { Timer } from '@app/shared/api-types';
import { Button } from '@/shared/ui/button';
import { RotateCcw } from 'lucide-react';

interface ResetButtonProps {
  timer: Timer | null;
  onReset: () => void;
  className?: string;
}

/**
 * ResetButton Component
 * 
 * Handles reset functionality for the Pomodoro timer.
 * Visually subdued when timer is already at initial value.
 */
export const ResetButton = React.memo<ResetButtonProps>(({ 
  timer, 
  onReset, 
  className = '' 
}) => {
  // Determine if timer is already reset (at initial value)
  const isAlreadyReset = timer?.currentSeconds === timer?.initialSeconds && timer?.status === 'idle';
  
  // Determine if reset should be disabled
  const isDisabled = !timer || isAlreadyReset;
  
  return (
    <Button
      onClick={onReset}
      size="lg"
      variant="ghost"
      disabled={isDisabled}
      className={`min-w-[120px] h-11 text-base font-normal transition-all duration-300 
        border border-neutral-300 hover:border-neutral-900 hover:bg-neutral-50 
        bg-transparent hover:shadow-sm rounded-sm ${
        isAlreadyReset ? 'opacity-40 hover:opacity-40' : ''
      } ${className}`}
      aria-label="Reset timer to initial value"
      data-testid="reset-button"
    >
      <span className={`flex items-center gap-2 ${isAlreadyReset ? 'text-neutral-400' : 'text-neutral-700'}`}>
        <RotateCcw className="w-5 h-5" />
        Reset
      </span>
    </Button>
  );
});