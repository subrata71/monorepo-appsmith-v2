/**
 * Notes Listing Feature Public API
 *
 * This file exports the public interface of the Notes Listing feature.
 * Other layers can only import from this file to access notes listing functionality.
 */

// Store
export { useNotesListStore } from './model/store';

// API Queries
export { useNotesWithPagination } from './api/queries';
