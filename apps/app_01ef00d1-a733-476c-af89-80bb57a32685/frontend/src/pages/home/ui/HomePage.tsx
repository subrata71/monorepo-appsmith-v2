import React from 'react';
import { TimerDisplayWidget } from '@/widgets/timer-display';
import { TimerControlsWidget } from '@/widgets/timer-controls';

/**
 * HomePage Component
 *
 * Main page that displays the Pomodoro timer
 */
export const HomePage = React.memo(() => {
  return (
    <div className="min-h-screen bg-white minimal-timer-container minimal-typography">
      <div className="container mx-auto px-4 py-16">
        {/* Minimal Page Title - smaller and less prominent */}
        <header className="text-center mb-16">
          <h1 className="text-2xl md:text-3xl font-light text-neutral-800 mb-1 tracking-wide">
            Pomodoro
          </h1>
          <div className="w-12 h-px bg-neutral-300 mx-auto minimal-divider"></div>
        </header>

        {/* Timer Display and Controls */}
        <main className="flex flex-col items-center">
          <TimerDisplayWidget />
          <TimerControlsWidget />
        </main>
      </div>
    </div>
  );
});
