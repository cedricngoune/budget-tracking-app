import { BANKS, CATEGORIES, CURRENCY } from '../types/transaction.ts';
import { useGetTransactions, useDeleteTransaction } from '../hooks/useTransactions.ts';
import { useTransactionFilters, TYPE_OPTIONS, BANK_OPTIONS, CATEGORY_OPTIONS, MONTH_OPTIONS } from '../hooks/useTransactionFilters.ts';
import AppSelect from '../components/ui/Select.tsx';
import './TransactionList.css';

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const bankLabel = (slug: string) => BANKS.find(b => b.slug === slug)?.label ?? slug;
const catLabel  = (slug: string) => CATEGORIES.find(c => c.slug === slug)?.label ?? slug;
const catIcon   = (slug: string) => CATEGORIES.find(c => c.slug === slug)?.icon ?? '📌';

interface Props {
  userId: string;
  onDeleteError: () => void;
  onBankChange?: (bank: string | undefined) => void;
}

const TransactionList = ({ userId, onDeleteError, onBankChange }: Props) => {
  const { filters, set } = useTransactionFilters(onBankChange);
  const { data: transactions = [], isLoading, isError } = useGetTransactions(userId, filters);
  const deleteMutation = useDeleteTransaction(userId);

  return (
    <div className="card tx-card" style={{ height: '100%' }}>
      <div className="list-header">
        <div className="card-title" style={{ margin: 0 }}>Historique ({transactions.length})</div>
        <div className="filter-group">
          <AppSelect
            value={filters.type     || 'all'}
            onValueChange={v => set('type', v)}
            options={TYPE_OPTIONS}
            triggerClass="select-trigger-filter"
          />
          <AppSelect
            value={filters.bank     || 'all'}
            onValueChange={v => set('bank', v)}
            options={BANK_OPTIONS}
            triggerClass="select-trigger-filter"
          />
          <AppSelect
            value={filters.category || 'all'}
            onValueChange={v => set('category', v)}
            options={CATEGORY_OPTIONS}
            triggerClass="select-trigger-filter"
          />
          <AppSelect
            value={filters.month    || 'all'}
            onValueChange={v => set('month', v)}
            options={MONTH_OPTIONS()}
            triggerClass="select-trigger-filter"
          />
        </div>
      </div>

      {isLoading && <div className="loading"><div className="spinner" />CHARGEMENT...</div>}
      {isError   && <div className="error-msg">Erreur lors du chargement.</div>}

      {!isLoading && !isError && transactions.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">◈</div>
          <div className="empty-text">Aucune transaction</div>
        </div>
      )}

      {!isLoading && !isError && transactions.length > 0 && (
        <div className="tx-list">
          {transactions.map(t => {
            const isDeleting = deleteMutation.isPending && deleteMutation.variables === t.id;
            return (
              <div key={t.id} className={`tx-item ${t.type}`}>
                <div className="tx-icon">{t.type === 'income' ? '▲' : '▼'}</div>
                <div className="tx-info">
                  <div className="tx-desc">{t.description}</div>
                  <div className="tx-meta">
                    <span className="tx-date">{t.date}</span>
                    <span className="badge badge-bank">{bankLabel(t.bank)}</span>
                    <span className="badge badge-cat">{catIcon(t.category)} {catLabel(t.category)}</span>
                    {t.isRecurring && <span className="badge badge-recurring">🔄 récurrent</span>}
                  </div>
                </div>
                <div className="tx-right">
                  <span className="tx-amount">
                    {t.type === 'expense' ? '-' : '+'}{fmt(Number(t.amount))} {CURRENCY.symbol}
                  </span>
                  <button className="btn-del"
                    onClick={() => deleteMutation.mutate(t.id, { onError: onDeleteError })}
                    disabled={isDeleting}>{isDeleting ? '…' : '×'}</button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
