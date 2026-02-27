import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type TransactionDocument = HydratedDocument<Transaction>;
export type TransactionType = 'income' | 'expense';

@Schema({ timestamps: true, collection: 'transactions' })
export class Transaction {
  @Prop({ required: true, enum: ['income', 'expense'] })
  type: TransactionType;

  @Prop({ required: true, type: Number, min: 0.01 })
  amount: number;

  @Prop({ required: true, maxlength: 10 })
  currency: string;

  @Prop({ required: true, maxlength: 500 })
  description: string;

  @Prop({ required: true })
  date: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);

// Index for common queries
TransactionSchema.index({ date: -1 });
TransactionSchema.index({ type: 1, currency: 1 });
