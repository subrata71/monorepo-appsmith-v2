// Todo entity type definitions
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TodoState {
  todos: Todo[];
  nextId: number;
}

export interface TodoActions {
  getTodos: () => Todo[];
  addTodo: (text: string) => Todo | null;
  toggleTodo: (id: string) => Todo | null;
  deleteTodo: (id: string) => Todo | null;
}

export type TodoStore = TodoState & TodoActions;