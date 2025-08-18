/**
 * MessageItem Component
 *
 * Displays a single chat message with sender info and timestamp
 */

import React from 'react';
import type { Message } from '@/entities/message';

export interface MessageItemProps {
  message: Message;
}

export const MessageItem = React.memo<MessageItemProps>(({ message }) => {
  // Format timestamp for display
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col space-y-1 p-3 rounded-lg bg-muted/50">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground">
          User {message.senderId}
        </span>
        <span className="text-muted-foreground">
          {formatTimestamp(message.createdAt)}
        </span>
      </div>
      <div className="text-sm text-foreground break-words">
        {message.content}
      </div>
    </div>
  );
});
