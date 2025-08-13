/**
 * MoodEntry Entity Types
 * 
 * Domain types for mood entry operations and UI state management.
 */

import type { components } from '@shared/api-types/generated-types.js';
import type { MoodType, MoodOption } from '@shared/api-types/mood-entry.js';

// Generated types from OpenAPI
export type MoodEntry = components['schemas']['MoodEntry'];
export type CreateMoodEntryRequest = components['schemas']['CreateMoodEntryRequest'];
export type UpdateMoodEntryRequest = components['schemas']['UpdateMoodEntryRequest'];

// Re-export utility types
export type { MoodType, MoodOption } from '@shared/api-types/mood-entry.js';

// Available mood options with UI metadata
export const MOOD_OPTIONS: MoodOption[] = [
  {
    type: 'happy',
    label: 'Happy',
    emoji: '😊',
    color: 'bg-yellow-100 border-yellow-500 text-yellow-700 hover:bg-yellow-200',
  },
  {
    type: 'sad',
    label: 'Sad',
    emoji: '😢',
    color: 'bg-blue-100 border-blue-500 text-blue-700 hover:bg-blue-200',
  },
  {
    type: 'neutral',
    label: 'Neutral',
    emoji: '😐',
    color: 'bg-gray-100 border-gray-500 text-gray-700 hover:bg-gray-200',
  },
  {
    type: 'excited',
    label: 'Excited',
    emoji: '🤩',
    color: 'bg-orange-100 border-orange-500 text-orange-700 hover:bg-orange-200',
  },
  {
    type: 'anxious',
    label: 'Anxious',
    emoji: '😰',
    color: 'bg-red-100 border-red-500 text-red-700 hover:bg-red-200',
  },
  {
    type: 'calm',
    label: 'Calm',
    emoji: '😌',
    color: 'bg-green-100 border-green-500 text-green-700 hover:bg-green-200',
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