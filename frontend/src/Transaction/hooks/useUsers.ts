import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../services/api.ts';
import { CreateUserDto, QUERY_KEYS } from '../types/transaction.ts';

export function useGetUsers() {
  return useQuery({
    queryKey: [QUERY_KEYS.users],
    queryFn:  api.users.getAll,
    staleTime: 60_000,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateUserDto) => api.users.create(dto),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.users] }),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.users.delete(id),
    onSuccess:  () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.users] }),
  });
}
