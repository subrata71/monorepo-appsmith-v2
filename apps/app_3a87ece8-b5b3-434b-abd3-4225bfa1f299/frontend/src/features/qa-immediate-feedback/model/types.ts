/**
 * QA Immediate Feedback Feature Types
 *
 * Types for the immediate feedback Q&A feature.
 */

import type { Question } from '@shared/api-types';

export interface QAImmediateFeedbackProps {
  question: Question;
  onAnswered?: (optionId: string, isCorrect: boolean) => void;
}