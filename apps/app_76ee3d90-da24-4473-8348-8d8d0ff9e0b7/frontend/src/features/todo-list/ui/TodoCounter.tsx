import React from 'react';
import type { Todo } from '@/entities/todo';

interface TodoCounterProps {
  todos: Todo[];
}

export const TodoCounter = React.memo(({ todos }: TodoCounterProps) => {
  const completedCount = React.useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos]
  );
  const totalCount = todos.length;

  if (totalCount === 0) {
    return null;
  }

  let message: string;
  if (completedCount === 0) {
    message = `${totalCount} ${totalCount === 1 ? 'task' : 'tasks'} remaining`;
  } else if (completedCount === totalCount) {
    message = `All ${totalCount} ${totalCount === 1 ? 'task' : 'tasks'} completed! 🎉`;
  } else {
    message = `${totalCount - completedCount} of ${totalCount} ${
      totalCount === 1 ? 'task' : 'tasks'
    } remaining`;
  }

  return (
    <div className="text-center text-gray-600 text-sm mt-4">
      {message}
    </div>
  );
});