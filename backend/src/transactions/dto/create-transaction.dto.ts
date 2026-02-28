import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsBoolean,
  IsOptional,
  MaxLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BANKS, CATEGORIES } from '../constants/transaction.constants';

export class CreateTransactionDto {
  @IsIn(['income', 'expense'])
  type: 'income' | 'expense';

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  // Optionnel : absent = transaction prévisionnelle
  @IsOptional()
  @IsString()
  @Matches(/^\d{2}-\d{2}-\d{4}$/, { message: 'date must be DD-MM-YYYY' })
  date?: string;

  @IsIn(BANKS)
  bank: string;

  @IsIn(CATEGORIES)
  category: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsIn(['daily', 'weekly', 'monthly', 'yearly'])
  recurringFrequency?: string;
}
