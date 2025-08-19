/**
 * Note Editor Store
 *
 * Manages the state of the note editor including draft autosave,
 * field validation, save/cancel actions, and UI feedback.
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { Note } from '@/entities/note';

interface NoteEditorState {
  // Editor mode
  mode: 'new' | 'edit';
  noteId: string | null;

  // Form fields
  fields: {
    title: string;
    body: string | null;
  };

  // Draft management
  draft: {
    title: string;
    body: string | null;
  };
  draftRestored: boolean;

  // Loading states
  loading: boolean;
  saving: boolean;

  // Error states
  saveError: string | null;
  fieldErrors: Record<string, string>;

  // Actions
  setMode: (mode: 'new' | 'edit') => void;
  setNoteId: (id: string | null) => void;
  loadNote: (note: Note) => void;
  setField: (
    field: keyof NoteEditorState['fields'],
    value: string | null
  ) => void;
  setFields: (fields: Partial<NoteEditorState['fields']>) => void;

  // Draft management
  autosaveDraft: () => void;
  restoreDraft: (draftKey: string) => void;
  clearDraft: (draftKey: string) => void;
  setDraftRestored: (restored: boolean) => void;

  // Save/cancel actions
  setSaving: (saving: boolean) => void;
  setSaveError: (error: string | null) => void;
  setFieldErrors: (errors: Record<string, string>) => void;
  resetEditor: () => void;

  // Loading state
  setLoading: (loading: boolean) => void;
}

const initialFields = { title: '', body: null };
const initialDraft = { title: '', body: null };

export const useNoteEditorStore = create<NoteEditorState>()(
  devtools(
    (set, get) => ({
      // Initial state
      mode: 'new',
      noteId: null,
      fields: initialFields,
      draft: initialDraft,
      draftRestored: false,
      loading: false,
      saving: false,
      saveError: null,
      fieldErrors: {},

      // Actions
      setMode: mode => set({ mode }),

      setNoteId: id => set({ noteId: id }),

      loadNote: note =>
        set({
          mode: 'edit',
          noteId: note.id,
          fields: {
            title: note.title,
            body: note.body,
          },
          draft: {
            title: note.title,
            body: note.body,
          },
        }),

      setField: (field, value) =>
        set(state => ({
          fields: {
            ...state.fields,
            [field]: value,
          },
          draft: {
            ...state.draft,
            [field]: value,
          },
        })),

      setFields: fields =>
        set(state => ({
          fields: {
            ...state.fields,
            ...fields,
          },
          draft: {
            ...state.draft,
            ...fields,
          },
        })),

      autosaveDraft: () => {
        const { draft, mode, noteId } = get();
        const draftKey = mode === 'edit' && noteId ? `edit-${noteId}` : 'new';

        try {
          localStorage.setItem(`note-draft-${draftKey}`, JSON.stringify(draft));
        } catch (error) {
          console.warn('Failed to save draft to localStorage:', error);
        }
      },

      restoreDraft: draftKey => {
        try {
          const savedDraft = localStorage.getItem(`note-draft-${draftKey}`);
          if (savedDraft) {
            const parsedDraft = JSON.parse(savedDraft);
            set({
              fields: parsedDraft,
              draft: parsedDraft,
              draftRestored: true,
            });
          }
        } catch (error) {
          console.warn('Failed to restore draft from localStorage:', error);
        }
      },

      clearDraft: draftKey => {
        try {
          localStorage.removeItem(`note-draft-${draftKey}`);
          set({ draftRestored: false });
        } catch (error) {
          console.warn('Failed to clear draft from localStorage:', error);
        }
      },

      setDraftRestored: restored => set({ draftRestored: restored }),

      setSaving: saving => set({ saving }),

      setSaveError: error => set({ saveError: error }),

      setFieldErrors: errors => set({ fieldErrors: errors }),

      setLoading: loading => set({ loading }),

      resetEditor: () =>
        set({
          mode: 'new',
          noteId: null,
          fields: initialFields,
          draft: initialDraft,
          draftRestored: false,
          loading: false,
          saving: false,
          saveError: null,
          fieldErrors: {},
        }),
    }),
    {
      name: 'note-editor-store',
    }
  )
);
