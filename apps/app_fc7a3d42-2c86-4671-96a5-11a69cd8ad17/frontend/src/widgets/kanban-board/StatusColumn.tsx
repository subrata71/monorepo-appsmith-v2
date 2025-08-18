import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { TaskStatus, Task } from '@/shared';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/shared/ui';
import { TaskCard } from './TaskCard';

interface StatusColumnProps {
  status: TaskStatus;
  title: string;
  description: string;
  color: string;
  headerColor: string;
  tasks: Task[];
}

/**
 * StatusColumn - Displays tasks of a single status
 *
 * Renders a column for a specific task status with a header
 * and a scrollable area for task cards.
 */
export const StatusColumn = React.memo<StatusColumnProps>(
  ({ status, title, description, color, headerColor, tasks }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: `column-${status}`,
    });

    const taskIds = React.useMemo(() => tasks.map(task => task.id), [tasks]);

    return (
      <div className="h-full flex flex-col">
        <Card
          className={`h-full ${color} border-2 ${isOver ? 'ring-2 ring-blue-500 ring-opacity-50' : ''}`}
        >
          <CardHeader className="pb-4">
            <CardTitle className={`${headerColor} text-lg font-semibold`}>
              {title}
            </CardTitle>
            <CardDescription className="text-sm">{description}</CardDescription>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {tasks.length} task{tasks.length !== 1 ? 's' : ''}
              </span>
            </div>
          </CardHeader>

          <CardContent
            ref={setNodeRef}
            className="flex-1 space-y-3 overflow-y-auto"
          >
            <SortableContext
              items={taskIds}
              strategy={verticalListSortingStrategy}
            >
              {tasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </SortableContext>

            {tasks.length === 0 && (
              <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                No tasks in this column
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
);

StatusColumn.displayName = 'StatusColumn';
