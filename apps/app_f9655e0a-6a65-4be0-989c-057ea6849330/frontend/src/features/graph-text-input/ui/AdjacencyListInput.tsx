import React from 'react';
import { Textarea } from '@/shared/ui/textarea';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { validateAdjacencyListFormat } from '@/shared/lib/graph-parser';
import { useGraphStore } from '@/entities/graph';

interface AdjacencyListInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const AdjacencyListInput = React.memo<AdjacencyListInputProps>(({
  value,
  onChange,
  placeholder = "Enter adjacency list...\n\nExample:\nA: B, C\nB: D\nC: D\nD:",
  className,
}) => {
  const textInputDirty = useGraphStore(state => state.textInputDirty);
  
  // Validate the current input
  const validation = React.useMemo(() => {
    if (!value.trim()) {
      return { isValid: true, errors: [] };
    }
    return validateAdjacencyListFormat(value);
  }, [value]);

  const hasErrors = !validation.isValid && validation.errors.length > 0;

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Adjacency List
          </label>
          {textInputDirty && (
            <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded">
              Modified
            </span>
          )}
        </div>
        
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`min-h-[200px] font-mono text-sm ${
            hasErrors ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
          }`}
          rows={10}
        />
        
        <div className="text-xs text-gray-500">
          Format: <code>NodeId: TargetId1, TargetId2</code>
        </div>
      </div>

      {/* Validation errors */}
      {hasErrors && (
        <div className="space-y-2">
          {validation.errors.map((error, index) => (
            <Alert key={index} variant="destructive" className="py-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {error}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
});