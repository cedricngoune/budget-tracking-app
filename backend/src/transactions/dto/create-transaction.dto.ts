import {IsIn, IsNotEmpty, IsNumber, IsPositive, IsString, MaxLength, Matches, IsEnum} from 'class-validator';
import { Type } from 'class-transformer';

enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}
export class CreateTransactionDto {
  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: 'income' | 'expense';

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @IsPositive()
  amount: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  currency: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}-\d{2}-\d{4}$/, { message: 'date must be DD-MM-YYYY' })
  date: string;
}
