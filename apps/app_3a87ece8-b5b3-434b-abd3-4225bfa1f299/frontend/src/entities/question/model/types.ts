/**
 * Question Entity Types
 *
 * Local types for question domain entities.
 */

export type { Question, Option } from '@shared/api-types';

// Question interaction state
export interface QuestionState {
  selectedOptionId: string | null;
  answered: boolean;
}

// Question callback props
export interface QuestionCallbacks {
  onAnswer: (optionId: string) => void;
}