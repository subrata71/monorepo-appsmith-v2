import React from 'react';
import { Button } from '@/shared/ui/button';
import { 
  MousePointer, 
  Plus, 
  GitBranch, 
  Trash2, 
  Undo, 
  Redo,
  Square,
  CircleDot
} from 'lucide-react';
import type { GraphEditorMode } from '@/entities/graph';

interface GraphToolbarProps {
  mode: GraphEditorMode;
  onModeChange: (mode: GraphEditorMode) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  selectedNodeCount?: number;
  selectedEdgeCount?: number;
}

export const GraphToolbar = React.memo<GraphToolbarProps>(({
  mode,
  onModeChange,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  selectedNodeCount = 0,
  selectedEdgeCount = 0,
}) => {
  const toolButtons = [
    {
      mode: { type: 'SELECT' as const },
      icon: MousePointer,
      label: 'Select',
      tooltip: 'Select and move nodes',
    },
    {
      mode: { type: 'ADD_NODE' as const },
      icon: Plus,
      label: 'Add Node',
      tooltip: 'Click on canvas to add new nodes',
    },
    {
      mode: { type: 'DRAW_EDGE' as const },
      icon: GitBranch,
      label: 'Draw Edge',
      tooltip: 'Click two nodes to create an edge',
    },
    {
      mode: { type: 'DELETE' as const },
      icon: Trash2,
      label: 'Delete',
      tooltip: 'Click nodes or edges to delete them',
    },
  ];

  return (
    <div className="flex items-center gap-2 p-4 bg-white border-b border-gray-200">
      {/* Mode selection buttons */}
      <div className="flex items-center gap-1 border border-gray-200 rounded-md p-1">
        {toolButtons.map(({ mode: buttonMode, icon: Icon, label, tooltip }) => (
          <Button
            key={buttonMode.type}
            variant={mode.type === buttonMode.type ? 'default' : 'ghost'}
            size="sm"
            className="h-8 px-3"
            onClick={() => onModeChange(buttonMode)}
            title={tooltip}
          >
            <Icon className="h-4 w-4 mr-1" />
            {label}
          </Button>
        ))}
      </div>

      {/* Separator */}
      <div className="w-px h-6 bg-gray-200" />

      {/* Undo/Redo buttons */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Selection info */}
      {(selectedNodeCount > 0 || selectedEdgeCount > 0) && (
        <>
          <div className="w-px h-6 bg-gray-200" />
          <div className="flex items-center gap-2 text-sm text-gray-600">
            {selectedNodeCount > 0 && (
              <span className="flex items-center gap-1">
                <CircleDot className="h-3 w-3" />
                {selectedNodeCount} node{selectedNodeCount !== 1 ? 's' : ''}
              </span>
            )}
            {selectedEdgeCount > 0 && (
              <span className="flex items-center gap-1">
                <Square className="h-3 w-3" />
                {selectedEdgeCount} edge{selectedEdgeCount !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </>
      )}

      {/* Current mode indicator */}
      <div className="ml-auto flex items-center gap-2 text-sm text-gray-600">
        <span className="font-medium">Mode:</span>
        <span className="capitalize">{mode.type.toLowerCase().replace('_', ' ')}</span>
      </div>
    </div>
  );
});