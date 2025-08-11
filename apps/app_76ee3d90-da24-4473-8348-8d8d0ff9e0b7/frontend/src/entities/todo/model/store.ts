import { create } from 'zustand';
import type { Todo, TodoStore } from './types';

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  nextId: 1,

  getTodos: () => {
    return [...get().todos];
  },

  addTodo: (text: string) => {
    if (!text || text.trim() === '') {
      return null;
    }

    const newTodo: Todo = {
      id: get().nextId.toString(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      todos: [...state.todos, newTodo],
      nextId: state.nextId + 1,
    }));

    return newTodo;
  },

  toggleTodo: (id: string) => {
    const todos = get().todos;
    const todo = todos.find((t) => t.id === id);
    
    if (!todo) {
      return null;
    }

    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      todos: state.todos.map((t) => (t.id === id ? updatedTodo : t)),
    }));

    return updatedTodo;
  },

  deleteTodo: (id: string) => {
    const todos = get().todos;
    const todo = todos.find((t) => t.id === id);
    
    if (!todo) {
      return null;
    }

    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    }));

    return todo;
  },
}));