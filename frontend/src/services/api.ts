import axios from 'axios';
import { Transaction, CreateTransactionDto, Summary } from '../types/transaction';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

export const api = {
  transactions: {
    getAll: async (filters?: { type?: string; currency?: string }): Promise<Transaction[]> => {
      const params = new URLSearchParams();
      if (filters?.type) params.set('type', filters.type);
      if (filters?.currency) params.set('currency', filters.currency);
      const { data } = await http.get<Transaction[]>(`api/transactions?${params}`);
      return data;
    },

    create: async (dto: CreateTransactionDto): Promise<Transaction> => {
      const { data } = await http.post<Transaction>('api/transactions', dto);
      return data;
    },

    delete: async (id: string): Promise<void> => {
      await http.delete(`api/transactions/${id}`);
    },

    getSummary: async (): Promise<Summary> => {
      const { data } = await http.get<Summary>('api/transactions/summary');
      return data;
    },
  },
};
