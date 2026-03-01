import axios from 'axios';
import { Transaction, CreateTransactionDto, Summary, User, CreateUserDto } from '../Transaction/types/transaction';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

export interface TransactionFilters {
  userId: string;
  type?:     string;
  bank?:     string;
  category?: string;
  month?:    string;
}

export const api = {
  transactions: {
    // Historique (isPending = false)
    getAll: async (filters: TransactionFilters): Promise<Transaction[]> => {
      const params = new URLSearchParams();
      params.set('userId', filters.userId);
      if (filters.type)     params.set('type',     filters.type);
      if (filters.bank)     params.set('bank',     filters.bank);
      if (filters.category) params.set('category', filters.category);
      if (filters.month)    params.set('month',    filters.month);
      const { data } = await http.get<Transaction[]>(`/transactions?${params}`);
      return data;
    },

    // Transactions prévisionnelles (isPending = true)
    getPending: async (userId: string): Promise<Transaction[]> => {
      const { data } = await http.get<Transaction[]>(`/transactions/pending?userId=${userId}`);
      return data;
    },

    // Charges récurrentes
    getRecurring: async (userId: string): Promise<Transaction[]> => {
      const { data } = await http.get<Transaction[]>(`/transactions/recurring?userId=${userId}`);
      return data;
    },

    // Créer (sans date = prévisionnelle)
    create: async (dto: CreateTransactionDto): Promise<Transaction> => {
      const { data } = await http.post<Transaction>('/transactions', dto);
      return data;
    },

    // Confirmer une prévisionnelle en lui donnant une date
    confirm: async (id: string, date: string, userId: string): Promise<Transaction> => {
      const { data } = await http.patch<Transaction>(`/transactions/${id}/confirm?userId=${userId}`, { date });
      return data;
    },

    delete: async (id: string, userId: string): Promise<void> => {
      await http.delete(`/transactions/${id}?userId=${userId}`);
    },

    getBalance: async (userId: string, bank?: string): Promise<Summary> => {
      const params = new URLSearchParams({ userId });
      if (bank) params.set('bank', bank);
      const { data } = await http.get<Summary>(`/transactions/balance?${params}`);
      return data;
    },
  },

  users: {
    getAll: async (): Promise<User[]> => {
      const { data } = await http.get<User[]>('/users');
      return data;
    },

    create: async (dto: CreateUserDto): Promise<User> => {
      const { data } = await http.post<User>('/users', dto);
      return data;
    },

    delete: async (id: string): Promise<void> => {
      await http.delete(`/users/${id}`);
    },
  },
};
