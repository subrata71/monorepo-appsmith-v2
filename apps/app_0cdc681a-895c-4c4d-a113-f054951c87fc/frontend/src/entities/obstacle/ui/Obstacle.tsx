import React from 'react';
import type { ObstacleState } from '../model/types';

export interface ObstacleProps {
  obstacle: ObstacleState;
}

export const Obstacle: React.FC<ObstacleProps> = React.memo(({ obstacle }) => {
  // Different colors for different obstacle types
  const getObstacleColor = (type: ObstacleState['type']): string => {
    switch (type) {
      case 'basic':
        return 'bg-red-600';
      case 'tall':
        return 'bg-orange-600';
      case 'wide':
        return 'bg-purple-600';
      default:
        return 'bg-red-600';
    }
  };

  const getBorderColor = (type: ObstacleState['type']): string => {
    switch (type) {
      case 'basic':
        return 'border-red-800';
      case 'tall':
        return 'border-orange-800';
      case 'wide':
        return 'border-purple-800';
      default:
        return 'border-red-800';
    }
  };

  return (
    <div
      className={`absolute border-2 ${getObstacleColor(obstacle.type)} ${getBorderColor(obstacle.type)}`}
      style={{
        left: `${obstacle.position.x}px`,
        top: `${obstacle.position.y}px`,
        width: `${obstacle.width}px`,
        height: `${obstacle.height}px`,
      }}
      title={`Obstacle (${obstacle.type})`}
    >
      {/* Optional: Add some visual detail */}
      <div className="w-full h-full opacity-20 bg-black" />
    </div>
  );
});

Obstacle.displayName = 'Obstacle';
