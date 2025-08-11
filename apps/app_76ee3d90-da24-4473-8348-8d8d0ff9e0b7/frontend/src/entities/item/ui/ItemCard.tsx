/**
 * ItemCard Component
 * 
 * Entity component for displaying a single item
 * This component shows item details and provides a way to mark items as done
 */

import React from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Checkbox } from '@/shared/ui/checkbox';
import type { ItemDisplayProps, ITEM_STATUS_CONFIG } from '../model/types';

export const ItemCard = React.memo<ItemDisplayProps>(({ 
  item, 
  onMarkDone,
  onEdit,
  onDelete 
}) => {
  const statusConfig = ITEM_STATUS_CONFIG[item.status];
  const isDone = item.status === 'done';

  const handleMarkDone = React.useCallback(() => {
    if (!isDone && onMarkDone) {
      // This is the key event we're detecting - when user marks item as done
      onMarkDone(item.id);
    }
  }, [item.id, isDone, onMarkDone]);

  const handleEdit = React.useCallback(() => {
    if (onEdit) {
      onEdit(item.id);
    }
  }, [item.id, onEdit]);

  const handleDelete = React.useCallback(() => {
    if (onDelete) {
      onDelete(item.id);
    }
  }, [item.id, onDelete]);

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-start justify-between space-x-4">
          {/* Left side: Checkbox and content */}
          <div className="flex items-start space-x-3 flex-1 min-w-0">
            {/* Checkbox for marking as done - this is the primary interaction */}
            <Checkbox
              checked={isDone}
              disabled={isDone}
              onCheckedChange={handleMarkDone}
              className="mt-0.5"
              aria-label={isDone ? 'Item completed' : 'Mark item as done'}
            />
            
            {/* Item content */}
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium text-sm leading-5 ${
                isDone ? 'line-through text-muted-foreground' : 'text-foreground'
              }`}>
                {item.title}
              </h3>
              
              {/* Item metadata */}
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant={statusConfig.variant} className="text-xs">
                  {statusConfig.label}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Created: {new Date(item.createdAt).toLocaleDateString()}
                </span>
                {item.updatedAt !== item.createdAt && (
                  <span className="text-xs text-muted-foreground">
                    Updated: {new Date(item.updatedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right side: Action buttons (optional) */}
          <div className="flex items-center space-x-1">
            {!isDone && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMarkDone}
                className="text-xs h-8 px-2"
              >
                Mark Done
              </Button>
            )}
            
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEdit}
                className="text-xs h-8 px-2"
              >
                Edit
              </Button>
            )}
            
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-xs h-8 px-2 text-destructive hover:text-destructive"
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

ItemCard.displayName = 'ItemCard';