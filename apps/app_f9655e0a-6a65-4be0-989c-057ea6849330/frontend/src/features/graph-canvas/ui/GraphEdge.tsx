import React from 'react';
import type { GraphEdgeProps } from '@/entities/graph';

// Calculate the edge path with arrowhead
const calculateEdgePath = (
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  nodeRadius: number = 25
) => {
  // Calculate direction vector
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance === 0) return { path: '', arrowX: sourceX, arrowY: sourceY };
  
  // Normalize direction vector
  const unitX = dx / distance;
  const unitY = dy / distance;
  
  // Calculate start and end points (offset by node radius)
  const startX = sourceX + unitX * nodeRadius;
  const startY = sourceY + unitY * nodeRadius;
  const endX = targetX - unitX * nodeRadius;
  const endY = targetY - unitY * nodeRadius;
  
  // Create curved path for better visual appearance
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  
  // Add slight curve perpendicular to the main direction
  const perpX = -unitY * 20; // 20px curve
  const perpY = unitX * 20;
  
  const controlX = midX + perpX;
  const controlY = midY + perpY;
  
  const path = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
  
  return { path, arrowX: endX, arrowY: endY, unitX, unitY };
};

export const GraphEdge = React.memo<GraphEdgeProps>(({
  edge,
  sourceNode,
  targetNode,
  isSelected,
  onClick,
}) => {
  const { path, arrowX, arrowY, unitX, unitY } = React.useMemo(
    () => calculateEdgePath(sourceNode.x, sourceNode.y, targetNode.x, targetNode.y),
    [sourceNode.x, sourceNode.y, targetNode.x, targetNode.y]
  );

  const handleClick = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  }, [onClick]);

  return (
    <g>
      {/* Main edge line */}
      <path
        d={path}
        stroke={isSelected ? '#3b82f6' : '#6b7280'}
        strokeWidth={isSelected ? 3 : 2}
        fill="none"
        className="cursor-pointer hover:stroke-blue-400 transition-colors"
        onClick={handleClick}
      />
      
      {/* Invisible wider path for easier clicking */}
      <path
        d={path}
        stroke="transparent"
        strokeWidth={12}
        fill="none"
        className="cursor-pointer"
        onClick={handleClick}
      />
      
      {/* Arrowhead */}
      <g transform={`translate(${arrowX}, ${arrowY}) rotate(${Math.atan2(unitY || 0, unitX || 0) * 180 / Math.PI})`}>
        <polygon
          points="0,0 -8,-3 -8,3"
          fill={isSelected ? '#3b82f6' : '#6b7280'}
          className="transition-colors"
        />
      </g>
      
      {/* Selection indicator */}
      {isSelected && (
        <path
          d={path}
          stroke="#3b82f6"
          strokeWidth={5}
          strokeDasharray="8 4"
          fill="none"
          className="animate-pulse opacity-50"
          pointerEvents="none"
        />
      )}
    </g>
  );
});