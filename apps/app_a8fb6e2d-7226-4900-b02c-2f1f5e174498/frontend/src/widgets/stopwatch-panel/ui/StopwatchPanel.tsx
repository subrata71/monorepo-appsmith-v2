import { useCallback, useEffect } from 'react';
import { StopwatchDisplay, useStopwatchStore } from '@/entities/stopwatch';
import { StopwatchControls } from '@/features';

export const StopwatchPanel = () => {
  const elapsedTime = useStopwatchStore(state => state.elapsedTime);
  const isRunning = useStopwatchStore(state => state.isRunning);
  const start = useStopwatchStore(state => state.start);
  const stop = useStopwatchStore(state => state.stop);
  const reset = useStopwatchStore(state => state.reset);
  const tick = useStopwatchStore(state => state.tick);

  // Callback functions for controls
  const handleStartStop = useCallback(() => {
    if (isRunning) {
      stop();
    } else {
      start();
    }
  }, [isRunning, start, stop]);

  const handleReset = useCallback(() => {
    reset();
  }, [reset]);

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

      <StopwatchControls
        isRunning={isRunning}
        elapsedTime={elapsedTime}
        onStartStop={handleStartStop}
        onReset={handleReset}
      />
    </div>
  );
};
