import { useCallback } from 'react';
import { Button } from '@/shared/ui';

interface StopwatchControlsProps {
  isRunning: boolean;
  elapsedTime: number;
  onStartStop: () => void;
  onReset: () => void;
}

export const StopwatchControls = ({ 
  isRunning, 
  elapsedTime, 
  onStartStop, 
  onReset 
}: StopwatchControlsProps) => {
  const handleStartStop = useCallback(() => {
    onStartStop();
  }, [onStartStop]);

  const handleReset = useCallback(() => {
    onReset();
  }, [onReset]);

  return (
    <div className="flex items-center justify-center gap-4" data-testid="stopwatch-controls">
      <Button
        onClick={handleStartStop}
        size="lg"
        data-testid="start-stop-button"
      >
        {isRunning ? 'Stop' : 'Start'}
      </Button>
      
      <Button
        onClick={handleReset}
        variant="outline"
        size="lg"
        disabled={elapsedTime === 0}
        data-testid="reset-button"
      >
        Reset
      </Button>
    </div>
  );
};