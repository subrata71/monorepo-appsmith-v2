import React from 'react';
import type { GraphNodeProps, CanvasPosition } from '@/entities/graph';

const NODE_SIZE = 50;
const NODE_RADIUS = NODE_SIZE / 2;

export const GraphNode = React.memo<GraphNodeProps>(({ 
  node, 
  isSelected, 
  onClick, 
  onMove 
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState<{ x: number; y: number } | null>(null);

  const handleMouseDown = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    onClick();
  }, [onClick]);

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!isDragging || !dragStart) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    const newPosition: CanvasPosition = {
      x: node.x + deltaX,
      y: node.y + deltaY,
    };

    onMove(newPosition);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, dragStart, node.x, node.y, onMove]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <g transform={`translate(${node.x}, ${node.y})`}>
      {/* Node circle */}
      <circle
        cx={0}
        cy={0}
        r={NODE_RADIUS}
        fill={isSelected ? '#3b82f6' : '#f3f4f6'}
        stroke={isSelected ? '#1d4ed8' : '#6b7280'}
        strokeWidth={2}
        className={`cursor-pointer transition-colors ${
          isDragging ? 'opacity-75' : ''
        } hover:fill-blue-50 hover:stroke-blue-400`}
        onMouseDown={handleMouseDown}
      />
      
      {/* Node label */}
      <text
        x={0}
        y={0}
        textAnchor="middle"
        dominantBaseline="central"
        className={`text-sm font-medium pointer-events-none select-none ${
          isSelected ? 'fill-white' : 'fill-gray-700'
        }`}
      >
        {node.label}
      </text>
      
      {/* Selection ring */}
      {isSelected && (
        <circle
          cx={0}
          cy={0}
          r={NODE_RADIUS + 4}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={2}
          strokeDasharray="4 4"
          className="animate-pulse"
        />
      )}
    </g>
  );
});