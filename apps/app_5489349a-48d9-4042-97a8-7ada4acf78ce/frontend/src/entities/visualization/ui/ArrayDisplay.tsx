import React, { useMemo } from 'react';
import { useVisualizationStore } from '../model/store';

export const ArrayDisplay = React.memo(() => {
  const { 
    array, 
    error, 
    highlightedIndices, 
    sortedPartition,
    status 
  } = useVisualizationStore();

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
          const isHighlighted = highlightedIndices.includes(index);
          const isSorted = index >= array.length - sortedPartition;
          
          let barColor = 'bg-primary';
          let textColor = 'text-primary-foreground';
          
          if (isSorted) {
            barColor = 'bg-green-500';
            textColor = 'text-white';
          } else if (isHighlighted) {
            barColor = 'bg-red-500';
            textColor = 'text-white';
          }
          
          return (
            <div
              key={index}
              className={`${barColor} rounded-t-sm min-w-[20px] flex items-end justify-center transition-all duration-300 border-2 ${
                isHighlighted ? 'border-red-300 scale-105' : 
                isSorted ? 'border-green-300' : 
                'border-transparent'
              }`}
              style={{ height: `${height}px` }}
              title={`Index ${index}: ${value}${isSorted ? ' (sorted)' : ''}${isHighlighted ? ' (highlighted)' : ''}`}
            >
              <span className={`text-xs ${textColor} font-medium mb-1`}>
                {value}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 space-y-3">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Array of {array.length} numbers: [{array.join(', ')}]
          </p>
        </div>
        
        {/* Legend */}
        {status !== 'idle' && (
          <div className="flex flex-wrap justify-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded"></div>
              <span>Unsorted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Being Compared</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Sorted</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});