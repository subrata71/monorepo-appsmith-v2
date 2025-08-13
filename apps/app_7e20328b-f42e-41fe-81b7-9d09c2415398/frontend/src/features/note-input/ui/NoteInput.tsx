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
    placeholder = 'What made you feel this way? Share your thoughts here... 💭',
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
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            📝 Add a Personal Note
          </h3>
          <p className="text-base text-muted-foreground mt-2">
            Express yourself freely - every thought matters! ✨
          </p>
        </div>

        <div className="relative">
          <Textarea
            value={note}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'min-h-24 resize-none rounded-xl border-2 text-base',
              'focus:ring-2 focus:ring-primary/20 focus:border-primary',
              'placeholder:text-muted-foreground/70',
              isOverLimit &&
                'border-red-300 focus-visible:border-red-500 focus-visible:ring-red-500/20'
            )}
            maxLength={maxLength + 50} // Allow some overflow for better UX
          />

          <div className="flex justify-between items-center mt-3">
            <div className="text-sm text-muted-foreground font-medium">
              {note.trim() && (
                <span className="flex items-center gap-1">
                  ✏️ {note.trim().split(/\s+/).length} word
                  {note.trim().split(/\s+/).length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div
              className={cn(
                'text-sm font-medium',
                isOverLimit
                  ? 'text-red-600'
                  : remainingChars <= 20
                    ? 'text-amber-600'
                    : 'text-muted-foreground'
              )}
            >
              {remainingChars} character
              {Math.abs(remainingChars) !== 1 ? 's' : ''}{' '}
              {isOverLimit ? 'over limit' : 'remaining'}
            </div>
          </div>

          {isOverLimit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
              <p className="text-sm text-red-700 flex items-center gap-2">
                ⚠️ Please keep your note under {maxLength} characters for the best experience
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
);

NoteInput.displayName = 'NoteInput';
