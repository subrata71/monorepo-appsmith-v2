import React from 'react';
import { useTimerStore } from '@/entities/timer';
import { StartPauseButton } from '@/features/start-pause-timer';
import { ResetButton } from '@/features/reset-timer';

/**
 * TimerControlsWidget Component
 *
 * Widget that houses all timer control buttons.
 * Contains Start/Pause and Reset functionality.
 */
export const TimerControlsWidget = React.memo(() => {
  // Get timer state and actions from store
  const timer = useTimerStore(state => state.timer);
  const startTimer = useTimerStore(state => state.startTimer);
  const pauseTimer = useTimerStore(state => state.pauseTimer);
  const resetTimer = useTimerStore(state => state.resetTimer);

  // Handle start/pause toggle
  const handleStartPause = () => {
    if (!timer) return;

    // If timer is finished, reset and start new session
    if (timer.currentSeconds === 0) {
      resetTimer();
      setTimeout(() => startTimer(), 50); // Small delay to allow state update
      return;
    }

    // Toggle between start and pause
    if (timer.status === 'running') {
      pauseTimer();
    } else {
      startTimer();
    }
  };

  return (
    <div
      className="flex justify-center items-center gap-6 mt-12"
      role="group"
      aria-label="Timer controls"
    >
      <StartPauseButton
        timer={timer}
        onStartPause={handleStartPause}
        className="minimal-button-primary"
      />
      <ResetButton
        timer={timer}
        onReset={resetTimer}
        className="minimal-button-secondary"
      />
    </div>
  );
});
