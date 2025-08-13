/**
 * QuizStepper Widget Types
 *
 * Types for the main quiz orchestrator widget.
 */

import type { Quiz, QuizAttempt } from '@shared/api-types';

// Quiz step states
export type QuizStep = 'start' | 'question' | 'results';

// QuizStepper widget props
export interface QuizStepperProps {
  quiz: Quiz;
  onSubmit?: (attempt: QuizAttempt) => void;
}

// QuizStepper widget state
export interface QuizStepperState {
  step: QuizStep;
  currentQuestionIndex: number;
  attempt: QuizAttempt | null;
  answers: Record<string, string>; // questionId -> selectedOptionId
  loading: boolean;
  error: string | null;
}