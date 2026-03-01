import { useState } from 'react';
import { BANKS, CATEGORIES } from '../types/transaction.ts';
import type { TransactionFilters } from '../../services/api.ts';

export type { TransactionFilters };

// Filters managed locally (without userId, which is injected separately)
export type LocalFilters = Omit<TransactionFilters, 'userId'>;

export interface SelectOption { value: string; label: string; }

const monthOptions = (): SelectOption[] => {
  const opts: SelectOption[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d    = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const mm   = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    opts.push({ value: `${mm}-${yyyy}`, label: d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }) });
  }
  return opts;
};

export const TYPE_OPTIONS: SelectOption[] = [
  { value: 'all',     label: 'Tous types' },
  { value: 'income',  label: 'Revenus'    },
  { value: 'expense', label: 'Dépenses'   },
];

export const BANK_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Toutes banques' },
  ...BANKS.map(b => ({ value: b.slug, label: b.label })),
];

export const CATEGORY_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'Toutes catégories' },
  ...CATEGORIES.map(c => ({ value: c.slug, label: `${c.icon} ${c.label}` })),
];

export const MONTH_OPTIONS = (): SelectOption[] => [
  { value: 'all', label: 'Tous mois' },
  ...monthOptions(),
];

export function useTransactionFilters(onBankChange?: (bank: string | undefined) => void) {
  const [filters, setFilters] = useState<LocalFilters>({});

  const set = (key: keyof LocalFilters, val: string) => {
    const resolved = val === 'all' ? undefined : val;
    setFilters(prev => ({ ...prev, [key]: resolved }));
    if (key === 'bank') onBankChange?.(resolved);
  };

  return { filters, set };
}
