/**
 * Quiz Start Feature Types
 *
 * Types for quiz start screen logic and interactions.
 */

import type { Quiz } from '@/entities';

// Quiz start feature props
export interface QuizStartProps {
  quiz: Quiz.Quiz;
  onStart: () => void;
}

// Quiz start feature state
export interface QuizStartState {
  isStarting: boolean;
}