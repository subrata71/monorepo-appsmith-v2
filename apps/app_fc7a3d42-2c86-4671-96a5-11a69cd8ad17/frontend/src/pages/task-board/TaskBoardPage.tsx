import React from 'react';
import { Container } from '@/shared/ui';
import { KanbanBoardWidget } from '@/widgets/kanban-board';

/**
 * TaskBoardPage - Main page for the kanban task board
 *
 * Displays tasks in columns by status with drag-and-drop support
 * for reordering and status changes.
 */
export const TaskBoardPage = React.memo(() => {
  return (
    <Container className="h-full py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Task Board</h1>
        <p className="text-muted-foreground mt-1">
          Manage your tasks with drag-and-drop functionality
        </p>
      </div>

      <KanbanBoardWidget />
    </Container>
  );
});

TaskBoardPage.displayName = 'TaskBoardPage';
