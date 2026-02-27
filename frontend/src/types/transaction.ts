export type TransactionType = 'income' | 'expense';

export interface Transaction {
  _id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionDto {
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  date: string;
}

export interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  count: number;
  byCurrency: Record<
    string,
    { income: number; expense: number; balance: number; count: number }
  >;
}
export const CURRENCY = { code: 'EUR', symbol: '€' };

export const QUERY_KEYS = {
  PostTransaction: 'PostTransaction',
  GetTransactions: 'GetTransactions',
  DeleteTransaction: 'DeleteTransaction',
  UpdateTransaction: 'UpdateTransaction',
  summary: 'summary',
} as const;
