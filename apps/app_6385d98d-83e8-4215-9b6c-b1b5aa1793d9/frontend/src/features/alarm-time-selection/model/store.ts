import { create } from 'zustand';
import type { AlarmState } from '@/entities/alarm';

interface AlarmTimeSelectionState
  extends Omit<AlarmState, 'alarm' | 'loading' | 'error'> {
  selectedTime: string;
  isSaving: boolean;
  error: string | null;
}

interface AlarmTimeSelectionActions {
  setSelectedTime: (time: string) => void;
  setSaving: (isSaving: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

type AlarmTimeSelectionStore = AlarmTimeSelectionState &
  AlarmTimeSelectionActions;

const initialState: AlarmTimeSelectionState = {
  selectedTime: '',
  isSaving: false,
  error: null,
};

/**
 * Store for alarm time selection state
 *
 * Manages the local UI state for time selection, saving status, and errors.
 * Uses Zustand for client-side state management following FSD patterns.
 */
export const useAlarmTimeSelectionStore = create<AlarmTimeSelectionStore>(
  set => ({
    ...initialState,

    setSelectedTime: time =>
      set(state => ({
        selectedTime: time,
        // Clear error when user changes time
        error: state.error ? null : state.error,
      })),

    setSaving: isSaving =>
      set(() => ({
        isSaving,
      })),

    setError: error =>
      set(() => ({
        error,
      })),

    reset: () =>
      set(() => ({
        ...initialState,
      })),
  })
);
