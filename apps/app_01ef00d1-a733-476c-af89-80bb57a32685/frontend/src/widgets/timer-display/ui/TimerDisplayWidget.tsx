import React, { useEffect } from 'react';
import { useTimerStore, TimerDisplay } from '@/entities/timer';
import { useInterval } from '@/shared/hooks';

/**
 * TimerDisplayWidget
 *
 * Main widget for displaying the Pomodoro timer with countdown functionality.
 * This component handles the timer ticking and integrates with the timer store.
 */
export const TimerDisplayWidget = React.memo(() => {
  // Get timer state and actions from store
  const timer = useTimerStore(state => state.timer);
  const tick = useTimerStore(state => state.tick);
  const pauseTimer = useTimerStore(state => state.pauseTimer);
  const initializeTimer = useTimerStore(state => state.initializeTimer);

  // Initialize timer on component mount
  useEffect(() => {
    if (!timer) {
      initializeTimer();
    }
  }, [timer, initializeTimer]);

  // Set up interval for countdown when timer is running
  useInterval(
    () => {
      tick();

      // Auto-pause when timer reaches 0
      if (timer && timer.currentSeconds === 1) {
        setTimeout(() => {
          pauseTimer();
        }, 1000);
      }
    },
    timer?.status === 'running' ? 1000 : null
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
      <TimerDisplay timer={timer} className="animate-in fade-in duration-700" />
    </div>
  );
});
