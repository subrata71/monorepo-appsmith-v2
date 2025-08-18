import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { get, post, patch, del, handleError } from '../api';
import type {
  Task,
  TaskCreate,
  TaskUpdate,
  TaskListQueryParams,
} from '@app/shared/api-types';

// Query keys for React Query
const QUERY_KEYS = {
  tasks: ['tasks'] as const,
  tasksList: (params?: TaskListQueryParams) =>
    ['tasks', 'list', params] as const,
  task: (id: string) => ['tasks', id] as const,
} as const;

// Hook to fetch all tasks with optional filtering
export function useTasks(params?: TaskListQueryParams) {
  return useQuery({
    queryKey: QUERY_KEYS.tasksList(params),
    queryFn: async () => {
      try {
        const response = await get('/tasks', {
          params: {
            query: params,
          },
        });

        if (response.error) {
          throw response.error;
        }

        return response.data?.data || [];
      } catch (error) {
        handleError(error);
      }
    },
  });
}

// Hook to fetch a single task by ID
export function useTask(id: string) {
  return useQuery({
    queryKey: QUERY_KEYS.task(id),
    queryFn: async () => {
      try {
        const response = await get('/tasks/{id}', {
          params: {
            path: { id },
          },
        });

        if (response.error) {
          throw response.error;
        }

        return response.data?.data;
      } catch (error) {
        handleError(error);
      }
    },
    enabled: !!id,
  });
}

// Hook to create a new task
export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskData: TaskCreate) => {
      try {
        const response = await post('/tasks', {
          body: taskData,
        });

        if (response.error) {
          throw response.error;
        }

        return response.data?.data;
      } catch (error) {
        handleError(error);
      }
    },
    onSuccess: () => {
      // Invalidate and refetch tasks list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
    },
  });
}

// Hook to update a task (used for drag-and-drop)
export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & TaskUpdate) => {
      try {
        const response = await patch('/tasks/{id}', {
          params: {
            path: { id },
          },
          body: updates,
        });

        if (response.error) {
          throw response.error;
        }

        return response.data?.data;
      } catch (error) {
        handleError(error);
      }
    },
    onSuccess: (updatedTask, variables) => {
      // Update the task in the cache
      if (updatedTask) {
        queryClient.setQueryData(QUERY_KEYS.task(variables.id), updatedTask);
      }

      // Invalidate tasks list to refresh the board
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
    },
  });
}

// Hook to delete a task
export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const response = await del('/tasks/{id}', {
          params: {
            path: { id },
          },
        });

        if (response.error) {
          throw response.error;
        }

        return id;
      } catch (error) {
        handleError(error);
      }
    },
    onSuccess: () => {
      // Invalidate and refetch tasks list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.tasks });
    },
  });
}

// Hook to get tasks grouped by status for kanban board
export function useTasksGrouped() {
  const {
    data: tasks = [],
    isLoading,
    error,
  } = useTasks({
    sortBy: 'order',
    sortOrder: 'asc',
  });

  const groupedTasks = {
    todo: tasks.filter((task: Task) => task.status === 'todo'),
    'in-progress': tasks.filter((task: Task) => task.status === 'in-progress'),
    done: tasks.filter((task: Task) => task.status === 'done'),
  };

  return {
    data: groupedTasks,
    tasks,
    isLoading,
    error,
  };
}

// Export query keys for external use
export { QUERY_KEYS };
