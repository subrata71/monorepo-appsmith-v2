import React, { useMemo } from 'react';
import { useVisualizationStore } from '../model/store';

export const ArrayDisplay = React.memo(() => {
  const array = useVisualizationStore(state => state.array);
  const error = useVisualizationStore(state => state.error);

  const maxValue = useMemo(() => Math.max(...array, 1), [array]);

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (array.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">
          Enter an array or generate one to see the visualization
        </p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold mb-4">Array Visualization</h3>
      <div className="flex items-end justify-center gap-1 h-64">
        {array.map((value, index) => {
          const height = (value / maxValue) * 240; // Max height of 240px
          return (
            <div
              key={index}
              className="bg-primary rounded-t-sm min-w-[20px] flex items-end justify-center transition-all duration-300"
              style={{ height: `${height}px` }}
              title={`Index ${index}: ${value}`}
            >
              <span className="text-xs text-primary-foreground font-medium mb-1">
                {value}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          Array of {array.length} numbers: [{array.join(', ')}]
        </p>
      </div>
    </div>
  );
});