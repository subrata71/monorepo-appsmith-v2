/**
 * Message Entity - Public API
 *
 * Exports message-related types, API hooks, and utilities
 */

// Export API hooks
export { useMessages } from './api/queries';
export { useCreateMessage } from './api/mutations';

// Export types
export type { Message, MessageCreate, MessagesList } from './model/types';
