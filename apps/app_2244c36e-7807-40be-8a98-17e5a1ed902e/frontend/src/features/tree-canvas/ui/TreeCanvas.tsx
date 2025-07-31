import { useEffect, useRef, useState } from 'react';
import { useTreeVisualizerStore } from '@/shared/model/tree-visualizer-store';
import { useTreeQuery } from '@/entities/tree';
import { TreeLayoutCalculator } from '../lib/tree-layout';
import type { TreeNodePosition } from '@/entities/tree';

interface TreeCanvasProps {
  width?: number;
  height?: number;
}

export const TreeCanvas = ({ width = 800, height = 600 }: TreeCanvasProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodePositions, setNodePositions] = useState<TreeNodePosition[]>([]);
  const [edges, setEdges] = useState<Array<{ from: string; to: string }>>([]);

  const { data: treeData } = useTreeQuery();
  const highlightedNodeId = useTreeVisualizerStore(state => state.highlightedNodeId);
  const selectedNodeId = useTreeVisualizerStore(state => state.selectedNodeId);
  const zoomLevel = useTreeVisualizerStore(state => state.zoomLevel);
  const panOffset = useTreeVisualizerStore(state => state.panOffset);
  const showNodeTooltip = useTreeVisualizerStore(state => state.showNodeTooltip);
  const hideTooltip = useTreeVisualizerStore(state => state.hideTooltip);
  const setSelectedNode = useTreeVisualizerStore(state => state.setSelectedNode);

  // Constants for tree layout
  const NODE_RADIUS = 25;
  const HORIZONTAL_SPACING = 80;
  const VERTICAL_SPACING = 80;

  // Calculate tree layout when data changes
  useEffect(() => {
    if (!treeData?.nodes || treeData.nodes.length === 0) {
      setNodePositions([]);
      setEdges([]);
      return;
    }

    const layoutCalculator = new TreeLayoutCalculator({
      nodeRadius: NODE_RADIUS,
      horizontalSpacing: HORIZONTAL_SPACING,
      verticalSpacing: VERTICAL_SPACING,
      canvasWidth: width,
      canvasHeight: height,
    });

    const positions = layoutCalculator.calculateImprovedLayout(
      treeData.nodes,
      treeData.tree?.rootId || null
    );
    
    const calculatedEdges = layoutCalculator.calculateEdges(treeData.nodes, positions);

    setNodePositions(positions);
    setEdges(calculatedEdges);
  }, [treeData, width, height]);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(selectedNodeId === nodeId ? null : nodeId);
  };

  const handleNodeMouseEnter = (nodeId: string, event: React.MouseEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      showNodeTooltip(nodeId, {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      });
    }
  };

  const handleNodeMouseLeave = () => {
    hideTooltip();
  };

  const getNodeFill = (nodeId: string) => {
    if (highlightedNodeId === nodeId) {
      return '#3b82f6'; // Blue for highlighted (traversal)
    }
    if (selectedNodeId === nodeId) {
      return '#059669'; // Green for selected
    }
    return '#f3f4f6'; // Default gray
  };

  const getNodeStroke = (nodeId: string) => {
    if (highlightedNodeId === nodeId) {
      return '#1d4ed8';
    }
    if (selectedNodeId === nodeId) {
      return '#047857';
    }
    return '#6b7280';
  };

  const getTextFill = (nodeId: string) => {
    return (highlightedNodeId === nodeId || selectedNodeId === nodeId) ? '#ffffff' : '#374151';
  };

  if (!treeData?.nodes || treeData.nodes.length === 0) {
    return (
      <div className="flex items-center justify-center w-full h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">Empty Tree</div>
          <div className="text-gray-500 text-sm">Add nodes to see the tree visualization</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative border rounded-lg bg-white overflow-hidden">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="cursor-grab active:cursor-grabbing"
        transform={`scale(${zoomLevel}) translate(${panOffset.x}, ${panOffset.y})`}
      >
        {/* Grid pattern for background */}
        <defs>
          <pattern
            id="grid"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Render edges */}
        <g className="edges">
          {edges.map(({ from, to }) => {
            const fromPos = nodePositions.find(pos => pos.id === from);
            const toPos = nodePositions.find(pos => pos.id === to);
            
            if (!fromPos || !toPos) return null;

            return (
              <line
                key={`${from}-${to}`}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke="#6b7280"
                strokeWidth="2"
                className="transition-all duration-300"
              />
            );
          })}
        </g>

        {/* Render nodes */}
        <g className="nodes">
          {nodePositions.map((position) => (
            <g
              key={position.id}
              className="cursor-pointer transition-all duration-300 hover:scale-110"
              onClick={() => handleNodeClick(position.id)}
              onMouseEnter={(e) => handleNodeMouseEnter(position.id, e)}
              onMouseLeave={handleNodeMouseLeave}
            >
              {/* Node circle */}
              <circle
                cx={position.x}
                cy={position.y}
                r={NODE_RADIUS}
                fill={getNodeFill(position.id)}
                stroke={getNodeStroke(position.id)}
                strokeWidth="3"
                className="transition-all duration-300"
              />
              
              {/* Node value text */}
              <text
                x={position.x}
                y={position.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={getTextFill(position.id)}
                fontSize="14"
                fontWeight="600"
                className="pointer-events-none select-none transition-all duration-300"
              >
                {position.value}
              </text>
            </g>
          ))}
        </g>
      </svg>

      {/* Canvas controls */}
      <div className="absolute top-4 right-4 flex gap-2">
        <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-lg shadow-sm text-sm text-gray-600">
          Nodes: {nodePositions.length}
        </div>
        {highlightedNodeId && (
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg shadow-sm text-sm font-medium">
            Highlighting Traversal
          </div>
        )}
      </div>
    </div>
  );
};