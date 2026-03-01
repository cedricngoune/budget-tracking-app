import { useGetBalance } from '../hooks/useTransactions.ts';
import { CATEGORIES } from '../types/transaction.ts';
import './Dashboard.css';

const fmt = (n: number) =>
  new Intl.NumberFormat('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const catLabel = (slug: string) => CATEGORIES.find(c => c.slug === slug)?.label ?? slug;
const catIcon  = (slug: string) => CATEGORIES.find(c => c.slug === slug)?.icon  ?? '📌';

interface Props {
  userId: string;
}

const Category = ({ userId }: Props) => {
  const { data: balance, isLoading, isError } = useGetBalance(userId);

  if (isLoading) return null;
  if (isError || !balance || Object.keys(balance.byCategory).length === 0) return null;

  return (
    <div className="card">
      <div className="card-title">Répartition par catégorie</div>
      <div className="cur-list">
        {Object.entries(balance.byCategory)
          .sort((a, b) => b[1].expense - a[1].expense)
          .map(([slug, d]) => (
            <div key={slug} className="cur-row">
              <span className="cur-code">{catIcon(slug)} {catLabel(slug)}</span>
              <div className="cur-stats">
                {d.income  > 0 && <span className="cur-income">▲ {fmt(d.income)} €</span>}
                {d.expense > 0 && <span className="cur-expense">▼ {fmt(d.expense)} €</span>}
              </div>
              <span className={`cur-bal ${d.total >= 0 ? 'pos' : 'neg'}`}>
                {d.total >= 0 ? '+' : ''}{fmt(d.total)} €
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Category;
