import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';

export interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  count: number;
  byCurrency: Record<string, { income: number; expense: number; balance: number; count: number }>;
}

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async create(dto: CreateTransactionDto): Promise<TransactionDocument> {
    const created = new this.transactionModel(dto);
    return created.save();
  }

  async findAll(filters: { type?: string; currency?: string } = {}): Promise<TransactionDocument[]> {
    const query: Record<string, any> = {};
    if (filters.type) query.type = filters.type;
    if (filters.currency) query.currency = filters.currency;
    return this.transactionModel.find(query).sort({ date: -1, createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<TransactionDocument> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException(`Invalid id: ${id}`);
    const doc = await this.transactionModel.findById(id).exec();
    if (!doc) throw new NotFoundException(`Transaction ${id} not found`);
    return doc;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) throw new NotFoundException(`Invalid id: ${id}`);
    const result = await this.transactionModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Transaction ${id} not found`);
  }

  async getSummary(): Promise<Summary> {
    const pipeline = [
      {
        $group: {
          _id: {
            currency: '$currency',
            type: '$type',
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
    ];

    const agg = await this.transactionModel.aggregate(pipeline).exec();

    const byCurrency: Summary['byCurrency'] = {};
    let totalIncome = 0;
    let totalExpense = 0;
    let count = 0;

    for (const row of agg) {
      const { currency, type } = row._id;
      if (!byCurrency[currency]) {
        byCurrency[currency] = { income: 0, expense: 0, balance: 0, count: 0 };
      }
      byCurrency[currency][type as 'income' | 'expense'] += row.total;
      byCurrency[currency].count += row.count;
      count += row.count;

      if (type === 'income') totalIncome += row.total;
      else totalExpense += row.total;
    }

    for (const c of Object.values(byCurrency)) {
      c.balance = c.income - c.expense;
    }

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      count,
      byCurrency,
    };
  }
}
