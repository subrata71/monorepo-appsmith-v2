import React from 'react';
import { useSumCalculatorStore } from '@/entities/sum-calculator';

export interface ResultDisplayProps {
  result?: number | null;
}

export const ResultDisplay = React.memo<ResultDisplayProps>(
  ({ result: externalResult }) => {
    // Use individual selector as per Zustand rules
    const storeResult = useSumCalculatorStore(state => state.result);

    // Use external result if provided, otherwise use store result
    const result = externalResult !== undefined ? externalResult : storeResult;

    // Don't render anything if no result
    if (result === null || result === undefined) {
      return null;
    }

    return (
      <div className="text-lg font-semibold text-foreground">
        Result: {result}
      </div>
    );
  }
);

ResultDisplay.displayName = 'ResultDisplay';
