/**
 * QA Interaction Card Widget Types
 *
 * Types for the Q&A interaction card widget.
 */

import type { Question } from '@shared/api-types';

export interface QAInteractionCardProps {
  question: Question;
  onAnswered?: (optionId: string, isCorrect: boolean) => void;
}