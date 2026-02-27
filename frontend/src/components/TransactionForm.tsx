import { useState } from 'react';
import { CURRENCY, TransactionType } from '../types/transaction';
import { useCreateTransaction } from '../hooks/useTransactions';

const today = () => new Date().toISOString().split('T')[0];

interface Props {
  onSuccess: () => void;
  onError: () => void;
}

const TransactionForm = ({ onSuccess, onError }: Props) => {
  const [type, setType]               = useState<TransactionType>('expense');
  const [amount, setAmount]           = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate]               = useState(today);

  const createMutation = useCreateTransaction();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !date) return;

    const [y, m, d] = date.split('-');
    const formattedDate = `${d}-${m}-${y}`;

    createMutation.mutate(
        { type, amount: parseFloat(amount), currency: CURRENCY.code, description: description.trim(), date: formattedDate },
        {
          onSuccess: () => {
            setAmount('');
            setDescription('');
            setDate(today());
            onSuccess();
          },
          onError,
        },
    );
  };

  const isPending = createMutation.isPending;

  return (
      <div className="card">
        <div className="card-title">Nouvelle transaction</div>
        <form className="form" onSubmit={handleSubmit}>
          {/* Type */}
          <div className="form-group">
            <span className="form-label">Type</span>
            <div className="type-toggle">
              <button type="button" className={`type-btn ${type === 'income' ? 'active income' : ''}`} onClick={() => setType('income')}>
                ▲ Revenu
              </button>
              <button type="button" className={`type-btn ${type === 'expense' ? 'active expense' : ''}`} onClick={() => setType('expense')}>
                ▼ Dépense
              </button>
            </div>
          </div>

          {/* Montant — € affiché en badge fixe à droite */}
          <div className="form-group">
            <label className="form-label" htmlFor="amount">Montant</label>
            <div style={{ position: 'relative' }}>
              <input id="amount" type="number" className="form-input" placeholder="0.00"
                     step="0.01" min="0.01" value={amount} onChange={e => setAmount(e.target.value)}
                     style={{ paddingRight: '52px' }} required />
              <span style={{
                position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)',
                fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--gold)',
                letterSpacing: '1px', pointerEvents: 'none',
              }}>
              {CURRENCY.symbol}
            </span>
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="desc">Motif</label>
            <input id="desc" type="text" className="form-input" placeholder="Description de la transaction..."
                   value={description} onChange={e => setDescription(e.target.value)} maxLength={500} required />
          </div>

          {/* Date */}
          <div className="form-group">
            <label className="form-label" htmlFor="date">Date</label>
            <input id="date" type="date" className="form-input" value={date}
                   onChange={e => setDate(e.target.value)} required />
          </div>

          <button type="submit" className="btn-submit" disabled={isPending}>
            {isPending ? 'Enregistrement...' : '+ Enregistrer'}
          </button>
        </form>
      </div>
  );
};

export default TransactionForm;