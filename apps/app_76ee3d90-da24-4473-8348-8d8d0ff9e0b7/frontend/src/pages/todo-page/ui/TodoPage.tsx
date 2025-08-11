import React from 'react';
import { Helmet } from 'react-helmet-async';
import { TodoAppCard } from '@/widgets/todo-app-card';
import { useTodoStore } from '@/entities/todo';

export const TodoPage = React.memo(() => {
  // Add some sample todos for demonstration (since this is the "Render TODO List" sub-item)
  React.useEffect(() => {
    const addTodo = useTodoStore.getState().addTodo;
    const todos = useTodoStore.getState().todos;
    
    // Only add sample todos if the store is empty
    if (todos.length === 0) {
      addTodo('Learn React');
      addTodo('Build a TODO app');
      addTodo('Practice Feature-Sliced Design');
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Minimalist TODO | App</title>
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
        <TodoAppCard />
      </div>
    </>
  );
});