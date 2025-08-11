import React, { useCallback } from 'react';
import { Card } from '@/shared/ui/card';
import { AddTodoForm } from '@/features/add-todo';
import { ConnectedTodoList, TodoCounter } from '@/features/todo-list';
import { useTodoStore } from '@/entities/todo';

export const TodoAppCard = React.memo(() => {
  const todos = useTodoStore(useCallback((state) => state.todos, []));
  
  return (
    <Card className="w-full max-w-md mx-auto p-8 min-h-[400px] shadow-2xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-gray-800 mb-2">
          Minimalist TODO
        </h1>
        <p className="text-gray-600 text-sm">
          Keep track of your tasks with simplicity
        </p>
      </div>

      <div className="space-y-8">
        <AddTodoForm />
        <ConnectedTodoList />
        <TodoCounter todos={todos} />
      </div>
    </Card>
  );
});