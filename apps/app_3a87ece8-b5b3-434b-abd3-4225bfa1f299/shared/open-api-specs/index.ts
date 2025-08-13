/**
 * OpenAPI Specifications Index
 *
 * This file combines all OpenAPI specifications from the open-api-specs folder.
 * The generate-types script imports from this file to combine all specs.
 */

import { schemas as entitySchemas, paths as entityPaths } from './__entity__.js';
import { schemas as quizSchemas, paths as quizPaths } from './quiz.js';
import { schemas as quizAttemptSchemas, paths as quizAttemptPaths } from './quiz-attempt.js';

// Combine all schemas
export const schemas = {
  ...entitySchemas,
  ...quizSchemas,
  ...quizAttemptSchemas,
};

// Combine all paths
export const paths = {
  ...entityPaths,
  ...quizPaths,
  ...quizAttemptPaths,
};
