import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from './context/UserContext';
import { User } from './Transaction/types/transaction';
import Header from './Transaction/components/Header';
import Dashboard from './Transaction/components/Dashboard';
import Category from './Transaction/components/Category.tsx';
import TransactionForm from './Transaction/TransactionForm/TransactionForm.tsx';
import TransactionList from './Transaction/TransactionList/TransactionList.tsx';
import PendingTransactions from './Transaction/TransactionPending/PendingTransactions.tsx';
import ProfilePage from './ProfilePage/ProfilePage.tsx';

interface Toast { msg: string; type: 'success' | 'error'; id: number }
let toastId = 0;

function App() {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const queryClient = useQueryClient();
  const [view, setView] = useState<'profiles' | 'dashboard'>(
    currentUser ? 'dashboard' : 'profiles',
  );
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedBank, setSelectedBank] = useState<string | undefined>(undefined);

  const addToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { msg, type, id }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  const handleSelectUser = (user: User) => {
    setCurrentUser(user);
    setView('dashboard');
  };

  const handleSwitchProfile = () => {
    queryClient.clear();
    setCurrentUser(null);
    setView('profiles');
  };

  if (view === 'profiles' || !currentUser) {
    return <ProfilePage onSelectUser={handleSelectUser} />;
  }

  const userId = currentUser.id;

  return (
    <div className="app">
      <Header currentUser={currentUser} onSwitchProfile={handleSwitchProfile} />

      <main className="main-content" style={{ paddingTop: 0 }}>

        {/* ── Dashboard sticky ── */}
        <div className="section-sticky">
          <div className="container">
            <p className="section-sub">Vue d'ensemble</p>
            <h2 className="section-title">Tableau de bord</h2>
            <div className="divider" />
            <Dashboard userId={userId} selectedBank={selectedBank} />
          </div>
        </div>

        {/* ── Scrollable content ── */}
        <div className="container" style={{ paddingTop: 40 }}>

          {/* Formulaire + Historique */}
          <div>
            <p className="section-sub">Gestion</p>
            <h2 className="section-title">Transactions</h2>
            <div className="divider" />
            <div className="grid-2">
              <TransactionForm
                userId={userId}
                onSuccess={() => addToast('Transaction enregistrée ✓')}
                onError={() => addToast("Erreur lors de l'enregistrement", 'error')}
              />
              <TransactionList
                userId={userId}
                onBankChange={setSelectedBank}
                onDeleteError={() => addToast('Erreur lors de la suppression', 'error')}
              />
            </div>
          </div>

          {/* Dépenses prévisionnelles + Répartition par catégorie */}
          <div className="grid-2" style={{ marginTop: 32 }}>
            <PendingTransactions
              userId={userId}
              onConfirmSuccess={() => addToast('Transaction confirmée ✓')}
              onConfirmError={() => addToast('Erreur lors de la confirmation', 'error')}
              onDeleteError={() => addToast('Erreur lors de la suppression', 'error')}
            />
            <Category userId={userId} />
          </div>

        </div>
      </main>

      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>
      ))}
    </div>
  );
}

export default App;
