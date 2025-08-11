/**
 * useMarkItemDone Hook
 * 
 * Custom hook that encapsulates the logic for marking items as done
 * This provides the event detection functionality that can be reused across components
 */

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markItemDone } from '@/entities/item';
import type { Item } from '@/entities/item';

interface UseMarkItemDoneOptions {
  onSuccess?: (item: Item) => void;
  onError?: (error: Error) => void;
}

export const useMarkItemDone = ({ onSuccess, onError }: UseMarkItemDoneOptions = {}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: markItemDone,
    onSuccess: (response) => {
      // Invalidate and refetch items list
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', response.data.id] });
      
      // Log the successful event detection
      console.log(`✅ Mark done event completed for item: ${response.data.id}`, {
        item: response.data,
        message: response.message
      });
      
      // Call success callback - this is where toast notifications will be triggered
      if (onSuccess) {
        onSuccess(response.data);
      }
    },
    onError: (error: Error) => {
      console.error('❌ Mark done event failed:', error);
      
      if (onError) {
        onError(error);
      }
    }
  });

  /**
   * Main function to mark an item as done
   * This is the core event detection and handling function
   */
  const handleMarkDone = React.useCallback((itemId: string, itemTitle?: string) => {
    // Log the event detection
    console.log(`🎯 Mark done event detected for item: ${itemId}${itemTitle ? ` - "${itemTitle}"` : ''}`);
    
    // Execute the mutation
    mutation.mutate(itemId);
  }, [mutation]);

  return {
    markDone: handleMarkDone,
    isLoading: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    reset: mutation.reset
  };
};