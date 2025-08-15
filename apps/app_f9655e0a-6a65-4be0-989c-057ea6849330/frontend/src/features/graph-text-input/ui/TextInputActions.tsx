import React from 'react';
import { Button } from '@/shared/ui/button';
import { RefreshCw, Trash2, Check } from 'lucide-react';

interface TextInputActionsProps {
  onApply: () => void;
  onClear: () => void;
  onReset: () => void;
  canApply: boolean;
  isLoading?: boolean;
  isDirty: boolean;
}

export const TextInputActions = React.memo<TextInputActionsProps>(({
  onApply,
  onClear,
  onReset,
  canApply,
  isLoading = false,
  isDirty,
}) => {
  return (
    <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-200">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={isLoading || !isDirty}
          className="text-xs"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Reset
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          disabled={isLoading}
          className="text-xs"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Clear
        </Button>
      </div>

      <Button
        onClick={onApply}
        disabled={!canApply || isLoading}
        size="sm"
        className="text-xs"
      >
        <Check className="h-3 w-3 mr-1" />
        {isLoading ? 'Applying...' : 'Apply'}
      </Button>
    </div>
  );
});