import React, { useState, useCallback, useMemo } from 'react';
import { Input, Label, Button } from '@/shared/ui';
import { useVisualizationStore } from '@/entities/visualization';
import { validateArrayInput, formatArrayForInput } from '@/entities/visualization/lib/array-utils';

export const ArrayInputField = React.memo(() => {
  const [inputValue, setInputValue] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const array = useVisualizationStore(state => state.array);
  const setArray = useVisualizationStore(state => state.setArray);
  const setError = useVisualizationStore(state => state.setError);
  const status = useVisualizationStore(state => state.status);

  // Update input when array changes externally (e.g., from random generation)
  React.useEffect(() => {
    if (array.length > 0) {
      setInputValue(formatArrayForInput(array));
      setValidationError(null);
    } else {
      setInputValue('');
    }
  }, [array]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Clear previous errors
    setValidationError(null);
    setError(null);
  }, [setError]);

  const handleApplyArray = useCallback(() => {
    const validation = validateArrayInput(inputValue);
    
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid input');
      setError(validation.error || 'Invalid input');
      return;
    }
    
    if (validation.array) {
      setArray(validation.array);
      setValidationError(null);
      setError(null);
    }
  }, [inputValue, setArray, setError]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyArray();
    }
  }, [handleApplyArray]);

  const isDisabled = useMemo(() => status === 'running', [status]);
  const hasError = useMemo(() => Boolean(validationError), [validationError]);

  return (
    <div className="space-y-2">
      <Label htmlFor="array-input">
        Enter Array (comma-separated numbers, 1-100)
      </Label>
      <div className="flex gap-2">
        <Input
          id="array-input"
          type="text"
          placeholder="e.g., 3, 1, 4, 1, 5, 9, 2, 6"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={isDisabled}
          aria-invalid={hasError}
          className="flex-1"
        />
        <Button 
          onClick={handleApplyArray}
          disabled={isDisabled || !inputValue.trim()}
          variant="default"
          size="default"
        >
          Apply
        </Button>
      </div>
      {validationError && (
        <p className="text-sm text-destructive" role="alert">
          {validationError}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Enter 2-20 numbers between 1 and 100, separated by commas
      </p>
    </div>
  );
});