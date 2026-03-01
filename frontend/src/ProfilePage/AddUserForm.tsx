import { useState } from 'react';
import { Dialog } from 'radix-ui';
import { BANKS, PROFILE_COLORS } from '../Transaction/types/transaction';
import { useCreateUser } from '../Transaction/hooks/useUsers';
import '../Transaction/components/ui/radix.css';
import './AddUserForm.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

const AddUserForm = ({ open, onClose }: Props) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(PROFILE_COLORS[0].id);
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [nameError, setNameError] = useState('');

  const createMutation = useCreateUser();

  const toggleBank = (slug: string) => {
    setSelectedBanks(prev =>
      prev.includes(slug) ? prev.filter(b => b !== slug) : [...prev, slug],
    );
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      setNameError('Le nom est requis');
      return;
    }
    setNameError('');

    createMutation.mutate(
      { name: name.trim(), color, banks: selectedBanks },
      {
        onSuccess: () => {
          setName('');
          setColor(PROFILE_COLORS[0].id);
          setSelectedBanks([]);
          onClose();
        },
      },
    );
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setName('');
      setColor(PROFILE_COLORS[0].id);
      setSelectedBanks([]);
      setNameError('');
      onClose();
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content" aria-describedby={undefined}>
          <Dialog.Title className="dialog-title">Nouveau profil</Dialog.Title>

          {/* Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="user-name">Nom</label>
            <input
              id="user-name"
              type="text"
              className={`form-input${nameError ? ' invalid' : ''}`}
              placeholder="Ex : Charline, Cédric..."
              maxLength={50}
              value={name}
              onChange={e => { setName(e.target.value); setNameError(''); }}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              autoFocus
            />
            {nameError && <span className="field-error">{nameError}</span>}
          </div>

          {/* Color picker */}
          <div className="form-group">
            <span className="form-label">Couleur</span>
            <div className="color-picker">
              {PROFILE_COLORS.map(c => (
                <button
                  key={c.id}
                  type="button"
                  className={`color-swatch${color === c.id ? ' selected' : ''}`}
                  onClick={() => setColor(c.id)}
                  title={c.id}
                  style={{ '--swatch-color': c.hex, '--swatch-bg': c.bg } as React.CSSProperties}
                >
                  <span className="color-dot" />
                </button>
              ))}
            </div>
          </div>

          {/* Banks multiselect */}
          <div className="form-group">
            <span className="form-label">Banques (optionnel)</span>
            <div className="radio-grid">
              {BANKS.map(b => (
                <div
                  key={b.slug}
                  className={`radio-card${selectedBanks.includes(b.slug) ? ' selected' : ''}`}
                  onClick={() => toggleBank(b.slug)}
                  role="checkbox"
                  aria-checked={selectedBanks.includes(b.slug)}
                  tabIndex={0}
                  onKeyDown={e => e.key === ' ' && toggleBank(b.slug)}
                >
                  {b.label}
                </div>
              ))}
            </div>
            <p className="add-user-hint">
              Sélectionner les banques à afficher dans le formulaire de transaction. Laisser vide pour toutes.
            </p>
          </div>

          <div className="dialog-footer">
            <Dialog.Close asChild>
              <button type="button" className="btn-cancel">Annuler</button>
            </Dialog.Close>
            <button
              type="button"
              className="btn-confirm"
              onClick={handleSubmit}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Création...' : 'Créer le profil'}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default AddUserForm;
