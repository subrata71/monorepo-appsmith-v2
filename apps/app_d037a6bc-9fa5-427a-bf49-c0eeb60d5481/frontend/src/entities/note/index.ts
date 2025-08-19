/**
 * Note Entity Public API
 *
 * This file exports the public interface of the Note entity.
 * Other layers can only import from this file to access Note functionality.
 */

// Types
export type {
  Note,
  NewNote,
  UpdateNote,
  NotesListQuery,
  NotesListResponse,
} from './model/types';

// API Queries
export {
  useNotes,
  useNote,
  useCreateNote,
  useUpdateNote,
  useDeleteNote,
  noteKeys,
} from './api/queries';
