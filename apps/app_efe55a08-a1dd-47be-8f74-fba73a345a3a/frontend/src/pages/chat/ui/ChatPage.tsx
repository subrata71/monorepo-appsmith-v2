/**
 * ChatPage Component
 *
 * Main chat interface page with message list container
 */

import React, { useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { MessageListWidget } from '@/widgets/message-list';
import { ChatInputWidget } from '@/widgets/chat-input';
import { mockMessages } from '@/entities/message/api/mock-data';

export const ChatPage = React.memo(() => {
  const handleMessageSent = useCallback((message: string) => {
    console.log('Message sent:', message);
  }, []);

  return (
    <>
      <Helmet>
        <title>Chat | App</title>
      </Helmet>

      <div className="flex flex-col h-screen">
        <header className="border-b p-4">
          <h1 className="text-2xl font-bold">Chat</h1>
        </header>

        <main className="flex-1 overflow-hidden">
          <MessageListWidget messages={mockMessages} />
        </main>

        <ChatInputWidget onSend={handleMessageSent} />
      </div>
    </>
  );
});
