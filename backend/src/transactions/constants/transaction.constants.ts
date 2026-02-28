export const BANKS = [
  'societe-generale',
  'hello-bank',
  'livret-a',
  'boursorama',
  'credit-agricole',
  'bnp-paribas',
  'autre',
] as const;

export const BANK_LABELS: Record<string, string> = {
  'societe-generale': 'Société Générale',
  'hello-bank':       'Hello Bank',
  'livret-a':         'Livret A',
  'boursorama':       'Boursorama',
  'credit-agricole':  'Crédit Agricole',
  'bnp-paribas':      'BNP Paribas',
  'autre':            'Autre',
};

export const CATEGORIES = [
  'salaire',
  'alimentaire',
  'epargne',
  'vente',
  'investissement',
  'transport',
  'facture',
  'abonnement',
  'loyer',
  'achats-perso',
  'achat-maison',
  'sante',
  'loisir',
  'autre',
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  'salaire':        'Salaire',
  'alimentaire':    'Alimentaire',
  'epargne':        'Épargne',
  'vente':          'Vente',
  'investissement': 'Investissement',
  'transport':      'Transport',
  'facture':        'Facture',
  'abonnement':     'Abonnement',
  'loyer':          'Loyer',
  'achats-perso':   'Achats perso',
  'achat-maison':   'Achat maison',
  'sante':          'Santé',
  'loisir':         'Loisir',
  'autre':          'Autre',
};

export type BankSlug = typeof BANKS[number];
export type CategorySlug = typeof CATEGORIES[number];
