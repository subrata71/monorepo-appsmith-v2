/**
 * SendMessageFeature Component
 *
 * Handles message sending functionality with input validation and optimistic updates
 */

import React, { useState, useCallback, useMemo } from 'react';
import { Input, Button } from '@/shared/ui';
import { useCreateMessage } from '@/entities/message';

export interface SendMessageFeatureProps {
  /** Callback when message is successfully sent */
  onSend?: (message: string) => void;
  /** Placeholder text for input */
  placeholder?: string;
  /** Custom class name */
  className?: string;
}

export const SendMessageFeature = React.memo<SendMessageFeatureProps>(
  ({ onSend, placeholder = 'Type a message...', className = '' }) => {
    const [message, setMessage] = useState('');
    const createMessageMutation = useCreateMessage();

    const isSubmitting = useMemo(
      () => createMessageMutation.isPending,
      [createMessageMutation.isPending]
    );
    const isValidMessage = useMemo(() => message.trim().length > 0, [message]);

    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
      },
      []
    );

    const handleSubmit = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidMessage || isSubmitting) return;

        const trimmedMessage = message.trim();

        try {
          await createMessageMutation.mutateAsync({ content: trimmedMessage });
          setMessage(''); // Clear input on success
          onSend?.(trimmedMessage);
        } catch (error) {
          // Error is handled by the mutation hook and API client
          console.error('Failed to send message:', error);
        }
      },
      [message, isValidMessage, isSubmitting, createMessageMutation, onSend]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSubmit(e as React.FormEvent);
        }
      },
      [handleSubmit]
    );

    return (
      <div className={`flex gap-2 ${className}`}>
        <form onSubmit={handleSubmit} className="flex gap-2 flex-1">
          <Input
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isSubmitting}
            className="flex-1"
            aria-label="Message input"
          />
          <Button
            type="submit"
            disabled={!isValidMessage || isSubmitting}
            aria-label="Send message"
          >
            {isSubmitting ? 'Sending...' : 'Send'}
          </Button>
        </form>
      </div>
    );
  }
);
