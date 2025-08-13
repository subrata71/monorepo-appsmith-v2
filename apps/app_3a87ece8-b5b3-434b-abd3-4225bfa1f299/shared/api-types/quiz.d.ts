/**
 * Quiz API Types and Route Helpers
 *
 * Type-safe route definitions for Quiz-related API endpoints.
 * Use these types to ensure API consistency between frontend and backend.
 */

import type { paths, operations, components } from './generated-types.js';

// Entity Types (re-exported for convenience)
export type Quiz = components['schemas']['Quiz'];
export type Question = components['schemas']['Question'];
export type Option = components['schemas']['Option'];

// Route Types
export namespace QuizRoutes {
  export type GetById = {
    path: '/api/quizzes/{id}';
    method: 'GET';
    params: paths['/api/quizzes/{id}']['parameters']['path'];
    response: operations['getQuizById']['responses'][200]['content']['application/json'];
    error: operations['getQuizById']['responses'][404 | 500]['content']['application/json'];
  };
}

// Helper Types
export type QuizWithoutTimestamps = Omit<Quiz, 'createdAt' | 'updatedAt'>;
export type CreateQuizData = Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>;
export type QuizSummary = Pick<Quiz, 'id' | 'title' | 'instructions'>;

// Question Helper Types
export type QuestionWithoutQuizId = Omit<Question, 'quizId' | 'createdAt' | 'updatedAt'>;
export type CreateQuestionData = Omit<Question, 'id' | 'createdAt' | 'updatedAt'>;

// Option Helper Types  
export type CreateOptionData = Omit<Option, 'id'>;