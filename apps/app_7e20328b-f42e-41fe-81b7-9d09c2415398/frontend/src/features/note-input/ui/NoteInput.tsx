/**
 * NoteInput Feature Component
 *
 * Provides a multiline text input for notes with character limit enforcement.
 * Includes character counter and validation.
 */

import React from 'react';
import { Textarea } from '@/shared/ui/textarea';
import { cn } from '@/shared/lib/utils';

export interface NoteInputProps {
  note: string;
  onNoteChange: (note: string) => void;
  maxLength?: number;
  disabled?: boolean;
  placeholder?: string;
}

export const NoteInput = React.memo<NoteInputProps>(
  ({
    note,
    onNoteChange,
    maxLength = 200,
    disabled = false,
    placeholder = 'Add a note about your mood (optional)...',
  }) => {
    const remainingChars = maxLength - note.length;
    const isOverLimit = remainingChars < 0;

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = event.target.value;
        // Allow typing even if over limit, but don't prevent deletion
        onNoteChange(newValue);
      },
      [onNoteChange]
    );

    return (
      <div className="space-y-2">
        <div className="text-left">
          <h3 className="text-base font-medium text-gray-900">Add a Note</h3>
          <p className="text-sm text-gray-600 mt-1">
            Share what's on your mind (optional)
          </p>
        </div>

        <div className="relative">
          <Textarea
            value={note}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'min-h-20 resize-none',
              isOverLimit &&
                'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/20'
            )}
            maxLength={maxLength + 50} // Allow some overflow for better UX
          />

          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-gray-500">
              {note.trim() && (
                <span>
                  {note.trim().split(/\s+/).length} word
                  {note.trim().split(/\s+/).length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div
              className={cn(
                'text-xs',
                isOverLimit
                  ? 'text-red-600'
                  : remainingChars <= 20
                    ? 'text-amber-600'
                    : 'text-gray-500'
              )}
            >
              {remainingChars} character
              {Math.abs(remainingChars) !== 1 ? 's' : ''}{' '}
              {isOverLimit ? 'over limit' : 'remaining'}
            </div>
          </div>

          {isOverLimit && (
            <p className="text-xs text-red-600 mt-1">
              Please keep your note under {maxLength} characters
            </p>
          )}
        </div>
      </div>
    );
  }
);

NoteInput.displayName = 'NoteInput';
