import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '@/shared';
import { Card, CardHeader, CardTitle, CardDescription } from '@/shared/ui';

interface TaskCardProps {
  task: Task;
}

/**
 * TaskCard - Draggable card UI for a task
 *
 * Displays task information in a card format that is
 * draggable for status changes and reordering.
 */
export const TaskCard = React.memo<TaskCardProps>(({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white hover:shadow-md transition-shadow cursor-grab border border-gray-200 active:cursor-grabbing"
    >
      <CardHeader className="p-4">
        <CardTitle className="text-sm font-medium">
          <div className="break-words">{task.title}</div>
        </CardTitle>
        {task.description && (
          <CardDescription className="text-xs text-muted-foreground mt-2">
            <div className="break-words">{task.description}</div>
          </CardDescription>
        )}

        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
          <span className="text-xs text-muted-foreground">
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-xs text-muted-foreground capitalize">
              {task.status.replace('-', ' ')}
            </span>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
});

TaskCard.displayName = 'TaskCard';
