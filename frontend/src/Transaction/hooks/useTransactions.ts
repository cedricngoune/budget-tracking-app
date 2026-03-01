import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, TransactionFilters } from '../../services/api.ts';
import { CreateTransactionDto, QUERY_KEYS } from '../types/transaction.ts';

export type { TransactionFilters };

const ALL_KEYS = [
  QUERY_KEYS.transactions,
  QUERY_KEYS.pending,
  QUERY_KEYS.recurring,
  QUERY_KEYS.balance,
];

const invalidateAll = (qc: ReturnType<typeof useQueryClient>, userId: string) =>
  ALL_KEYS.forEach(k => qc.invalidateQueries({ queryKey: [k, userId] }));

// Historique
export function useGetTransactions(userId: string, filters: Omit<TransactionFilters, 'userId'> = {}) {
  return useQuery({
    queryKey: [QUERY_KEYS.transactions, userId, filters],
    queryFn:  () => api.transactions.getAll({ userId, ...filters }),
    staleTime: 30_000,
    enabled: !!userId,
  });
}

// Prévisionnelles
export function usePendingTransactions(userId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.pending, userId],
    queryFn:  () => api.transactions.getPending(userId),
    staleTime: 30_000,
    enabled: !!userId,
  });
}

// Récurrentes
export function useRecurringTransactions(userId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.recurring, userId],
    queryFn:  () => api.transactions.getRecurring(userId),
    staleTime: 60_000,
    enabled: !!userId,
  });
}

// Résumé dashboard
export function useGetBalance(userId: string, bank?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.balance, userId, bank],
    queryFn:  () => api.transactions.getBalance(userId, bank),
    staleTime: 30_000,
    enabled: !!userId,
  });
}

// Créer
export function useCreateTransaction(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateTransactionDto) => api.transactions.create(dto),
    onSuccess:  () => invalidateAll(queryClient, userId),
  });
}

// Confirmer une prévisionnelle
export function useConfirmTransaction(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, date }: { id: string; date: string }) =>
      api.transactions.confirm(id, date, userId),
    onSuccess: () => invalidateAll(queryClient, userId),
  });
}

// Supprimer
export function useDeleteTransaction(userId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.transactions.delete(id, userId),
    onSuccess:  () => invalidateAll(queryClient, userId),
  });
}
