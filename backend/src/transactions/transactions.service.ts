import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ConfirmTransactionDto } from './dto/confirm-transaction.dto';
import { Prisma, TransactionType, RecurringFrequency } from '@prisma/client';

export interface TransactionFilters {
  type?: string;
  bank?: string;
  category?: string;
  month?: string; // format MM-YYYY
  isPending?: boolean;
}

export interface Summary {
  // Solde courant = transactions réelles uniquement (isPending = false)
  currentBalance: number;
  currentIncome: number;
  currentExpense: number;

  // Solde prévisionnel = courant + transactions en attente
  forecastBalance: number;
  forecastIncome: number;
  forecastExpense: number;

  // Charges fixes récurrentes mensuelles
  monthlyRecurringTotal: number;

  count: number;
  pendingCount: number;

  byBank: Record<string, { income: number; expense: number; balance: number }>;
  byCategory: Record<string, { income: number; expense: number; total: number }>;
}

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Création ────────────────────────────────────────────────
  async create(dto: CreateTransactionDto) {
    const isPending = !dto.date;

    return this.prisma.transaction.create({
      data: {
        type:               dto.type as TransactionType,
        amount:             new Prisma.Decimal(dto.amount),
        currency:           'EUR',
        description:        dto.description,
        date:               dto.date ?? null,
        bank:               dto.bank,
        category:           dto.category,
        isPending,
        isRecurring:        dto.isRecurring ?? false,
        recurringFrequency: dto.recurringFrequency
                              ? (dto.recurringFrequency as RecurringFrequency)
                              : null,
      },
    });
  }

  // ── Confirmer une transaction prévisionnelle ─────────────────
  async confirm(id: string, dto: ConfirmTransactionDto) {
    await this.findOne(id);
    return this.prisma.transaction.update({
      where: { id },
      data: {
        date:      dto.date,
        isPending: false,
      },
    });
  }

  // ── Liste avec filtres ───────────────────────────────────────
  async findAll(filters: TransactionFilters = {}) {
    const where: Prisma.TransactionWhereInput = {};

    if (filters.type)     where.type     = filters.type as TransactionType;
    if (filters.bank)     where.bank     = filters.bank ;
    if (filters.category) where.category = filters.category ;

    // isPending explicite ou par défaut on retourne les transactions réelles
    if (typeof filters.isPending === 'boolean') {
      where.isPending = filters.isPending;
    } else {
      where.isPending = false;
    }

    // Filtre par mois (format MM-YYYY) → cherche dans le champ date DD-MM-YYYY
    if (filters.month) {
      const [mm, yyyy] = filters.month.split('-');
      where.date = { contains: `${mm}-${yyyy}` };
    }

    return this.prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Transactions prévisionnelles (isPending = true) ──────────
  async findPending() {
    return this.prisma.transaction.findMany({
      where:   { isPending: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  // ── Récurrentes ──────────────────────────────────────────────
  async findRecurring() {
    return this.prisma.transaction.findMany({
      where:   { isRecurring: true, isPending: false },
      orderBy: { category: 'asc' },
    });
  }

  // ── Détail ───────────────────────────────────────────────────
  async findOne(id: string) {
    const tx = await this.prisma.transaction.findUnique({ where: { id } });
    if (!tx) throw new NotFoundException(`Transaction ${id} introuvable`);
    return tx;
  }

  // ── Suppression ──────────────────────────────────────────────
  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.transaction.delete({ where: { id } });
  }

  // ── Résumé / Dashboard ──────────────────────────────────────
  async getSummary(): Promise<Summary> {
    const all = await this.prisma.transaction.findMany();

    const real    = all.filter(t => !t.isPending);
    const pending = all.filter(t => t.isPending);
    const recurring = real.filter(t => t.isRecurring && t.type === 'expense');

    // Solde courant
    let currentIncome  = 0;
    let currentExpense = 0;
    const byBank: Summary['byBank']         = {};
    const byCategory: Summary['byCategory'] = {};

    for (const t of real) {
      const amount = Number(t.amount);

      if (t.type === 'income') currentIncome  += amount;
      else                      currentExpense += amount;

      // Par banque
      if (!byBank[t.bank]) byBank[t.bank] = { income: 0, expense: 0, balance: 0 };
      if (t.type === 'income') byBank[t.bank].income  += amount;
      else                      byBank[t.bank].expense += amount;
      byBank[t.bank].balance = byBank[t.bank].income - byBank[t.bank].expense;

      // Par catégorie
      if (!byCategory[t.category]) byCategory[t.category] = { income: 0, expense: 0, total: 0 };
      if (t.type === 'income') byCategory[t.category].income  += amount;
      else                      byCategory[t.category].expense += amount;
      byCategory[t.category].total = byCategory[t.category].income - byCategory[t.category].expense;
    }

    // Solde prévisionnel = courant + charges en attente
    let pendingIncome  = 0;
    let pendingExpense = 0;
    for (const t of pending) {
      const amount = Number(t.amount);
      if (t.type === 'income') pendingIncome  += amount;
      else                      pendingExpense += amount;
    }

    // Charges récurrentes mensuelles
    const monthlyRecurringTotal = recurring
      .filter(t => t.recurringFrequency === 'monthly')
      .reduce((acc, t) => acc + Number(t.amount), 0);

    return {
      currentIncome,
      currentExpense,
      currentBalance: currentIncome - currentExpense,

      forecastIncome:  currentIncome  + pendingIncome,
      forecastExpense: currentExpense + pendingExpense,
      forecastBalance: (currentIncome - currentExpense) + (pendingIncome - pendingExpense),

      monthlyRecurringTotal,
      count:        real.length,
      pendingCount: pending.length,
      byBank,
      byCategory,
    };
  }
}
