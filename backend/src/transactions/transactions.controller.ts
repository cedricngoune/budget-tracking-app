import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ConfirmTransactionDto } from './dto/confirm-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // POST /api/transactions
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(dto);
  }

  // PATCH /api/transactions/:id/confirm — confirme une transaction prévisionnelle
  @Patch(':id/confirm')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  confirm(
    @Param('id') id: string,
    @Body() dto: ConfirmTransactionDto,
    @Query('userId') userId: string,
  ) {
    return this.transactionsService.confirm(id, dto, userId);
  }

  // GET /api/transactions/balance?userId=&bank=
  @Get('balance')
  getBalance(
    @Query('userId') userId: string,
    @Query('bank') bank?: string,
  ) {
    return this.transactionsService.getBalance(userId, bank);
  }

  // GET /api/transactions/pending?userId=
  @Get('pending')
  findPending(@Query('userId') userId: string) {
    return this.transactionsService.findPending(userId);
  }

  // GET /api/transactions/recurring?userId=
  @Get('recurring')
  findRecurring(@Query('userId') userId: string) {
    return this.transactionsService.findRecurring(userId);
  }

  // GET /api/transactions?userId=&type=&bank=&category=&month=MM-YYYY
  @Get()
  findAll(
    @Query('userId')   userId: string,
    @Query('type')     type?: string,
    @Query('bank')     bank?: string,
    @Query('category') category?: string,
    @Query('month')    month?: string,
  ) {
    return this.transactionsService.findAll({ userId, type, bank, category, month });
  }

  // GET /api/transactions/:id?userId=
  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ) {
    return this.transactionsService.findOne(id, userId);
  }

  // DELETE /api/transactions/:id?userId=
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id') id: string,
    @Query('userId') userId: string,
  ) {
    return this.transactionsService.remove(id, userId);
  }
}