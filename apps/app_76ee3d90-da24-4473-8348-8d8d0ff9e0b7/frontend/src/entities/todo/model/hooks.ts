import { useCallback } from 'react';
import { useTodoStore } from './store';

export const useTodoActions = () => {
  const toggleTodo = useTodoStore(useCallback((state) => state.toggleTodo, []));
  const deleteTodo = useTodoStore(useCallback((state) => state.deleteTodo, []));

  return { handleToggle: toggleTodo, handleDelete: deleteTodo };
};