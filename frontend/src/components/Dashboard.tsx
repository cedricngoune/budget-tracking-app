import { useSummary } from '../hooks/useTransactions';

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const Dashboard = () => {
  const { data: summary, isLoading, isError } = useSummary();

  if (isLoading)
    return <div className="loading"><div className="spinner" />CHARGEMENT...</div>;

  if (isError)
    return <div className="error-msg">Impossible de charger le résumé.</div>;

  const s = summary ?? { totalIncome: 0, totalExpense: 0, balance: 0, count: 0, byCurrency: {} };

  return (
    <div>
      {/* Summary cards */}
      <div className="summary-grid">
        <div className="summary-card balance">
          <div className="s-label">Solde global</div>
          <div className="s-amount">{s.balance >= 0 ? '+' : ''}{fmt(s.balance)}</div>
          <div className="s-sub">{s.count} transaction{s.count > 1 ? 's' : ''}</div>
        </div>
        <div className="summary-card income">
          <div className="s-label">Total revenus</div>
          <div className="s-amount">+{fmt(s.totalIncome)}</div>
          <div className="s-sub">Entrées cumulées</div>
        </div>
        <div className="summary-card expense">
          <div className="s-label">Total dépenses</div>
          <div className="s-amount">-{fmt(s.totalExpense)}</div>
          <div className="s-sub">Sorties cumulées</div>
        </div>
      </div>

      {/* Currency breakdown */}
      {/*{Object.keys(s.byCurrency).length > 0 && (*/}
      {/*  <div className="card">*/}
      {/*    <div className="card-title">Répartition par devise</div>*/}
      {/*    <div className="cur-list">*/}
      {/*      {Object.entries(s.byCurrency).map(([code, d]) => (*/}
      {/*        <div key={code} className="cur-row">*/}
      {/*          <span className="cur-code">{code}</span>*/}
      {/*          <div className="cur-stats">*/}
      {/*            <span className="cur-income">▲ {fmt(d.income)}</span>*/}
      {/*            <span className="cur-expense">▼ {fmt(d.expense)}</span>*/}
      {/*          </div>*/}
      {/*          <span className={`cur-bal ${d.balance >= 0 ? 'pos' : 'neg'}`}>*/}
      {/*            {d.balance >= 0 ? '+' : ''}{fmt(d.balance)} {code}*/}
      {/*          </span>*/}
      {/*        </div>*/}
      {/*      ))}*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );
};

export default Dashboard;
