/**
 * Mock Data for Messages
 *
 * Provides sample data for development and testing
 */

import type { Message } from '../model/types';

export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: 'user-123',
    content: 'Hello there! 👋',
    createdAt: new Date(Date.now() - 60000).toISOString(), // 1 minute ago
    updatedAt: new Date(Date.now() - 60000).toISOString(),
  },
  {
    id: '2',
    senderId: 'user-456',
    content: 'Hi! How are you doing today?',
    createdAt: new Date(Date.now() - 45000).toISOString(), // 45 seconds ago
    updatedAt: new Date(Date.now() - 45000).toISOString(),
  },
  {
    id: '3',
    senderId: 'user-123',
    content:
      "I'm doing great! Just working on this new chat interface. What do you think of the scrollable message container?",
    createdAt: new Date(Date.now() - 30000).toISOString(), // 30 seconds ago
    updatedAt: new Date(Date.now() - 30000).toISOString(),
  },
  {
    id: '4',
    senderId: 'user-456',
    content: 'It looks fantastic! The auto-scroll feature is really nice.',
    createdAt: new Date(Date.now() - 15000).toISOString(), // 15 seconds ago
    updatedAt: new Date(Date.now() - 15000).toISOString(),
  },
  {
    id: '5',
    senderId: 'user-789',
    content:
      'Hey everyone! Just joined the conversation. This message list container implementation looks clean and responsive! 🎉',
    createdAt: new Date(Date.now() - 5000).toISOString(), // 5 seconds ago
    updatedAt: new Date(Date.now() - 5000).toISOString(),
  },
];
