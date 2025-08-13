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
            <div className="border-t border-accent/20 pt-8">
              <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-2xl p-6">
                <NoteInput
                  note={note}
                  onNoteChange={handleNoteChange}
                  maxLength={200}
                />
              </div>
            </div>
          )}

          {selectedMood && (
            <div className="border-t border-accent/20 pt-8">
              <SubmitMoodEntry
                selectedMood={selectedMood}
                note={note}
                onSubmitSuccess={handleSubmitSuccess}
              />
            </div>
          )}
        </div>

        {selectedMood && (
          <div className="mt-8 text-center bg-muted/30 rounded-xl p-6">
            <p className="text-foreground font-medium">
              {note.trim()
                ? `💫 Mood: ${selectedMood} with ${note.trim().split(/\s+/).length} word${note.trim().split(/\s+/).length !== 1 ? 's' : ''} in your note 💫`
                : `💫 Mood: ${selectedMood}. Add a note above to complete your entry! 💫`}
            </p>
            <p className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-1">
              🔒 All entries are stored privately in your browser only
            </p>
          </div>
        )}
      </div>
    );
  }
);

MoodEntryForm.displayName = 'MoodEntryForm';
