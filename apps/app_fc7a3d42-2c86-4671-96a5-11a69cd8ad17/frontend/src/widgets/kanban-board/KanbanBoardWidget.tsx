import React, { useMemo, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { toast } from 'sonner';
import type { TaskStatus, Task } from '@/shared';
import { useTasksGrouped, useUpdateTask } from '@/shared';
import { StatusColumn } from './StatusColumn';
import { TaskCard } from './TaskCard';

/**
 * KanbanBoardWidget - Main orchestrator for the task board
 *
 * Manages the board layout with columns for different task statuses
 * and coordinates drag-and-drop functionality.
 */
export const KanbanBoardWidget = React.memo(() => {
  // Fetch tasks data and mutations
  const { data: groupedTasks, tasks, isLoading, error } = useTasksGrouped();
  const updateTaskMutation = useUpdateTask();

  // Drag and drop state
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Define the status columns with their display information
  const statusColumns = useMemo(
    () => [
      {
        status: 'todo' as TaskStatus,
        title: 'To Do',
        description: 'Tasks to be started',
        color: 'bg-slate-100 border-slate-200',
        headerColor: 'text-slate-700',
      },
      {
        status: 'in-progress' as TaskStatus,
        title: 'In Progress',
        description: 'Currently working on',
        color: 'bg-blue-50 border-blue-200',
        headerColor: 'text-blue-700',
      },
      {
        status: 'done' as TaskStatus,
        title: 'Done',
        description: 'Completed tasks',
        color: 'bg-green-50 border-green-200',
        headerColor: 'text-green-700',
      },
    ],
    []
  );

  // Helper function to calculate new order for a task
  const calculateNewOrder = useCallback(
    (targetTasks: Task[], insertIndex: number): number => {
      if (targetTasks.length === 0) {
        return 1000; // First task in empty column
      }

      if (insertIndex === 0) {
        // Insert at beginning
        return Math.max(0, targetTasks[0].order - 1000);
      }

      if (insertIndex >= targetTasks.length) {
        // Insert at end
        return targetTasks[targetTasks.length - 1].order + 1000;
      }

      // Insert between two tasks
      const prevOrder = targetTasks[insertIndex - 1].order;
      const nextOrder = targetTasks[insertIndex].order;
      return Math.floor((prevOrder + nextOrder) / 2);
    },
    []
  );

  // Handle drag start
  const handleDragStart = useCallback(
    (event: { active: { id: string | number } }) => {
      const { active } = event;
      const task = tasks.find(t => t.id === active.id);
      if (task) {
        setActiveTask(task);
      }
    },
    [tasks]
  );

  // Handle drag over for visual feedback
  const handleDragOver = useCallback(() => {
    // Could add visual feedback here if needed
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveTask(null);

      if (!over || active.id === over.id) {
        return; // No drop target or same position
      }

      const activeTask = tasks.find(t => t.id === active.id);
      if (!activeTask) return;

      // Parse the over target
      let targetStatus: TaskStatus;
      let insertIndex = 0;

      if (over.id.toString().startsWith('column-')) {
        // Dropped on column (empty area)
        targetStatus = over.id.toString().replace('column-', '') as TaskStatus;
        insertIndex = groupedTasks[targetStatus]?.length || 0;
      } else {
        // Dropped on another task
        const targetTask = tasks.find(t => t.id === over.id);
        if (!targetTask) return;

        targetStatus = targetTask.status;
        const targetTasks = groupedTasks[targetStatus] || [];
        insertIndex = targetTasks.findIndex(t => t.id === targetTask.id);
      }

      // Don't update if same status and same position
      if (activeTask.status === targetStatus) {
        const currentTasks = groupedTasks[activeTask.status] || [];
        const currentIndex = currentTasks.findIndex(
          t => t.id === activeTask.id
        );
        if (currentIndex === insertIndex || currentIndex === insertIndex - 1) {
          return;
        }
      }

      // Calculate new order
      const targetTasks = groupedTasks[targetStatus] || [];
      const newOrder = calculateNewOrder(targetTasks, insertIndex);

      // Update task with new status and order
      updateTaskMutation.mutate(
        {
          id: activeTask.id,
          status: targetStatus,
          order: newOrder,
        },
        {
          onSuccess: () => {
            const statusLabels: Record<TaskStatus, string> = {
              todo: 'To Do',
              'in-progress': 'In Progress',
              done: 'Done',
            };

            if (activeTask.status !== targetStatus) {
              toast.success(`Task moved to ${statusLabels[targetStatus]}`, {
                description: activeTask.title,
              });
            }
          },
          onError: error => {
            toast.error('Failed to update task', {
              description: 'Please try again or refresh the page.',
            });
            console.error('Failed to update task:', error);
          },
        }
      );
    },
    [tasks, groupedTasks, calculateNewOrder, updateTaskMutation]
  );

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-red-600">Failed to load tasks</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {statusColumns.map(column => (
            <StatusColumn
              key={column.status}
              status={column.status}
              title={column.title}
              description={column.description}
              color={column.color}
              headerColor={column.headerColor}
              tasks={groupedTasks[column.status] || []}
            />
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
});

KanbanBoardWidget.displayName = 'KanbanBoardWidget';
