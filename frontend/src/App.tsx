import { useState, useCallback } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';

interface Toast { msg: string; type: 'success' | 'error'; id: number }

let toastId = 0;

function App() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    const id = ++toastId;
    setToasts(prev => [...prev, { msg, type, id }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  return (
      <div className="app">
        <Header />

        <main className="main-content">
          <div className="container">

            {/* Dashboard */}
            <div style={{ marginBottom: '40px' }}>
              <p className="section-sub">Vue d'ensemble</p>
              <h2 className="section-title">Tableau de bord</h2>
              <div className="divider" />
              <Dashboard />
            </div>

            {/* Transactions */}
            <div>
              <p className="section-sub">Gestion</p>
              <h2 className="section-title">Transactions</h2>
              <div className="divider" />
              <div className="grid-2">
                <TransactionForm
                    onSuccess={() => addToast('Transaction enregistrée ✓')}
                    onError={() => addToast("Erreur lors de l'enregistrement", 'error')}
                />
                <TransactionList
                    onDeleteError={() => addToast('Erreur lors de la suppression', 'error')}
                />
              </div>
            </div>

          </div>
        </main>

        {/* Toasts */}
        {toasts.map(t => (
            <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>
        ))}
      </div>
  );
}

export default App;