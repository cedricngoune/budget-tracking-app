import { useState } from 'react';
import { BANKS, CATEGORIES, CURRENCY } from '../types/transaction.ts';
import { usePendingTransactions, useConfirmTransaction, useDeleteTransaction } from '../hooks/useTransactions.ts';
import './PendingTransactions.css';

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const bankLabel = (slug: string) => BANKS.find(b => b.slug === slug)?.label ?? slug;
const catLabel  = (slug: string) => CATEGORIES.find(c => c.slug === slug)?.label ?? slug;
const catIcon   = (slug: string) => CATEGORIES.find(c => c.slug === slug)?.icon ?? '📌';
const today     = () => new Date().toISOString().split('T')[0];

interface Props {
  userId: string;
  onConfirmSuccess: () => void;
  onConfirmError: () => void;
  onDeleteError: () => void;
}

const PendingTransactions = ({ userId, onConfirmSuccess, onConfirmError, onDeleteError }: Props) => {
  const { data: pending = [], isLoading } = usePendingTransactions(userId);
  const confirmMutation = useConfirmTransaction(userId);
  const deleteMutation  = useDeleteTransaction(userId);

  // id de la transaction en cours de confirmation
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [confirmDate,  setConfirmDate]  = useState(today());

  const handleConfirm = (id: string) => {
    if (!confirmDate) return;
    const [y, m, d] = confirmDate.split('-');
    confirmMutation.mutate(
      { id, date: `${d}-${m}-${y}` },
      {
        onSuccess: () => { setConfirmingId(null); onConfirmSuccess(); },
        onError:   () => { setConfirmingId(null); onConfirmError(); },
      },
    );
  };

  if (isLoading) return null; // silencieux si chargement

  return (
    <div className="card">
      <div className="list-header">
        <div className="card-title" style={{ margin: 0 }}>
          Dépenses prévisionnelles
          {pending.length > 0 && (
            <span className="badge badge-pending-count">{pending.length}</span>
          )}
        </div>
      </div>

      {pending.length === 0 && (
        <div className="empty-state" style={{ padding: '28px 20px' }}>
          <div className="empty-icon" style={{ fontSize: 24 }}>✓</div>
          <div className="empty-text">Aucune charge en attente</div>
        </div>
      )}

      {pending.length > 0 && (
        <div className="tx-list">
          {pending.map(t => {
            const isConfirming = confirmingId === t.id;
            const isDeleting   = deleteMutation.isPending && deleteMutation.variables === t.id;

            return (
              <div key={t.id}
                className={`tx-item pending ${t.type}`}
                onClick={() => !isConfirming && setConfirmingId(t.id)}
                style={{ cursor: isConfirming ? 'default' : 'pointer' }}
                title={isConfirming ? '' : 'Cliquer pour renseigner la date'}>

                <div className="tx-icon pending-icon">{t.type === 'income' ? '▲' : '▼'}</div>

                <div className="tx-info">
                  <div className="tx-desc">{t.description}</div>
                  <div className="tx-meta">
                    <span className="badge badge-pending">en attente</span>
                    <span className="badge badge-bank">{bankLabel(t.bank)}</span>
                    <span className="badge badge-cat">{catIcon(t.category)} {catLabel(t.category)}</span>
                    {t.isRecurring && <span className="badge badge-recurring">🔄 récurrent</span>}
                  </div>

                  {/* Inline confirmation */}
                  {isConfirming && (
                    <div className="confirm-row" onClick={e => e.stopPropagation()}>
                      <input type="date" className="form-input confirm-date"
                        value={confirmDate} onChange={e => setConfirmDate(e.target.value)} />
                      <button className="btn-confirm"
                        disabled={confirmMutation.isPending}
                        onClick={() => handleConfirm(t.id)}>
                        {confirmMutation.isPending ? '…' : '✓ Confirmer'}
                      </button>
                      <button className="btn-cancel" onClick={() => setConfirmingId(null)}>
                        Annuler
                      </button>
                    </div>
                  )}
                </div>

                <div className="tx-right" onClick={e => e.stopPropagation()}>
                  <span className="tx-amount pending-amount">
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

export default PendingTransactions;
