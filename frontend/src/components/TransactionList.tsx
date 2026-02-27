import { useState } from 'react';
import { CURRENCY } from '../types/transaction';
import { useTransactions, useDeleteTransaction, TransactionFilters } from '../hooks/useTransactions';

const fmt = (n: number) =>
    new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

interface Props {
  onDeleteError: () => void;
}

const TransactionList = ({ onDeleteError }: Props) => {
  const [filters, setFilters] = useState<TransactionFilters>({});

  const { data: transactions = [], isLoading, isError } = useTransactions(filters);
  const deleteMutation = useDeleteTransaction();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, { onError: onDeleteError });
  };

  return (
      <div className="card" style={{ height: '100%' }}>
        {/* Header */}
        <div className="list-header">
          <div className="card-title" style={{ margin: 0 }}>
            Historique ({transactions.length})
          </div>
          <div className="filter-group">
            <select className="filter-select" value={filters.type ?? ''} onChange={e => setFilters(prev => ({ ...prev, type: e.target.value || undefined }))}>
              <option value="">Tous types</option>
              <option value="income">Revenus</option>
              <option value="expense">Dépenses</option>
            </select>
          </div>
        </div>

        {/* States */}
        {isLoading && <div className="loading"><div className="spinner" />CHARGEMENT...</div>}

        {isError && <div className="error-msg">Erreur lors du chargement des transactions.</div>}

        {!isLoading && !isError && transactions.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">◈</div>
              <div className="empty-text">Aucune transaction enregistrée</div>
            </div>
        )}

        {!isLoading && !isError && transactions.length > 0 && (
            <div className="tx-list">
              {transactions.map(t => {
                const isDeleting = deleteMutation.isPending && deleteMutation.variables === t._id;
                return (
                    <div key={t._id} className={`tx-item ${t.type}`}>
                      <div className="tx-icon">{t.type === 'income' ? '▲' : '▼'}</div>
                      <div className="tx-info">
                        <div className="tx-desc">{t.description}</div>
                        <div className="tx-date">{t.date}</div>
                      </div>
                      <div className="tx-right">
                  <span className="tx-amount">
                    {t.type === 'expense' ? '-' : '+'}{fmt(Number(t.amount))} {CURRENCY.symbol}
                  </span>
                        <button className="btn-del" onClick={() => handleDelete(t._id)} disabled={isDeleting} title="Supprimer">
                          {isDeleting ? '…' : '×'}
                        </button>
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