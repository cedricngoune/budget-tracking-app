import { PrismaClient, TransactionType, RecurringFrequency } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Quelques transactions de démonstration
  const demos = [
    {
      type: 'income' as TransactionType,
      amount: 2800,
      description: 'Salaire février 2026',
      date: '28-02-2026',
      bank: 'societe-generale',
      category: 'salaire',
      isRecurring: true,
      recurringFrequency: 'monthly' as RecurringFrequency,
      isPending: false,
    },
    {
      type: 'expense' as TransactionType,
      amount: 850,
      description: 'Loyer février',
      date: '01-02-2026',
      bank: 'boursorama',
      category: 'loyer',
      isRecurring: true,
      recurringFrequency: 'monthly' as RecurringFrequency,
      isPending: false,
    },
    {
      type: 'expense' as TransactionType,
      amount: 14.99,
      description: 'Netflix',
      date: '05-02-2026',
      bank: 'hello-bank',
      category: 'abonnement',
      isRecurring: true,
      recurringFrequency: 'monthly' as RecurringFrequency,
      isPending: false,
    },
    {
      type: 'expense' as TransactionType,
      amount: 120,
      description: 'Courses semaine',
      date: '20-02-2026',
      bank: 'societe-generale',
      category: 'alimentaire',
      isRecurring: false,
      isPending: false,
    },
    {
      type: 'expense' as TransactionType,
      amount: 500,
      description: 'Virement épargne',
      bank: 'livret-a',
      category: 'epargne',
      isRecurring: true,
      recurringFrequency: 'monthly' as RecurringFrequency,
      isPending: true, // prévisionnelle — pas de date
    },
  ];

  for (const tx of demos) {
    await prisma.transaction.upsert({
      where: { id: 'seed-' + tx.description.replace(/\s/g, '-').toLowerCase() },
      update: {},
      create: {
        id: 'seed-' + tx.description.replace(/\s/g, '-').toLowerCase(),
        ...tx,
        currency: 'EUR',
        date: (tx as any).date ?? null,
      } as any,
    });
  }

  console.log('✅ Seed terminé');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
