import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { CreateTransactionDto, QUERY_KEYS } from '../types/transaction';


// ─── Filters state ─────────────────────────────────────────
export interface TransactionFilters {
  type?: string;
  currency?: string;
}

// ─── useTransactions ───────────────────────────────────────
export function useTransactions(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: [QUERY_KEYS.GetTransactions, filters],
    queryFn: () => api.transactions.getAll(filters),
    staleTime: 30_000,
  });
}


// ─── useSummary ────────────────────────────────────────────
export function useSummary() {
  return useQuery({
    queryKey: [QUERY_KEYS.summary],
    queryFn: api.transactions.getSummary,
    staleTime: 30_000,
  });
}

// ─── useCreateTransaction ──────────────────────────────────
export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateTransactionDto) => api.transactions.create(dto),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GetTransactions] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.summary] });
    },
  });
}

// ─── useDeleteTransaction ──────────────────────────────────
export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.transactions.delete(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.GetTransactions] });
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.summary] });
    },
  });
}
