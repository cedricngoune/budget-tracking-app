import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ConfirmTransactionDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}-\d{2}-\d{4}$/, { message: 'date must be DD-MM-YYYY' })
  date: string;
}
