/**
 * Message Entity Helper Types
 *
 * Helper types for working with Message entities in both frontend and backend.
 * These complement the auto-generated types from OpenAPI specifications.
 */

// Re-export generated types for convenience
import type { paths } from './generated-types';

// Message API route types
export namespace MessageRoutes {
  // GET /messages
  export type List = {
    Querystring: {
      before?: string;
      limit?: number;
    };
    Reply: paths['/messages']['get']['responses'][200]['content']['application/json'];
  };

  // POST /messages
  export type Create = {
    Body: paths['/messages']['post']['requestBody']['content']['application/json'];
    Reply: paths['/messages']['post']['responses'][201]['content']['application/json'];
  };
}

// Helper types for frontend components
export namespace MessageTypes {
  // Extract message type from API response
  export type Message = NonNullable<
    paths['/messages']['get']['responses'][200]['content']['application/json']['data']
  >[0];

  export type MessageCreate = paths['/messages']['post']['requestBody']['content']['application/json'];

  export type MessagesList = paths['/messages']['get']['responses'][200]['content']['application/json'];

  // UI-specific types
  export interface MessageListProps {
    messages: Message[];
    loading?: boolean;
    hasMore?: boolean;
    onLoadMore?: () => void;
  }

  export interface MessageItemProps {
    message: Message;
  }
}