/**
 * ChatInputWidget Component
 *
 * Input widget for composing and sending chat messages
 */

import React, { useCallback, useMemo } from 'react';
import { SendMessageFeature } from '@/features/send-message';

export interface ChatInputWidgetProps {
  /** Callback when message is sent */
  onSend?: (message: string) => void;
  /** Custom class name */
  className?: string;
}

export const ChatInputWidget = React.memo<ChatInputWidgetProps>(
  ({ onSend, className = '' }) => {
    const handleSend = useCallback(
      (message: string) => {
        onSend?.(message);
      },
      [onSend]
    );

    const combinedClassName = useMemo(() => {
      return `p-4 border-t bg-background ${className}`.trim();
    }, [className]);

    return (
      <div className={combinedClassName}>
        <SendMessageFeature
          onSend={handleSend}
          placeholder="Type a message..."
          className="w-full"
        />
      </div>
    );
  }
);
