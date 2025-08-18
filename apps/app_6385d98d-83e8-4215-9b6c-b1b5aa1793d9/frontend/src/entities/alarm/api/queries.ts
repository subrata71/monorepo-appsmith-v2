/**
 * Alarm API Queries
 *
 * TanStack Query hooks for alarm-related API operations
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post, put, handleError } from '@/shared/api';
import type { AlarmCreate, AlarmUpdate } from '../model/types';

// Query keys for alarm-related queries
export const alarmKeys = {
  all: ['alarms'] as const,
  my: () => [...alarmKeys.all, 'my'] as const,
};

/**
 * Hook to fetch the current user's alarm
 */
export const useMyAlarmQuery = () =>
  useQuery({
    queryKey: alarmKeys.my(),
    queryFn: async () => {
      const { data, error } = await get('/alarms/my');

      if (error) {
        handleError(error);
        throw error;
      }

      return data?.data; // Return the alarm object
    },
    retry: (failureCount, error) => {
      // Don't retry on 404 (no alarm found)
      if (
        error &&
        typeof error === 'object' &&
        'status' in error &&
        error.status === 404
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });

/**
 * Hook to create an alarm for the current user
 */
export const useCreateAlarmMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (alarmData: AlarmCreate) => {
      const { data, error } = await post('/alarms', {
        body: alarmData,
      });

      if (error) {
        handleError(error);
        throw error;
      }

      return data?.data;
    },
    onSuccess: () => {
      // Invalidate and refetch the user's alarm
      queryClient.invalidateQueries({ queryKey: alarmKeys.my() });
    },
  });
};

/**
 * Hook to update the current user's alarm
 */
export const useUpdateAlarmMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (alarmData: AlarmUpdate) => {
      const { data, error } = await put('/alarms/my', {
        body: alarmData,
      });

      if (error) {
        handleError(error);
        throw error;
      }

      return data?.data;
    },
    onSuccess: () => {
      // Invalidate and refetch the user's alarm
      queryClient.invalidateQueries({ queryKey: alarmKeys.my() });
    },
  });
};
