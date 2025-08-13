/**
 * Affirmation Entity Types
 * 
 * Types for managing positive affirmation messages shown after mood submission.
 */

export interface Affirmation {
  id: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateAffirmationRequest = Omit<Affirmation, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateAffirmationRequest = Partial<Pick<Affirmation, 'message'>>;