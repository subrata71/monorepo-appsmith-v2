/**
 * Message API Queries
 *
 * TanStack Query hooks for message-related API operations
 */

import { useQuery } from '@tanstack/react-query';
import { get, handleError } from '@/shared/api';
import type { MessagesList } from '../model/types';

interface UseMessagesParams {
  before?: string;
  limit?: number;
}

export const useMessages = (params: UseMessagesParams = {}) =>
  useQuery({
    queryKey: ['messages', params],
    queryFn: async (): Promise<MessagesList> => {
      const queryParams = new URLSearchParams();

      if (params.before) queryParams.append('before', params.before);
      if (params.limit) queryParams.append('limit', params.limit.toString());

      const queryString = queryParams.toString();
      const url = `/messages${queryString ? `?${queryString}` : ''}`;

      const { data, error } = await get(url);

      if (error) handleError(error);

      return data?.data || { data: [], hasMore: false };
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
  });
