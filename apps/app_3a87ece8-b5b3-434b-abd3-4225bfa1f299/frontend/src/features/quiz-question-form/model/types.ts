/**
 * QuizQuestionForm Feature Types
 *
 * Types for rendering and handling answer input for a question.
 */

import type { Question } from '@shared/api-types';

// QuizQuestionForm feature props
export interface QuizQuestionFormProps {
  question: Question;
  onAnswer: (optionId: string) => void;
  selectedOptionId?: string;
}

// QuizQuestionForm feature state
export interface QuizQuestionFormState {
  selectedOptionId: string | null;
}