import { IsString, IsNotEmpty, MaxLength, IsIn, IsArray, ArrayMaxSize } from 'class-validator';
import { BANKS } from '../../transactions/constants/transaction.constants';

const PROFILE_COLORS = ['amber', 'violet', 'emerald', 'rose', 'sky', 'orange', 'teal', 'pink'] as const;

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @IsIn(PROFILE_COLORS)
  color: string;

  @IsArray()
  @ArrayMaxSize(7)
  @IsIn(BANKS, { each: true })
  banks: string[];
}