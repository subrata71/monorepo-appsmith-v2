import { useMemo } from 'react';
import { useBSTStore } from '@/entities/bst';
import { LayoutCalculator } from '@/entities/bst/model/layout-calculator';

interface BSTSVGTreeProps {
  width?: number;
}

export const BSTSVGTree = ({ width = 800 }: BSTSVGTreeProps) => {
  const bst = useBSTStore(state => state.bst);
  const animationState = useBSTStore(state => state.animationState);
  const searchPath = useBSTStore(state => state.searchPath);

  const { positions, edges, svgDimensions } = useMemo(() => {
    const positions = LayoutCalculator.calculateNodePositions(bst.root, width);
    const edges = LayoutCalculator.getEdges(positions);
    const svgDimensions = LayoutCalculator.calculateSVGDimensions(bst.root, width);
    
    return { positions, edges, svgDimensions };
  }, [bst.root, width]);

  const isNodeHighlighted = (nodeId: string): boolean => {
    return searchPath.includes(nodeId) || animationState.highlightedPath?.includes(nodeId) || false;
  };

  const isNodeTarget = (nodeId: string): boolean => {
    return animationState.nodeId === nodeId && animationState.type === 'search';
  };

  const getNodeColor = (nodeId: string): string => {
    if (isNodeTarget(nodeId)) {
      return '#10b981'; // Green for target node
    }
    if (isNodeHighlighted(nodeId)) {
      return '#f59e0b'; // Amber for path nodes
    }
    return '#3b82f6'; // Blue for normal nodes
  };

  const getNodeStroke = (nodeId: string): string => {
    if (animationState.isAnimating && isNodeHighlighted(nodeId)) {
      return '#ef4444'; // Red stroke for animated nodes
    }
    return '#1e40af'; // Default dark blue stroke
  };

  if (!bst.root) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">Empty Tree</div>
          <div className="text-gray-500 text-sm">Insert a number to get started</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex justify-center items-start bg-gray-50 rounded-lg border border-gray-200 overflow-auto">
      <svg
        width={svgDimensions.width}
        height={svgDimensions.height}
        viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
        className="min-w-full min-h-full"
      >
        {/* Render edges first so they appear behind nodes */}
        {edges.map((edge, index) => (
          <line
            key={`edge-${index}`}
            x1={edge.from.x}
            y1={edge.from.y}
            x2={edge.to.x}
            y2={edge.to.y}
            stroke="#6b7280"
            strokeWidth="2"
            className={`transition-all duration-300 ${
              isNodeHighlighted(edge.from.node.id) && isNodeHighlighted(edge.to.node.id)
                ? 'stroke-amber-500 stroke-[3px]'
                : ''
            }`}
          />
        ))}

        {/* Render nodes */}
        {positions.map((position) => (
          <g key={position.node.id}>
            {/* Node circle */}
            <circle
              cx={position.x}
              cy={position.y}
              r="25"
              fill={getNodeColor(position.node.id)}
              stroke={getNodeStroke(position.node.id)}
              strokeWidth="2"
              className={`transition-all duration-700 ease-in-out ${
                animationState.isAnimating && isNodeHighlighted(position.node.id)
                  ? 'animate-pulse drop-shadow-lg'
                  : ''
              } ${
                animationState.type === 'insert' && animationState.nodeId === position.node.id
                  ? 'animate-bounce drop-shadow-lg'
                  : ''
              } ${
                isNodeTarget(position.node.id)
                  ? 'drop-shadow-lg scale-110'
                  : 'hover:scale-105'
              }`}
            />
            
            {/* Node value text */}
            <text
              x={position.x}
              y={position.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-white text-sm font-semibold pointer-events-none select-none"
            >
              {position.node.value}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};