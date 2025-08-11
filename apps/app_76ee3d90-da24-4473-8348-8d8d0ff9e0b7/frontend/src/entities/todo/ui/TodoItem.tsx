import React from 'react';
import { Button } from '@/shared/ui/button';
import type { Todo } from '../model/types';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TodoItem = React.memo(({ todo, onToggle, onDelete }: TodoItemProps) => {
  const handleToggle = React.useCallback(() => {
    onToggle(todo.id);
  }, [todo.id, onToggle]);

  const handleDelete = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(todo.id);
  }, [todo.id, onDelete]);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  }, [handleToggle]);

  const ariaLabel = `${todo.completed ? 'Completed' : 'Incomplete'} todo: ${todo.text}`;

  return (
    <li
      className={`
        group flex items-center gap-3 p-4 mb-2 bg-gray-50 rounded-lg border-2 border-transparent
        transition-all duration-200 cursor-pointer hover:bg-gray-100 hover:border-gray-200
        focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2
        ${todo.completed ? 'opacity-70 bg-blue-50' : ''}
      `}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="listitem"
      aria-label={ariaLabel}
    >
      <div
        className={`
          w-5 h-5 border-2 rounded-full flex-shrink-0 flex items-center justify-center
          transition-all duration-200
          ${todo.completed 
            ? 'bg-green-500 border-green-500' 
            : 'border-gray-300'
          }
        `}
        aria-hidden="true"
      >
        {todo.completed && (
          <span className="text-white text-xs font-bold">✓</span>
        )}
      </div>

      <span
        className={`
          flex-1 text-gray-800 transition-all duration-200 break-words
          ${todo.completed ? 'line-through text-gray-500' : ''}
        `}
      >
        {todo.text}
      </span>

      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        aria-label={`Delete todo: ${todo.text}`}
        className="text-red-500 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        ×
      </Button>
    </li>
  );
});