/**
 * Notes Listing Feature Store
 *
 * Zustand store for managing notes list UI state including
 * pagination, sorting, filters, and loading states.
 */

import { create } from 'zustand';

import type { NotesListQuery } from '@/entities/note';

interface NotesListState {
  // Pagination and sorting
  pagination: {
    limit: number;
    offset: number;
    sortBy: 'createdAt' | 'updatedAt' | 'title';
    sortOrder: 'asc' | 'desc';
  };

  // Actions
  setPagination: (pagination: Partial<NotesListState['pagination']>) => void;
  setLimit: (limit: number) => void;
  setOffset: (offset: number) => void;
  setSorting: (
    sortBy: NotesListState['pagination']['sortBy'],
    sortOrder: NotesListState['pagination']['sortOrder']
  ) => void;

  // Helper to get query params
  getQueryParams: () => NotesListQuery;

  // Reset to defaults
  resetFilters: () => void;
}

const DEFAULT_PAGINATION = {
  limit: 10,
  offset: 0,
  sortBy: 'createdAt' as const,
  sortOrder: 'desc' as const,
};

export const useNotesListStore = create<NotesListState>((set, get) => ({
  pagination: DEFAULT_PAGINATION,

  setPagination: newPagination =>
    set(state => ({
      pagination: { ...state.pagination, ...newPagination },
    })),

  setLimit: limit =>
    set(state => ({
      pagination: { ...state.pagination, limit, offset: 0 }, // Reset offset when changing limit
    })),

  setOffset: offset =>
    set(state => ({
      pagination: { ...state.pagination, offset },
    })),

  setSorting: (sortBy, sortOrder) =>
    set(state => ({
      pagination: { ...state.pagination, sortBy, sortOrder, offset: 0 }, // Reset offset when changing sort
    })),

  getQueryParams: () => {
    const { pagination } = get();
    return {
      limit: pagination.limit,
      offset: pagination.offset,
      sortBy: pagination.sortBy,
      sortOrder: pagination.sortOrder,
    };
  },

  resetFilters: () =>
    set({
      pagination: DEFAULT_PAGINATION,
    }),
}));
