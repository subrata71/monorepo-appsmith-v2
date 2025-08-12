import React from 'react';
import { ResultDisplay } from './ResultDisplay';

export const ResultDisplayDemo = () => {
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-medium">ResultDisplay Demo</h3>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">With result value:</p>
        <ResultDisplay result={42} />
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          With null result (shows nothing):
        </p>
        <ResultDisplay result={null} />
      </div>

      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Using store state (no prop):
        </p>
        <ResultDisplay />
      </div>
    </div>
  );
};
