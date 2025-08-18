/**
 * Message API Mutations
 *
 * TanStack Query mutation hooks for message creation operations
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { post, handleError } from '@/shared/api';
import type { MessageCreate, Message, MessagesList } from '../model/types';

export const useCreateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageData: MessageCreate): Promise<Message> => {
      const { data, error } = await post('/messages', {
        body: messageData,
      });

      if (error) handleError(error);

      return data?.data as Message;
    },
    onSuccess: newMessage => {
      // Optimistically update the messages list
      queryClient.setQueryData(
        ['messages', {}],
        (old: MessagesList | undefined) => {
          if (!old) return { data: [newMessage], hasMore: false };

          return {
            ...old,
            data: [...old.data, newMessage],
          };
        }
      );

      // Invalidate and refetch messages to ensure consistency
      queryClient.invalidateQueries({ queryKey: ['messages'] });
    },
  });
};
