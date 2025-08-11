/**
 * Items Page
 * 
 * Main page for displaying and managing items/todos
 * This page integrates the Item entity with the MarkItemDone feature
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Container } from '@/shared/ui/container';
import { fetchItems, ItemCard } from '@/entities/item';
import { useMarkItemDone } from '@/features/mark-item-done';
import { useToast } from '@/shared';
import type { Item } from '@/entities/item';

export const ItemsPage = React.memo(() => {
  const { showSuccess, showError } = useToast();

  // Fetch items using TanStack Query
  const {
    data: itemsResponse,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['items'],
    queryFn: fetchItems,
  });

  // Callbacks for mark item done feature - wrapped in useMemo for optimization
  const markItemDoneCallbacks = React.useMemo(() => ({
    onSuccess: (item: Item) => {
      // Show success toast when item is marked as done
      showSuccess(`"${item.title}" has been marked as done!`, {
        duration: 3000, // 3 seconds as per spec
      });
      console.log(`🎉 Item successfully marked as done: "${item.title}"`);
    },
    onError: (error: Error) => {
      // Show error toast when marking item as done fails
      showError('Failed to mark item as done. Please try again.');
      console.error('Failed to mark item as done:', error);
    }
  }), [showSuccess, showError]);

  // Use the mark item done feature hook
  const { markDone } = useMarkItemDone(markItemDoneCallbacks);

  const handleMarkItemDone = React.useCallback((itemId: string) => {
    const item = itemsResponse?.data.find(item => item.id === itemId);
    markDone(itemId, item?.title);
  }, [itemsResponse?.data, markDone]);

  if (isLoading) {
    return (
      <Container className="py-8">
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="text-muted-foreground">Loading items...</div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-8">
        <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
          <div className="text-destructive">Failed to load items</div>
          <button 
            onClick={() => refetch()}
            className="text-sm text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      </Container>
    );
  }

  const items = itemsResponse?.data || [];

  return (
    <Container className="py-8">
      <div className="space-y-6">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Items</h1>
          <p className="text-muted-foreground">
            Manage your items and mark them as done
          </p>
        </div>

        {/* Items List */}
        {items.length === 0 ? (
          <div className="flex items-center justify-center min-h-[200px] rounded-lg border border-dashed">
            <div className="text-center space-y-2">
              <div className="text-muted-foreground">No items found</div>
              <div className="text-sm text-muted-foreground">
                Create your first item to get started
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item: Item) => (
              <ItemCard
                key={item.id}
                item={item}
                onMarkDone={handleMarkItemDone}
              />
            ))}
          </div>
        )}

        {/* Summary */}
        {items.length > 0 && (
          <div className="mt-8 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Total items: {items.length}</span>
              <span>
                Done: {items.filter(item => item.status === 'done').length} | 
                Pending: {items.filter(item => item.status === 'pending').length}
              </span>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
});

ItemsPage.displayName = 'ItemsPage';