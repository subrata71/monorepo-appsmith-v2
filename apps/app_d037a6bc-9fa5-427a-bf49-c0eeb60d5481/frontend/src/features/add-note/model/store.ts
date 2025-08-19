/**
 * Add Note Feature Store
 *
 * Manages the state for the add note modal including form data,
 * submission state, and error handling.
 */

import { create } from 'zustand';

interface AddNoteState {
  // Modal state
  modalOpen: boolean;

  // Form fields
  fields: {
    title: string;
    body: string | null;
  };

  // Submission state
  submitting: boolean;
  submitError: string | null;
  fieldErrors: { [field: string]: string };
}

interface AddNoteActions {
  // Modal actions
  openModal: () => void;
  closeModal: () => void;

  // Form actions
  setField: (field: keyof AddNoteState['fields'], value: string | null) => void;
  resetForm: () => void;

  // Submission actions
  setSubmitting: (submitting: boolean) => void;
  setSubmitError: (error: string | null) => void;
  setFieldErrors: (errors: { [field: string]: string }) => void;
}

const initialState: AddNoteState = {
  modalOpen: false,
  fields: {
    title: '',
    body: null,
  },
  submitting: false,
  submitError: null,
  fieldErrors: {},
};

export const useAddNoteStore = create<AddNoteState & AddNoteActions>(set => ({
  ...initialState,

  // Modal actions
  openModal: () => set({ modalOpen: true }),
  closeModal: () =>
    set({
      modalOpen: false,
      // Reset form when modal closes
      fields: initialState.fields,
      submitError: null,
      fieldErrors: {},
    }),

  // Form actions
  setField: (field, value) =>
    set(state => ({
      fields: {
        ...state.fields,
        [field]: value,
      },
      // Clear field-specific errors when user types
      fieldErrors: {
        ...state.fieldErrors,
        [field]: undefined,
      },
    })),

  resetForm: () =>
    set({
      fields: initialState.fields,
      submitError: null,
      fieldErrors: {},
    }),

  // Submission actions
  setSubmitting: submitting => set({ submitting }),
  setSubmitError: error => set({ submitError: error }),
  setFieldErrors: errors => set({ fieldErrors: errors }),
}));
