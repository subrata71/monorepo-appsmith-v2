import React from 'react';
import type { GraphCanvasProps, CanvasPosition } from '@/entities/graph';
import { GraphNode } from './GraphNode';
import { GraphEdge } from './GraphEdge';

export const GraphCanvas = React.memo<GraphCanvasProps>(
  ({
    width,
    height,
    graph,
    selectedNodeIds,
    selectedEdgeIds,
    mode,
    onNodeClick,
    onNodeAdd,
    onEdgeDraw,
    onNodeMove,
    onCanvasClick,
  }) => {
    const svgRef = React.useRef<SVGSVGElement>(null);
    const [tempEdge, setTempEdge] = React.useState<{
      sourceId: string;
      mouseX: number;
      mouseY: number;
    } | null>(null);

    // Get mouse position relative to SVG
    const getMousePosition = React.useCallback(
      (e: React.MouseEvent): CanvasPosition => {
        if (!svgRef.current) return { x: 0, y: 0 };

        const rect = svgRef.current.getBoundingClientRect();
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      },
      []
    );

    // Handle canvas click
    const handleCanvasClick = React.useCallback(
      (e: React.MouseEvent) => {
        const position = getMousePosition(e);

        if (mode.type === 'ADD_NODE') {
          onNodeAdd(position);
        } else {
          onCanvasClick(position);
        }
      },
      [mode.type, onNodeAdd, onCanvasClick, getMousePosition]
    );

    // Handle node click in different modes
    const handleNodeClick = React.useCallback(
      (nodeId: string) => {
        if (mode.type === 'DRAW_EDGE') {
          if (!tempEdge) {
            // Start edge drawing
            setTempEdge({
              sourceId: nodeId,
              mouseX: 0,
              mouseY: 0,
            });
          } else if (tempEdge.sourceId !== nodeId) {
            // Complete edge drawing
            onEdgeDraw(tempEdge.sourceId, nodeId);
            setTempEdge(null);
          }
        } else {
          onNodeClick(nodeId);
        }
      },
      [mode.type, tempEdge, onEdgeDraw, onNodeClick]
    );

    // Handle mouse move for temporary edge drawing
    const handleMouseMove = React.useCallback(
      (e: React.MouseEvent) => {
        if (tempEdge) {
          const position = getMousePosition(e);
          setTempEdge(prev =>
            prev
              ? {
                  ...prev,
                  mouseX: position.x,
                  mouseY: position.y,
                }
              : null
          );
        }
      },
      [tempEdge, getMousePosition]
    );

    // Clear temp edge when mode changes
    React.useEffect(() => {
      if (mode.type !== 'DRAW_EDGE') {
        setTempEdge(null);
      }
    }, [mode.type]);

    // Handle node movement
    const handleNodeMove = React.useCallback(
      (nodeId: string, position: CanvasPosition) => {
        onNodeMove(nodeId, position);
      },
      [onNodeMove]
    );

    if (!graph) {
      return (
        <div
          className="flex items-center justify-center text-gray-500"
          style={{ width, height }}
        >
          <p>No graph loaded</p>
        </div>
      );
    }

    return (
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className={`border border-gray-200 bg-white ${
          mode.type === 'ADD_NODE' ? 'cursor-crosshair' : 'cursor-default'
        }`}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
      >
        {/* Grid pattern for visual reference */}
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
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Render edges */}
        <g className="edges">
          {graph.edges.map(edge => {
            const sourceNode = graph.nodes.find(n => n.id === edge.sourceId);
            const targetNode = graph.nodes.find(n => n.id === edge.targetId);

            if (!sourceNode || !targetNode) return null;

            return (
              <GraphEdge
                key={edge.id}
                edge={edge}
                sourceNode={sourceNode}
                targetNode={targetNode}
                isSelected={selectedEdgeIds.includes(edge.id)}
                onClick={() => onNodeClick(edge.id)} // Using the same handler for simplicity
              />
            );
          })}

          {/* Temporary edge while drawing */}
          {tempEdge &&
            (() => {
              const sourceNode = graph.nodes.find(
                n => n.id === tempEdge.sourceId
              );
              if (!sourceNode) return null;

              return (
                <line
                  key="temp-edge"
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={tempEdge.mouseX}
                  y2={tempEdge.mouseY}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  className="pointer-events-none"
                />
              );
            })()}
        </g>

        {/* Render nodes */}
        <g className="nodes">
          {graph.nodes.map(node => (
            <GraphNode
              key={node.id}
              node={node}
              isSelected={selectedNodeIds.includes(node.id)}
              onClick={() => handleNodeClick(node.id)}
              onMove={position => handleNodeMove(node.id, position)}
            />
          ))}
        </g>

        {/* Mode indicators */}
        {mode.type !== 'SELECT' && (
          <text x={20} y={30} className="text-sm font-medium fill-blue-600">
            {mode.type === 'ADD_NODE' && 'Click to add node'}
            {mode.type === 'DRAW_EDGE' && !tempEdge && 'Click source node'}
            {mode.type === 'DRAW_EDGE' && tempEdge && 'Click target node'}
            {mode.type === 'DELETE' && 'Click to delete'}
          </text>
        )}
      </svg>
    );
  }
);
