/**
 * MoodEntryForm Widget
 *
 * Complete mood entry form combining mood selection, note input, and submission.
 * Manages the complete form state and handles form reset after successful submission.
 */

import React from 'react';
import { MoodSelection } from '@/features/mood-selection';
import { NoteInput } from '@/features/note-input';
import { SubmitMoodEntry } from '@/features/submit-mood-entry';
import type { MoodType } from '@/entities/mood-entry';

export interface MoodEntryFormProps {
  className?: string;
  onSubmitSuccess?: () => void;
}

export const MoodEntryForm = React.memo<MoodEntryFormProps>(
  ({ className, onSubmitSuccess }) => {
    const [selectedMood, setSelectedMood] = React.useState<MoodType | null>(
      null
    );
    const [note, setNote] = React.useState<string>('');

    const handleMoodSelect = React.useCallback((mood: MoodType) => {
      setSelectedMood(mood);
    }, []);

    const handleNoteChange = React.useCallback((newNote: string) => {
      setNote(newNote);
    }, []);

    const handleSubmitSuccess = React.useCallback(() => {
      // Reset form after successful submission
      setSelectedMood(null);
      setNote('');

      // Call external success callback if provided
      onSubmitSuccess?.();
    }, [onSubmitSuccess]);

    return (
      <div className={className}>
        <div className="space-y-8">
          <MoodSelection
            selectedMood={selectedMood}
            onSelect={handleMoodSelect}
          />

          {selectedMood && (
            <div className="border-t border-gray-100 pt-6">
              <NoteInput
                note={note}
                onNoteChange={handleNoteChange}
                maxLength={200}
              />
            </div>
          )}

          {selectedMood && (
            <div className="border-t border-gray-100 pt-6">
              <SubmitMoodEntry
                selectedMood={selectedMood}
                note={note}
                onSubmitSuccess={handleSubmitSuccess}
              />
            </div>
          )}
        </div>

        {selectedMood && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {note.trim()
                ? `Selected mood: ${selectedMood} with ${note.trim().split(/\s+/).length} word${note.trim().split(/\s+/).length !== 1 ? 's' : ''} in your note.`
                : `Selected mood: ${selectedMood}. Add a note above to complete your entry.`}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              All entries are stored privately in your browser only.
            </p>
          </div>
        )}
      </div>
    );
  }
);

MoodEntryForm.displayName = 'MoodEntryForm';
