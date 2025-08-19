/**
 * Note Entity Types
 *
 * Type definitions for the Note domain entity based on OpenAPI specification.
 * These types represent the core domain model for notes.
 */

export interface Note {
  /** Unique identifier for the note */
  id: string;
  /** The note title */
  title: string;
  /** The note content/body (optional) */
  body?: string | null;
  /** When the note was created */
  createdAt: string;
  /** When the note was last updated */
  updatedAt: string;
}

export interface NewNote {
  /** The note title */
  title: string;
  /** The note content/body (optional) */
  body?: string | null;
}

export interface UpdateNote {
  /** The note title (optional for updates) */
  title?: string;
  /** The note content/body (optional for updates) */
  body?: string | null;
}

export interface NotesListQuery {
  /** Maximum number of notes to return */
  limit?: number;
  /** Number of notes to skip */
  offset?: number;
  /** Field to sort by */
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  /** Sort order */
  sortOrder?: 'asc' | 'desc';
}

export interface NotesListResponse {
  /** Array of notes */
  data: Note[];
  /** Total number of notes */
  total: number;
}
