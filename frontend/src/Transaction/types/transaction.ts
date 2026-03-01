export type TransactionType = 'income' | 'expense';
export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface User {
  id: string;
  name: string;
  color: string;
  banks: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  name: string;
  color: string;
  banks: string[];
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  date: string | null;
  bank: string;
  category: string;
  isPending: boolean;
  isRecurring: boolean;
  recurringFrequency: RecurringFrequency | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionDto {
  userId: string;
  type: TransactionType;
  amount: number;
  description: string;
  date?: string;
  bank: string;
  category: string;
  isRecurring?: boolean;
  recurringFrequency?: RecurringFrequency;
}

export interface Summary {
  currentIncome: number;
  currentExpense: number;
  currentBalance: number;
  forecastIncome: number;
  forecastExpense: number;
  forecastBalance: number;
  monthlyRecurringTotal: number;
  count: number;
  pendingCount: number;
  byBank: Record<string, { income: number; expense: number; balance: number }>;
  byCategory: Record<string, { income: number; expense: number; total: number }>;
}

export const CURRENCY = { code: 'EUR', symbol: '€' };

export const BANKS: { slug: string; label: string }[] = [
  { slug: 'societe-generale', label: 'Société Générale' },
  { slug: 'hello-bank',       label: 'Hello Bank'       },
  { slug: 'livret-a',         label: 'Livret A'         },
  { slug: 'boursorama',       label: 'Boursorama'       },
  { slug: 'credit-agricole',  label: 'Crédit Agricole'  },
  { slug: 'bnp-paribas',      label: 'BNP Paribas'      },
  { slug: 'autre',            label: 'Autre'            },
];

export const CATEGORIES: { slug: string; label: string; icon: string }[] = [
  { slug: 'salaire',        label: 'Salaire',        icon: '💼' },
  { slug: 'alimentaire',    label: 'Alimentaire',    icon: '🛒' },
  { slug: 'epargne',        label: 'Épargne',        icon: '🏦' },
  { slug: 'vente',          label: 'Vente',          icon: '🏷️' },
  { slug: 'investissement', label: 'Investissement', icon: '📈' },
  { slug: 'transport',      label: 'Transport',      icon: '🚗' },
  { slug: 'facture',        label: 'Facture',        icon: '📄' },
  { slug: 'abonnement',     label: 'Abonnement',     icon: '🔄' },
  { slug: 'loyer',          label: 'Loyer',          icon: '🏠' },
  { slug: 'achats-perso',   label: 'Achats perso',   icon: '🛍️' },
  { slug: 'achat-maison',   label: 'Achat maison',   icon: '🔧' },
  { slug: 'sante',          label: 'Santé',          icon: '❤️' },
  { slug: 'loisir',         label: 'Loisir',         icon: '🎯' },
  { slug: 'autre',          label: 'Autre',          icon: '📌' },
];

export const RECURRING_LABELS: Record<RecurringFrequency, string> = {
  daily:   'Quotidien',
  weekly:  'Hebdomadaire',
  monthly: 'Mensuel',
  yearly:  'Annuel',
};

export const PROFILE_COLORS: { id: string; hex: string; bg: string }[] = [
  { id: 'amber',   hex: '#c9a84c', bg: 'rgba(201,168,76,.18)'  },
  { id: 'violet',  hex: '#a78bfa', bg: 'rgba(167,139,250,.18)' },
  { id: 'emerald', hex: '#4ade80', bg: 'rgba(74,222,128,.18)'  },
  { id: 'rose',    hex: '#f87171', bg: 'rgba(248,113,113,.18)' },
  { id: 'sky',     hex: '#38bdf8', bg: 'rgba(56,189,248,.18)'  },
  { id: 'orange',  hex: '#fb923c', bg: 'rgba(251,146,60,.18)'  },
  { id: 'teal',    hex: '#2dd4bf', bg: 'rgba(45,212,191,.18)'  },
  { id: 'pink',    hex: '#f472b6', bg: 'rgba(244,114,182,.18)' },
];

export const QUERY_KEYS = {
  transactions: 'transactions',
  pending:      'pending',
  recurring:    'recurring',
  balance:      'balance',
  users:        'users',
} as const;
