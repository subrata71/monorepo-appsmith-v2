/**
 * MarkItemDoneButton Feature Component
 * 
 * This is the key component that detects when a user marks an item as done.
 * It handles the interaction and will later trigger toast notifications (in sub-item 1.3).
 */

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/shared/ui/button';
import { Checkbox } from '@/shared/ui/checkbox';
import { markItemDone } from '@/entities/item';
import type { Item } from '@/entities/item';

interface MarkItemDoneButtonProps {
  item: Item;
  variant?: 'button' | 'checkbox';
  onSuccess?: (item: Item) => void;
  onError?: (error: Error) => void;
}

export const MarkItemDoneButton = React.memo<MarkItemDoneButtonProps>(({
  item,
  variant = 'checkbox',
  onSuccess,
  onError
}) => {
  const queryClient = useQueryClient();
  
  // TanStack Query mutation for marking item as done
  const markDoneMutation = useMutation({
    mutationFn: markItemDone,
    onSuccess: (response) => {
      // Invalidate queries to refetch updated data
      queryClient.invalidateQueries({ queryKey: ['items'] });
      queryClient.invalidateQueries({ queryKey: ['item', item.id] });
      
      // Call success callback - this is where toast will be triggered later
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      // Log the event for debugging (can be removed in production)
      console.log(`✅ Item marked as done: ${item.title}`, response);
    },
    onError: (error: Error) => {
      console.error('❌ Failed to mark item as done:', error);
      
      // Call error callback
      if (onError) {
        onError(error);
      }
    }
  });

  const handleMarkDone = React.useCallback(() => {
    if (item.status !== 'done' && !markDoneMutation.isPending) {
      // This is the key event detection - when user triggers mark as done
      console.log(`🎯 Detected mark as done event for item: ${item.id} - "${item.title}"`);
      
      // Execute the mutation
      markDoneMutation.mutate(item.id);
    }
  }, [item.id, item.status, item.title, markDoneMutation]);

  const isDisabled = item.status === 'done' || markDoneMutation.isPending;

  if (variant === 'button') {
    return (
      <Button
        onClick={handleMarkDone}
        disabled={isDisabled}
        variant={item.status === 'done' ? 'secondary' : 'default'}
        size="sm"
      >
        {markDoneMutation.isPending ? (
          'Marking...'
        ) : item.status === 'done' ? (
          'Done ✓'
        ) : (
          'Mark Done'
        )}
      </Button>
    );
  }

  // Default checkbox variant
  return (
    <Checkbox
      checked={item.status === 'done'}
      disabled={isDisabled}
      onCheckedChange={handleMarkDone}
      aria-label={
        item.status === 'done' 
          ? 'Item completed' 
          : `Mark "${item.title}" as done`
      }
    />
  );
});

MarkItemDoneButton.displayName = 'MarkItemDoneButton';