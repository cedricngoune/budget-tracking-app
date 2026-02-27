const Header = () => {
  const dateStr = new Date().toLocaleDateString('fr-FR', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
  }).toUpperCase();

  return (
    <header className="header">
      <div className="container">
        <div className="header-inner">
          <div className="header-brand">
            <span className="header-logo">BudgetTrack</span>
            <span className="header-tag">Gestion financière personnelle</span>
          </div>
          <div className="header-date">{dateStr}</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
