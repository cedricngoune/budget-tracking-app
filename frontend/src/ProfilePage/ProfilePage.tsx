import { useState } from 'react';
import { User, PROFILE_COLORS } from '../Transaction/types/transaction';
import { useGetUsers, useDeleteUser } from '../Transaction/hooks/useUsers';
import { useCurrentUser } from '../context/UserContext';
import AddUserForm from './AddUserForm';
import './ProfilePage.css';

interface Props {
  onSelectUser: (user: User) => void;
}

const MAX_PROFILES = 8;

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const ProfilePage = ({ onSelectUser }: Props) => {
  const { data: users = [], isLoading } = useGetUsers();
  const deleteMutation = useDeleteUser();
  const { setCurrentUser } = useCurrentUser();
  const [addOpen, setAddOpen] = useState(false);

  const handleSelect = (user: User) => {
    setCurrentUser(user);
    onSelectUser(user);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteMutation.mutate(id);
  };

  return (
    <div className="profile-page">
      <header className="profile-header">
        <span className="header-logo">BudgetTrack</span>
      </header>

      <main className="profile-main">
        <h1 className="profile-title">Qui utilise BudgetTrack ?</h1>

        {isLoading ? (
          <div className="loading"><div className="spinner" />Chargement...</div>
        ) : (
          <div className="profile-grid">
            {users.map(user => {
              const colorDef = PROFILE_COLORS.find(c => c.id === user.color) ?? PROFILE_COLORS[0];
              return (
                <div
                  key={user.id}
                  className="profile-card"
                  onClick={() => handleSelect(user)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === 'Enter' && handleSelect(user)}
                >
                  <div
                    className="profile-avatar"
                    style={{ background: colorDef.bg, color: colorDef.hex, border: `2px solid ${colorDef.hex}` }}
                  >
                    {getInitials(user.name)}
                  </div>
                  <span className="profile-name">{user.name}</span>
                  <button
                    className="profile-delete"
                    onClick={e => handleDelete(e, user.id)}
                    title="Supprimer ce profil"
                    aria-label="Supprimer"
                  >
                    ×
                  </button>
                </div>
              );
            })}

            {users.length < MAX_PROFILES && (
              <div
                className="profile-card profile-card-add"
                onClick={() => setAddOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setAddOpen(true)}
              >
                <div className="profile-avatar-add">+</div>
                <span className="profile-name">Ajouter</span>
              </div>
            )}
          </div>
        )}
      </main>

      <AddUserForm open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
};

export default ProfilePage;
