/**
 * Message Entity Types
 *
 * Type definitions for Message domain model
 */

// Temporary types based on OpenAPI spec (until type generation is working)
export interface Message {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageCreate {
  content: string;
}

export interface MessagesList {
  data: Message[];
  cursor?: string | null;
  hasMore?: boolean;
}
