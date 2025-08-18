import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';
import type { Game, Direction } from '../model/types';

export const useInitGame = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (): Promise<Game> => {
      const response = await api.post('/api/v1/games/init');
      return response.data;
    },
    onSuccess: (game) => {
      queryClient.setQueryData(['game', game.id], game);
    },
  });
};

export const useGame = (id: string) => 
  useQuery({
    queryKey: ['game', id],
    queryFn: async (): Promise<Game> => {
      const response = await api.get(`/api/v1/games/${id}`);
      return response.data;
    },
    enabled: !!id,
  });

export const useMakeMove = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: Direction }): Promise<Game> => {
      const response = await api.post(`/api/v1/games/${id}/move`, { direction });
      return response.data;
    },
    onSuccess: (game) => {
      queryClient.setQueryData(['game', game.id], game);
    },
  });
};

export const useResetGame = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string): Promise<Game> => {
      const response = await api.post(`/api/v1/games/${id}/reset`);
      return response.data;
    },
    onSuccess: (game) => {
      queryClient.setQueryData(['game', game.id], game);
    },
  });
};

export const useLeaderboard = (limit: number = 10) =>
  useQuery({
    queryKey: ['leaderboard', limit],
    queryFn: async (): Promise<Game[]> => {
      const response = await api.get(`/api/v1/games/leaderboard?limit=${limit}`);
      return response.data;
    },
  });