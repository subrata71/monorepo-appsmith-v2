/**
 * Mood Entry Helper Types
 * 
 * This file provides additional types for mood entry operations
 * that complement the generated OpenAPI types.
 */

import type { paths } from './generated-types.js';

// Extract operation types from OpenAPI paths
export namespace MoodEntryRoutes {
  export type List = {
    Reply: paths['/mood-entries']['get']['responses']['200']['content']['application/json'];
  };

  export type Create = {
    Body: paths['/mood-entries']['post']['requestBody']['content']['application/json'];
    Reply: paths['/mood-entries']['post']['responses']['201']['content']['application/json'];
  };

  export type GetById = {
    Params: {
      id: string;
    };
    Reply: paths['/mood-entries/{id}']['get']['responses']['200']['content']['application/json'];
  };

  export type Update = {
    Params: {
      id: string;
    };
    Body: paths['/mood-entries/{id}']['put']['requestBody']['content']['application/json'];
    Reply: paths['/mood-entries/{id}']['put']['responses']['200']['content']['application/json'];
  };

  export type Delete = {
    Params: {
      id: string;
    };
  };
}

// Utility types for mood operations
export type MoodType = 'happy' | 'sad' | 'neutral' | 'excited' | 'anxious' | 'calm';

export interface MoodOption {
  type: MoodType;
  label: string;
  emoji: string;
  color: string;
}

export interface MoodFormData {
  mood: MoodType | null;
  note: string;
}

export interface MoodEntryFormState {
  selectedMood: MoodType | null;
  note: string;
  isSubmitting: boolean;
  showSnackbar: boolean;
  snackbarMessage: string;
}