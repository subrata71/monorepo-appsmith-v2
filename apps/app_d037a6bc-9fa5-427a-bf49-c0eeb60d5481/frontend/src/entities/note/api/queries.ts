/**
 * Note Entity API Queries
 *
 * TanStack Query hooks for Note entity CRUD operations.
 * These queries handle server state management for notes.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { get, post, put, del, handleError } from '@/shared/api';

import type {
  Note,
  NewNote,
  UpdateNote,
  NotesListQuery,
  NotesListResponse,
} from '../model/types';

// Query Keys
export const noteKeys = {
  all: ['notes'] as const,
  lists: () => [...noteKeys.all, 'list'] as const,
  list: (filters: NotesListQuery) => [...noteKeys.lists(), filters] as const,
  details: () => [...noteKeys.all, 'detail'] as const,
  detail: (id: string) => [...noteKeys.details(), id] as const,
};

/**
 * Hook to fetch a list of notes
 */
export const useNotes = (query: NotesListQuery = {}) => {
  return useQuery({
    queryKey: noteKeys.list(query),
    queryFn: async (): Promise<NotesListResponse> => {
      const { data, error } = await get('/api/notes', {
        params: {
          query: {
            limit: query.limit,
            offset: query.offset,
            sortBy: query.sortBy,
            sortOrder: query.sortOrder,
          },
        },
      });

      if (error) handleError(error);

      // Handle the case where data might be undefined
      if (!data) {
        throw new Error('No data received from API');
      }

      return data as NotesListResponse;
    },
  });
};

/**
 * Hook to fetch a single note by ID
 */
export const useNote = (id: string) => {
  return useQuery({
    queryKey: noteKeys.detail(id),
    queryFn: async (): Promise<Note> => {
      const { data, error } = await get('/api/notes/{id}', {
        params: {
          path: { id },
        },
      });

      if (error) handleError(error);

      // Handle the case where data might be undefined
      if (!data?.data) {
        throw new Error('No data received from API');
      }

      return data.data as Note;
    },
    enabled: !!id,
  });
};

/**
 * Hook to create a new note
 */
export const useCreateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteData: NewNote): Promise<Note> => {
      const { data, error } = await post('/api/notes', {
        body: noteData,
      });

      if (error) handleError(error);

      if (!data?.data) {
        throw new Error('No data received from API');
      }

      return data.data as Note;
    },
    onSuccess: newNote => {
      // Invalidate and refetch notes list
      queryClient.invalidateQueries({ queryKey: noteKeys.lists() });

      // Optionally add the new note to the cache
      queryClient.setQueryData(noteKeys.detail(newNote.id), newNote);
    },
  });
};

/**
 * Hook to update an existing note
 */
export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...updateData
    }: UpdateNote & { id: string }): Promise<Note> => {
      const { data, error } = await put('/api/notes/{id}', {
        params: {
          path: { id },
        },
        body: updateData,
      });

      if (error) handleError(error);

      if (!data?.data) {
        throw new Error('No data received from API');
      }

      return data.data as Note;
    },
    onSuccess: updatedNote => {
      // Update the specific note in cache
      queryClient.setQueryData(noteKeys.detail(updatedNote.id), updatedNote);

      // Invalidate notes list to show updated data
      queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
    },
  });
};

/**
 * Hook to delete a note
 */
export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const { error } = await del('/api/notes/{id}', {
        params: {
          path: { id },
        },
      });

      if (error) handleError(error);
    },
    onSuccess: (_, id) => {
      // Remove the note from cache
      queryClient.removeQueries({ queryKey: noteKeys.detail(id) });

      // Invalidate notes list to show updated data
      queryClient.invalidateQueries({ queryKey: noteKeys.lists() });
    },
  });
};
