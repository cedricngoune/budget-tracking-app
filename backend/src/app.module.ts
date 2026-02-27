import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {ConfigModule} from '@nestjs/config'
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env'
      }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/budget-tracker',
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log('✅ MongoDB connected');
          });
          connection.on('error', (err: Error) => {
            console.error('❌ MongoDB error:', err.message);
          });
          return connection;
        },
      }),
    }),
    TransactionsModule,
  ],
})
export class AppModule {}
