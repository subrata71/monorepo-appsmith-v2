/**
 * Quiz Attempt API Types and Route Helpers
 *
 * Type-safe route definitions for Quiz Attempt-related API endpoints.
 * Use these types to ensure API consistency between frontend and backend.
 */

import type { paths, operations, components } from './generated-types.js';

// Entity Types (re-exported for convenience)
export type QuizAttempt = components['schemas']['QuizAttempt'];
export type Answer = components['schemas']['Answer'];
export type NewQuizAttempt = components['schemas']['NewQuizAttempt'];
export type UpdateQuizAttempt = components['schemas']['UpdateQuizAttempt'];
export type NewAnswer = components['schemas']['NewAnswer'];

// Route Types
export namespace QuizAttemptRoutes {
  export type Create = {
    path: '/api/quiz-attempts';
    method: 'POST';
    body: operations['createQuizAttempt']['requestBody']['content']['application/json'];
    response: operations['createQuizAttempt']['responses'][201]['content']['application/json'];
    error: operations['createQuizAttempt']['responses'][400 | 404 | 500]['content']['application/json'];
  };

  export type Update = {
    path: '/api/quiz-attempts/{id}';
    method: 'PUT';
    params: paths['/api/quiz-attempts/{id}']['parameters']['path'];
    body: operations['updateQuizAttempt']['requestBody']['content']['application/json'];
    response: operations['updateQuizAttempt']['responses'][200]['content']['application/json'];
    error: operations['updateQuizAttempt']['responses'][400 | 404 | 500]['content']['application/json'];
  };
}

// Helper Types
export type QuizAttemptWithoutTimestamps = Omit<QuizAttempt, 'createdAt' | 'updatedAt'>;
export type CreateQuizAttemptData = NewQuizAttempt;
export type QuizAttemptSummary = Pick<QuizAttempt, 'id' | 'score' | 'completed'>;

// Answer Helper Types
export type AnswerWithoutId = Omit<Answer, 'id'>;
export type CreateAnswerData = NewAnswer;