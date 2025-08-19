import React from 'react';
import type { RunnerState } from '../model/types';

export interface RunnerProps {
  runner: RunnerState;
}

export const Runner: React.FC<RunnerProps> = React.memo(({ runner }) => {
  return (
    <div
      className="absolute bg-blue-500 rounded-sm transition-all duration-75"
      style={{
        left: `${runner.position.x}px`,
        top: `${runner.position.y}px`,
        width: `${runner.width}px`,
        height: `${runner.height}px`,
        transform: 'translateY(-100%)', // Anchor to bottom
      }}
    />
  );
});

Runner.displayName = 'Runner';
