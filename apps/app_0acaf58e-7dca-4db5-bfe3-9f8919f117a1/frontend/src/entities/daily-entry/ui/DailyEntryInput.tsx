/**
 * Daily Entry Input Component
 * 
 * Provides a text input with validation for entering today's sentence
 */

import React, { useCallback, useMemo } from 'react';
import { Textarea } from '@/shared/ui/textarea';
import { Button } from '@/shared/ui/button';
import { Alert, AlertDescription } from '@/shared/ui/alert';
import { useDailyEntryStore } from '../model/store';
import { getCharacterCountInfo, SENTENCE_MAX_LENGTH } from '@/shared/lib/validation';

interface DailyEntryInputProps {
  placeholder?: string;
  onSave?: (sentence: string) => void;
  onCancel?: () => void;
  disabled?: boolean;
  showSaveButton?: boolean;
  showCancelButton?: boolean;
}

export const DailyEntryInput = React.memo<DailyEntryInputProps>(({
  placeholder = "What's on your mind today? Write one sentence...",
  onSave,
  onCancel,
  disabled = false,
  showSaveButton = true,
  showCancelButton = false,
}) => {
  // Store selectors
  const input = useDailyEntryStore(state => state.input);
  const validationResult = useDailyEntryStore(state => state.validationResult);
  const isSaving = useDailyEntryStore(state => state.isSaving);
  const error = useDailyEntryStore(state => state.error);
  
  // Store actions
  const setInput = useDailyEntryStore(state => state.setInput);
  
  // Character count info
  const characterInfo = useMemo(() => getCharacterCountInfo(input), [input]);
  
  // Input change handler
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  }, [setInput]);
  
  // Save handler
  const handleSave = useCallback(() => {
    if (validationResult?.isValid && onSave) {
      onSave(input.trim());
    }
  }, [input, validationResult, onSave]);
  
  // Cancel handler
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);
  
  // Determine if save button should be disabled
  const isSaveDisabled = useMemo(() => {
    return disabled || 
           isSaving || 
           !validationResult?.isValid || 
           input.trim().length === 0;
  }, [disabled, isSaving, validationResult, input]);
  
  return (
    <div className="space-y-4">
      {/* Main input area */}
      <div className="space-y-2">
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled || isSaving}
          maxLength={SENTENCE_MAX_LENGTH + 50} // Allow slight overage for better UX
          className="min-h-[120px] resize-none"
          aria-describedby={validationResult?.error ? 'entry-error' : 'character-count'}
        />
        
        {/* Character count */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex-1">
            {validationResult?.error && (
              <span className="text-red-500" id="entry-error">
                {validationResult.error}
              </span>
            )}
          </div>
          <div 
            className={characterInfo.colorClass}
            id="character-count"
          >
            {characterInfo.count}/{SENTENCE_MAX_LENGTH}
          </div>
        </div>
      </div>
      
      {/* Server error */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Action buttons */}
      {(showSaveButton || showCancelButton) && (
        <div className="flex gap-3 justify-end">
          {showCancelButton && (
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={disabled || isSaving}
            >
              Cancel
            </Button>
          )}
          
          {showSaveButton && (
            <Button
              onClick={handleSave}
              disabled={isSaveDisabled}
            >
              {isSaving ? 'Saving...' : 'Save Entry'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
});