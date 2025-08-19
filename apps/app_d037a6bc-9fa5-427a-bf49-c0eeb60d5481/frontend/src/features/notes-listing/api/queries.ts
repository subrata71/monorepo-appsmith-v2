/**
 * Notes Listing Feature API Queries
 *
 * Feature-level query hooks that combine entity queries with feature state.
 * These hooks integrate the notes listing store with the note entity queries.
 */

import { useMemo } from 'react';

import { useNotes } from '@/entities/note';

import { useNotesListStore } from '../model/store';

/**
 * Feature-level hook to get notes with current pagination/sorting from store
 */
export const useNotesWithPagination = () => {
  const getQueryParams = useNotesListStore(state => state.getQueryParams);

  const queryParams = useMemo(() => getQueryParams(), [getQueryParams]);

  return useNotes(queryParams);
};
