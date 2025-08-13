/**
 * SubmitMoodEntry Feature Component
 *
 * Handles validation and submission of mood entries with feedback.
 * Manages form state and provides loading/success states.
 */

import React from 'react';
import { Button } from '@/shared/ui/button';
import {
  createMoodEntry,
  validateMoodEntryRequest,
} from '@/shared/lib/mood-entry-storage';
import type { MoodType, CreateMoodEntryRequest } from '@/entities/mood-entry';
import { toast } from 'sonner';

export interface SubmitMoodEntryProps {
  selectedMood: MoodType | null;
  note: string;
  onSubmitSuccess?: () => void;
  disabled?: boolean;
  className?: string;
}

export const SubmitMoodEntry = React.memo<SubmitMoodEntryProps>(
  ({ selectedMood, note, onSubmitSuccess, disabled = false, className }) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);

    const isFormValid = React.useMemo(() => {
      return selectedMood !== null && note.length <= 200;
    }, [selectedMood, note]);

    const handleSubmit = React.useCallback(async () => {
      if (!selectedMood || isSubmitting) {
        return;
      }

      setIsSubmitting(true);

      try {
        const request: CreateMoodEntryRequest = {
          mood: selectedMood,
          note: note.trim() || null,
        };

        // Validate the request
        const validation = validateMoodEntryRequest(request);
        if (!validation.isValid) {
          toast.error(validation.error || 'Invalid mood entry data');
          return;
        }

        // Create the mood entry
        createMoodEntry(request);

        // Show success message
        const noteWords = request.note
          ? request.note.trim().split(/\s+/).length
          : 0;

        const successMessage = request.note
          ? `🎉 Amazing! Your ${selectedMood} mood with ${noteWords} thoughtful word${noteWords !== 1 ? 's' : ''} has been saved! 🎉`
          : `🌟 Wonderful! Your ${selectedMood} mood has been captured! 🌟`;

        toast.success(successMessage);

        // Call success callback if provided
        onSubmitSuccess?.();
      } catch (error) {
        console.error('Failed to save mood entry:', error);
        toast.error(
          error instanceof Error
            ? error.message
            : 'Failed to save mood entry. Please try again.'
        );
      } finally {
        setIsSubmitting(false);
      }
    }, [selectedMood, note, isSubmitting, onSubmitSuccess]);

    return (
      <div className={className}>
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid || disabled || isSubmitting}
          size="lg"
          className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              ⏳ Saving your mood...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              ✨ Save My Mood Entry ✨
            </span>
          )}
        </Button>

        {!isFormValid && selectedMood && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
            <p className="text-sm text-amber-800 text-center flex items-center justify-center gap-2">
              {!selectedMood
                ? '🤔 Please select a mood to continue'
                : note.length > 200
                  ? `✏️ Note is ${note.length - 200} characters over the limit - let's trim it down a bit!`
                  : '💭 Please check your entry'}
            </p>
          </div>
        )}
      </div>
    );
  }
);

SubmitMoodEntry.displayName = 'SubmitMoodEntry';
