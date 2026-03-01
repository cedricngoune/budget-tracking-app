import { useGetBalance } from '../hooks/useTransactions.ts';
import { BANKS } from '../types/transaction.ts';
import './Dashboard.css';

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

interface Props {
  userId: string;
  selectedBank?: string;
}

const Dashboard = ({ userId, selectedBank }: Props) => {
  const { data: balance, isLoading, isError } = useGetBalance(userId, selectedBank);

  if (isLoading) return <div className="loading"><div className="spinner" />Chargement...</div>;
  if (isError)   return <div className="error-msg">Impossible de charger les soldes.</div>;
  if (!balance)  return null;

  const bankName = selectedBank
    ? (BANKS.find(b => b.slug === selectedBank)?.label ?? selectedBank)
    : null;

  const card1Sub = bankName != null
    ? `${bankName} · ▲ ${fmt(balance.currentIncome)} — ▼ ${fmt(balance.currentExpense)} €`
    : `${balance.count} transaction${balance.count !== 1 ? 's' : ''} réelle${balance.count !== 1 ? 's' : ''}`;

  return (
    <div className="summary-grid">
      <div className="summary-card balance">
        <div className="s-label">Solde courant</div>
        <div className="s-amount">{balance.currentBalance >= 0 ? '+' : ''}{fmt(balance.currentBalance)} €</div>
        <div className="s-sub">{card1Sub}</div>
      </div>
      <div className="summary-card forecast">
        <div className="s-label">Solde prévisionnel</div>
        <div className="s-amount">{balance.forecastBalance >= 0 ? '+' : ''}{fmt(balance.forecastBalance)} €</div>
        <div className="s-sub">{balance.pendingCount} charge{balance.pendingCount !== 1 ? 's' : ''} en attente</div>
      </div>
    </div>
  );
};

export default Dashboard;
