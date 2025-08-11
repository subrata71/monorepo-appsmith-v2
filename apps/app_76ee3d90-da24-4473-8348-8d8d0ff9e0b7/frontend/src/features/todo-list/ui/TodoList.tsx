import React, { useCallback } from 'react';
import { TodoItem, useTodoStore, useTodoActions } from '@/entities/todo';
import type { Todo } from '@/entities/todo';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoList = React.memo(({ todos, onToggle, onDelete }: TodoListProps) => {
  const memoizedTodos = React.useMemo(() => todos, [todos]);

  if (memoizedTodos.length === 0) {
    return (
      <div className="text-center text-gray-500 italic py-12">
        No todos yet. Add one above to get started!
      </div>
    );
  }

  return (
    <ul role="list" className="space-y-0">
      {memoizedTodos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
});

// Connected TodoList component that uses the store
export const ConnectedTodoList = React.memo(() => {
  const todos = useTodoStore(useCallback((state) => state.todos, []));
  const { handleToggle, handleDelete } = useTodoActions();

  return (
    <TodoList
      todos={todos}
      onToggle={handleToggle}
      onDelete={handleDelete}
    />
  );
});