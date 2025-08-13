/**
 * Quiz Entity Types
 *
 * Local types for quiz domain entities.
 * These extend or simplify the API types for frontend use.
 */

export type { Quiz, Question, Option } from '@shared/api-types';

// Frontend-specific quiz state types
export interface QuizState {
  quiz: Quiz | null;
  loading: boolean;
  error: string | null;
}

// Quiz progress tracking
export interface QuizProgress {
  currentQuestionIndex: number;
  totalQuestions: number;
  answersCount: number;
}

// Quiz start state
export interface QuizStartData {
  quiz: Quiz;
  onStart: () => void;
}
