import { useForm, Controller } from 'react-hook-form';
import { Dialog } from 'radix-ui';
import { BANKS, CURRENCY, RecurringFrequency } from '../types/transaction.ts';
import { useCreateTransaction } from '../hooks/useTransactions.ts';
import { useCustomCategories } from '../hooks/useCustomCategories.ts';
import { useCurrentUser } from '../../context/UserContext.tsx';
import AppSelect from '../components/ui/Select.tsx';
import AppCheckbox from '../components/ui/Checkbox.tsx';
import './TransactionForm.css';

interface FormValues {
  type:               'income' | 'expense';
  description:        string;
  amount:             string;
  date:               string;
  bank:               string;
  category:           string;
  isRecurring:        boolean;
  recurringFrequency: RecurringFrequency;
}

const FREQUENCY_OPTIONS = [
  { value: 'daily',   label: 'Quotidien'    },
  { value: 'weekly',  label: 'Hebdomadaire' },
  { value: 'monthly', label: 'Mensuel'      },
  { value: 'yearly',  label: 'Annuel'       },
];

interface Props {
  userId: string;
  onSuccess: () => void;
  onError: () => void;
}

const TransactionForm = ({ userId, onSuccess, onError }: Props) => {
  const { currentUser } = useCurrentUser();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      type:               'expense',
      description:        '',
      amount:             '',
      date:               '',
      bank:               '',
      category:           '',
      isRecurring:        false,
      recurringFrequency: 'monthly',
    },
  });

  const type        = watch('type');
  const isRecurring = watch('isRecurring');
  const bank        = watch('bank');
  const date        = watch('date');

  const {
    allCategories,
    dialogOpen,  setDialogOpen,
    newCatName,  setNewCatName,
    newCatError, setNewCatError,
    handleAddCategory,
  } = useCustomCategories(slug => setValue('category', slug, { shouldValidate: true }));

  const createMutation = useCreateTransaction(userId);

  // Filter banks: if user has specific banks configured, show only those
  const availableBanks = currentUser?.banks?.length
    ? BANKS.filter(b => currentUser.banks.includes(b.slug))
    : BANKS;

  const onSubmit = (data: FormValues) => {
    let formattedDate: string | undefined;
    if (data.date) {
      const [y, m, d] = data.date.split('-');
      formattedDate = `${d}-${m}-${y}`;
    }

    createMutation.mutate(
      {
        userId,
        type:               data.type,
        amount:             parseFloat(data.amount),
        description:        data.description.trim(),
        date:               formattedDate,
        bank:               data.bank,
        category:           data.category,
        isRecurring:        data.isRecurring,
        recurringFrequency: data.isRecurring ? data.recurringFrequency : undefined,
      },
      {
        onSuccess: () => { reset(); onSuccess(); },
        onError,
      },
    );
  };

  return (
    <div className="card">
      <div className="card-title">Nouvelle transaction</div>
      <form className="form" onSubmit={handleSubmit(onSubmit)}>

        {/* ── Type ── */}
        <div className="form-group">
          <span className="form-label">Type</span>
          <div className="type-toggle">
            <button type="button"
              className={`type-btn ${type === 'income'  ? 'active income'  : ''}`}
              onClick={() => setValue('type', 'income')}>▲ Revenu</button>
            <button type="button"
              className={`type-btn ${type === 'expense' ? 'active expense' : ''}`}
              onClick={() => setValue('type', 'expense')}>▼ Dépense</button>
          </div>
        </div>


        {/* ── Libellé ── */}
        <div className="form-group">
          <label className="form-label" htmlFor="desc">Libellé</label>
          <input
            id="desc"
            type="text"
            className={`form-input${errors.description ? ' invalid' : ''}`}
            placeholder="Par ex: Remboursement"
            {...register('description', {
              required:  'Le libellé est requis',
              maxLength: { value: 500, message: '500 caractères max' },
            })}
          />
          {errors.description && (
            <span className="field-error">{errors.description.message}</span>
          )}
        </div>

        {/* ── Montant ── */}
        <div className="form-group">
          <label className="form-label" htmlFor="amount">Montant</label>
          <div style={{ position: 'relative' }}>
            <input
              id="amount"
              type="number"
              className={`form-input${errors.amount ? ' invalid' : ''}`}
              placeholder="0.00"
              step="0.01"
              style={{ paddingRight: '52px' }}
              {...register('amount', {
                required: 'Le montant est requis',
                min: { value: 0.01, message: 'Le montant doit être supérieur à 0' },
              })}
            />
            <span style={{
              position: 'absolute', right: 13, top: '50%', transform: 'translateY(-50%)',
              fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--gold)', pointerEvents: 'none',
            }}>
              {CURRENCY.symbol}
            </span>
          </div>
          {errors.amount && (
            <span className="field-error">{errors.amount.message}</span>
          )}
        </div>

        {/* ── Banque ── */}
        <div className="form-group">
          <span className="form-label">Banque</span>
          <div className="radio-grid">
            {availableBanks.map(b => (
              <label key={b.slug} className={`radio-card ${bank === b.slug ? 'selected' : ''}`}>
                <input
                  type="radio"
                  value={b.slug}
                  {...register('bank', { required: 'Sélectionner une banque' })}
                />
                {b.label}
              </label>
            ))}
          </div>
          {errors.bank && <span className="field-error">{errors.bank.message}</span>}
        </div>

        {/* ── Catégorie ── */}
        <div className="form-group">
          <span className="form-label">Catégorie</span>
          <Controller
            name="category"
            control={control}
            rules={{ required: 'Sélectionner une catégorie' }}
            render={({ field }) => (
              <AppSelect
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Sélectionner une catégorie..."
                options={allCategories.map(c => ({
                  value: c.slug,
                  label: `${c.icon}  ${c.label}`,
                }))}
              />
            )}
          />
          {errors.category && <span className="field-error">{errors.category.message}</span>}

          {/* ── Dialog : nouvelle catégorie ── */}
          <Dialog.Root open={dialogOpen} onOpenChange={open => { setDialogOpen(open); setNewCatName(''); setNewCatError(''); }}>
            <Dialog.Trigger asChild>
              <button type="button" className="btn-add-cat">+ Ajouter une catégorie</button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="dialog-overlay" />
              <Dialog.Content className="dialog-content" aria-describedby={undefined}>
                <Dialog.Title className="dialog-title">Nouvelle catégorie</Dialog.Title>

                <div className="form-group">
                  <label className="form-label" htmlFor="new-cat-name">Nom</label>
                  <input
                    id="new-cat-name"
                    type="text"
                    className={`form-input${newCatError ? ' invalid' : ''}`}
                    placeholder="Ex : Voyage, Cadeau..."
                    maxLength={30}
                    value={newCatName}
                    onChange={e => { setNewCatName(e.target.value); setNewCatError(''); }}
                    onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                    autoFocus
                  />
                  {newCatError && <span className="field-error">{newCatError}</span>}
                </div>

                <div className="dialog-footer">
                  <Dialog.Close asChild>
                    <button type="button" className="btn-cancel">Annuler</button>
                  </Dialog.Close>
                  <button type="button" className="btn-confirm" onClick={handleAddCategory}>
                    Confirmer
                  </button>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        {/* ── Date ── */}
        <div className="form-group">
          <label className="form-label" htmlFor="date">
            Date{' '}
            <span style={{ color: 'var(--txt-3)', fontWeight: 400 }}>
              (laisser vide = prévisionnelle)
            </span>
          </label>
          <input
            id="date"
            type="date"
            className="form-input"
            {...register('date')}
          />
        </div>

        {/* ── Récurrence ── */}
        <div className="form-group">
          <span className="form-label">Récurrence</span>
          <label className="toggle-row" htmlFor="is-recurring">
            <Controller
              name="isRecurring"
              control={control}
              render={({ field }) => (
                <AppCheckbox
                  id="is-recurring"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <span>Charge récurrente</span>
          </label>
          {isRecurring && (
            <Controller
              name="recurringFrequency"
              control={control}
              render={({ field }) => (
                <AppSelect
                  value={field.value}
                  onValueChange={field.onChange}
                  options={FREQUENCY_OPTIONS}
                />
              )}
            />
          )}
        </div>

        <button
          type="submit"
          className="btn-submit"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending
            ? 'Enregistrement...'
            : !date
              ? '+ Ajouter en prévisionnel'
              : '+ Enregistrer'}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
