import { User, PROFILE_COLORS } from '../types/transaction';

interface Props {
  currentUser: User;
  onSwitchProfile: () => void;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const Header = ({ currentUser, onSwitchProfile }: Props) => {
  const dateStr = new Date().toLocaleDateString('fr-FR', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  }).toUpperCase();

  const colorDef = PROFILE_COLORS.find(c => c.id === currentUser.color) ?? PROFILE_COLORS[0];

  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">
          <div className="header-brand">
            <span className="header-logo">BudgetTrack</span>
            <span className="header-tag">Gestion financière personnelle</span>
          </div>
          <div className="header-right">
            <div className="header-date">{dateStr}</div>
            <button
              className="header-profile-btn"
              onClick={onSwitchProfile}
              title="Changer de profil"
            >
              <div
                className="header-avatar"
                style={{
                  background: colorDef.bg,
                  color: colorDef.hex,
                  border: `1.5px solid ${colorDef.hex}`,
                }}
              >
                {getInitials(currentUser.name)}
              </div>
              <span className="header-profile-name">{currentUser.name}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
