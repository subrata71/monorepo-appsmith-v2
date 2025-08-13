/**
 * Quiz Page Types
 *
 * Types for the quiz page component.
 */

import type { Quiz } from '@shared/api-types';

// Quiz page state
export interface QuizPageState {
  quiz: Quiz | null;
  loading: boolean;
  error: string | null;
}

// Mock data for development (to be replaced with API calls)
export const mockQuiz: Quiz = {
  id: '1',
  title: 'Sample Quiz',
  instructions:
    'Welcome to this sample quiz! Answer the questions to the best of your ability.',
  questions: [
    {
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
    },
    {
      id: '2',
      quizId: '1',
      text: 'Which planet is closest to the Sun?',
      options: [
        { id: '5', questionId: '2', text: 'Venus' },
        { id: '6', questionId: '2', text: 'Mercury' },
        { id: '7', questionId: '2', text: 'Earth' },
        { id: '8', questionId: '2', text: 'Mars' },
      ],
      correctOptionId: '6',
      order: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
