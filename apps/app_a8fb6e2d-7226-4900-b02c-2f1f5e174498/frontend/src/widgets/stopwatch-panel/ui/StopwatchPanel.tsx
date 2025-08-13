import { useEffect } from 'react';
import { StopwatchDisplay, useStopwatchStore } from '@/entities/stopwatch';

export const StopwatchPanel = () => {
  const elapsedTime = useStopwatchStore(state => state.elapsedTime);
  const isRunning = useStopwatchStore(state => state.isRunning);
  const tick = useStopwatchStore(state => state.tick);

  // Timer effect - update every second when running
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      tick();
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, tick]);

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[400px] space-y-8"
      data-testid="stopwatch-panel"
    >
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-8">Stopwatch</h1>
        <StopwatchDisplay elapsedTime={elapsedTime} />
      </div>
    </div>
  );
};