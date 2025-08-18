/**
 * MessageListWidget Component
 *
 * A scrollable container for displaying chat messages.
 * Auto-scrolls to bottom when new messages are added.
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { ScrollArea, Skeleton } from '@/shared/ui';
import { useMessages, type Message } from '@/entities/message';
import { MessageItem } from './MessageItem';

export interface MessageListWidgetProps {
  /** Override messages array - useful for optimistic updates */
  messages?: Message[];
  /** Loading state override */
  loading?: boolean;
  /** Custom class name */
  className?: string;
}

export const MessageListWidget = React.memo<MessageListWidgetProps>(
  ({
    messages: overrideMessages,
    loading: overrideLoading,
    className = '',
  }) => {
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { data: apiData, isLoading: apiLoading, error } = useMessages();

    // Use override messages if provided, otherwise use API data
    const messages = overrideMessages ?? apiData?.data ?? [];
    const loading = overrideLoading ?? apiLoading;

    // Auto-scroll to bottom when new messages are added
    const scrollToBottom = useCallback(() => {
      if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector(
          '[data-slot="scroll-area-viewport"]'
        );
        if (viewport) {
          viewport.scrollTop = viewport.scrollHeight;
        }
      }
    }, []);

    // Scroll to bottom when messages change (new message added)
    useEffect(() => {
      if (messages.length > 0) {
        // Small delay to ensure DOM is updated
        setTimeout(scrollToBottom, 50);
      }
    }, [messages.length, scrollToBottom]);

    if (error) {
      return (
        <div className="flex items-center justify-center h-96 text-muted-foreground">
          <p>Error loading messages. Please try refreshing.</p>
        </div>
      );
    }

    return (
      <div className={`flex flex-col h-full ${className}`}>
        <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
          {loading && messages.length === 0 ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No messages yet. Start a conversation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map(message => (
                <MessageItem key={message.id} message={message} />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>
    );
  }
);
