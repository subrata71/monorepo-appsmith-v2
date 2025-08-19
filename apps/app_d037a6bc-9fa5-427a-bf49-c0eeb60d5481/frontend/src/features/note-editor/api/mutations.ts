/**
 * Note Editor API Mutations
 *
 * Specialized mutations for the note editor feature that handle
 * saving notes in both create and update scenarios.
 */

import { useNavigate } from 'react-router';
import { toast } from 'sonner';

import { useCreateNote, useUpdateNote } from '@/entities/note';

import type { Note, NewNote, UpdateNote } from '@/entities/note';

/**
 * Hook for saving a note in the editor context
 * Handles both creation and updates with proper navigation and feedback
 */
export const useSaveNote = (noteId?: string) => {
  const navigate = useNavigate();
  const createNoteMutation = useCreateNote();
  const updateNoteMutation = useUpdateNote();

  const isEditing = !!noteId;
  const isLoading =
    createNoteMutation.isPending || updateNoteMutation.isPending;

  const saveNote = async (noteData: NewNote | UpdateNote): Promise<Note> => {
    try {
      let savedNote: Note;

      if (isEditing) {
        // Update existing note
        savedNote = await updateNoteMutation.mutateAsync({
          id: noteId,
          ...noteData,
        });
        toast.success('Note updated successfully');
      } else {
        // Create new note
        savedNote = await createNoteMutation.mutateAsync(noteData as NewNote);
        toast.success('Note created successfully');
      }

      // Navigate back to notes list
      navigate('/');
      return savedNote;
    } catch (error) {
      const errorMessage = isEditing
        ? 'Failed to update note'
        : 'Failed to create note';
      toast.error(errorMessage);
      throw error;
    }
  };

  return {
    saveNote,
    isLoading,
    isEditing,
    error: createNoteMutation.error || updateNoteMutation.error,
  };
};
