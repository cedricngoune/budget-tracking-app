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
  confirm(@Param('id') id: string, @Body() dto: ConfirmTransactionDto) {
    return this.transactionsService.confirm(id, dto);
  }

  // GET /api/transactions/summary
  @Get('summary')
  getSummary() {
    return this.transactionsService.getSummary();
  }

  // GET /api/transactions/pending
  @Get('pending')
  findPending() {
    return this.transactionsService.findPending();
  }

  // GET /api/transactions/recurring
  @Get('recurring')
  findRecurring() {
    return this.transactionsService.findRecurring();
  }

  // GET /api/transactions?type=&bank=&category=&month=MM-YYYY
  @Get()
  findAll(
    @Query('type')     type?: string,
    @Query('bank')     bank?: string,
    @Query('category') category?: string,
    @Query('month')    month?: string,
  ) {
    return this.transactionsService.findAll({ type, bank, category, month });
  }

  // GET /api/transactions/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  // DELETE /api/transactions/:id
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(id);
  }
}
