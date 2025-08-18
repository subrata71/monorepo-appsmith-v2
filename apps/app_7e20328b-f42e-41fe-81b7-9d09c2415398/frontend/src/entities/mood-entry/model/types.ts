/**
 * MoodEntry Entity Types
 *
 * Domain types for mood entry operations and UI state management.
 */

import type { components } from '@shared/api-types/generated-types.js';
import type { MoodType, MoodOption } from '@shared/api-types/mood-entry.js';

// Generated types from OpenAPI
export type MoodEntry = components['schemas']['MoodEntry'];
export type CreateMoodEntryRequest =
  components['schemas']['CreateMoodEntryRequest'];
export type UpdateMoodEntryRequest =
  components['schemas']['UpdateMoodEntryRequest'];

// Re-export utility types
export type { MoodType, MoodOption } from '@shared/api-types/mood-entry.js';

// Available mood options with UI metadata - cheerful colors and friendly emojis
export const MOOD_OPTIONS: MoodOption[] = [
  {
    type: 'happy',
    label: 'Happy',
    emoji: '😃',
    color:
      'bg-mood-happy text-mood-happy-fg hover:brightness-105 border-mood-happy-fg/20',
  },
  {
    type: 'sad',
    label: 'Sad',
    emoji: '🥺',
    color:
      'bg-mood-sad text-mood-sad-fg hover:brightness-105 border-mood-sad-fg/20',
  },
  {
    type: 'neutral',
    label: 'Neutral',
    emoji: '😊',
    color:
      'bg-mood-neutral text-mood-neutral-fg hover:brightness-105 border-mood-neutral-fg/20',
  },
  {
    type: 'excited',
    label: 'Excited',
    emoji: '🤗',
    color:
      'bg-mood-excited text-mood-excited-fg hover:brightness-105 border-mood-excited-fg/20',
  },
  {
    type: 'anxious',
    label: 'Anxious',
    emoji: '🌻',
    color:
      'bg-mood-anxious text-mood-anxious-fg hover:brightness-105 border-mood-anxious-fg/20',
  },
  {
    type: 'calm',
    label: 'Calm',
    emoji: '🌸',
    color:
      'bg-mood-calm text-mood-calm-fg hover:brightness-105 border-mood-calm-fg/20',
  },
] as const;

// Helper function to get mood option by type
export const getMoodOption = (type: MoodType): MoodOption | undefined => {
  return MOOD_OPTIONS.find(option => option.type === type);
};

// Helper function to validate mood type
export const isValidMoodType = (value: string): value is MoodType => {
  return MOOD_OPTIONS.some(option => option.type === value);
};
