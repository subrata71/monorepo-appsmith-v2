/**
 * Daily Entry Store
 *
 * Manages state for the daily entry input and validation
 */

import { create } from 'zustand';
import {
  validateSentence,
  type SentenceValidationResult,
} from '@/shared/lib/validation';
import { canEditEntry } from '@/shared/lib/utils';
import {
  getDailyEntry,
  createTodaysDailyEntry,
  updateDailyEntry,
  ResponseError,
} from '@/shared/api';
import type { components } from '@app/shared/api-types/generated-types';

type DailyEntry = components['schemas']['DailyEntry'];

interface DailyEntryState {
  // Current input value
  input: string;

  // Validation state
  validationResult: SentenceValidationResult | null;

  // Loading states
  isLoading: boolean;
  isSaving: boolean;

  // Error handling
  error: string | null;

  // Current entry data
  entry: DailyEntry | null;

  // Edit state
  isEditing: boolean;

  // UI state
  canEdit: boolean;
}

interface DailyEntryActions {
  // Input management
  setInput: (value: string) => void;
  clearInput: () => void;

  // Validation
  validateInput: () => void;
  clearValidation: () => void;

  // State management
  setLoading: (loading: boolean) => void;
  setSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;

  // Entry management
  setEntry: (entry: DailyEntry | null) => void;
  loadEntry: (entryDate?: string) => Promise<void>;
  saveEntry: () => Promise<void>;
  updateEntry: () => Promise<void>;

  // Edit state
  startEditing: () => void;
  cancelEditing: () => void;

  // Reset
  reset: () => void;
}

type DailyEntryStore = DailyEntryState & DailyEntryActions;

const initialState: DailyEntryState = {
  input: '',
  validationResult: null,
  isLoading: false,
  isSaving: false,
  error: null,
  entry: null,
  isEditing: false,
  canEdit: true, // This would be calculated based on current time vs midnight
};

export const useDailyEntryStore = create<DailyEntryStore>((set, get) => ({
  ...initialState,

  setInput: (value: string) => {
    set({ input: value });
    // Auto-validate on input change
    get().validateInput();
  },

  clearInput: () => {
    set({ input: '', validationResult: null });
  },

  validateInput: () => {
    const { input } = get();
    const validationResult = validateSentence(input);
    set({ validationResult });
  },

  clearValidation: () => {
    set({ validationResult: null });
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  setSaving: (isSaving: boolean) => {
    set({ isSaving });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setEntry: (entry: DailyEntry | null) => {
    set({ entry });
  },

  startEditing: () => {
    const { entry } = get();
    if (entry) {
      set({
        isEditing: true,
        input: entry.sentence,
        validationResult: null,
      });
    }
  },

  cancelEditing: () => {
    const { entry } = get();
    set({
      isEditing: false,
      input: entry ? entry.sentence : '',
      validationResult: null,
      error: null,
    });
  },

  loadEntry: async (entryDate?: string) => {
    try {
      set({ isLoading: true, error: null });

      const entry = await getDailyEntry(entryDate);

      set({
        entry,
        input: entry ? entry.sentence : '',
        isLoading: false,
        canEdit: entry ? canEditEntry(entry.entryDate) : true, // New entries can be created today
      });
    } catch (error) {
      console.error('Failed to load entry:', error);
      set({
        isLoading: false,
        error:
          error instanceof ResponseError
            ? error.message
            : 'Failed to load entry',
      });
    }
  },

  saveEntry: async () => {
    const { input, validationResult } = get();

    if (!validationResult?.isValid || !input.trim()) {
      return;
    }

    try {
      set({ isSaving: true, error: null });

      const entry = await createTodaysDailyEntry(input.trim());

      set({
        entry,
        isSaving: false,
        isEditing: false,
        input: entry.sentence,
      });
    } catch (error) {
      console.error('Failed to save entry:', error);
      set({
        isSaving: false,
        error:
          error instanceof ResponseError
            ? error.message
            : 'Failed to save entry',
      });
    }
  },

  updateEntry: async () => {
    const { input, validationResult } = get();

    if (!validationResult?.isValid || !input.trim()) {
      return;
    }

    try {
      set({ isSaving: true, error: null });

      const entry = await updateDailyEntry(input.trim());

      set({
        entry,
        isSaving: false,
        isEditing: false,
        input: entry.sentence,
      });
    } catch (error) {
      console.error('Failed to update entry:', error);
      set({
        isSaving: false,
        error:
          error instanceof ResponseError
            ? error.message
            : 'Failed to update entry',
      });
    }
  },

  reset: () => {
    set(initialState);
  },
}));
