/**
 * QA Logic Page Types
 *
 * Types for the Q&A Logic page component.
 */

import type { Question } from '@shared/api-types';

// QA Logic page state
export interface QALogicPageState {
  question: Question | null;
  loading: boolean;
  error: string | null;
}

// Mock question for the QA Logic demo page
export const mockQuestion: Question = {
  id: '1',
  quizId: '1',
  text: 'What is the capital of France?',
  options: [
    { id: '1', questionId: '1', text: 'London' },
    { id: '2', questionId: '1', text: 'Berlin' },
    { id: '3', questionId: '1', text: 'Paris' },
    { id: '4', questionId: '1', text: 'Madrid' },
  ],
  correctOptionId: '3',
  order: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};