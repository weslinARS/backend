import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountSchema } from 'src/Schemas/Accounts.schema';
import {
  Account,
  AccountObject,
  AccountObjectSchema,
} from 'src/account/entities/account.entity';
import {
  Expense,
  ExpenseObject,
  ExpenseObjectSchema,
  ExpenseSchema,
} from './entities/expense.entity';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Expense.name,
        schema: ExpenseSchema,
      },
      {
        name: AccountObject.name,
        schema: AccountObjectSchema,
      },
      {
        name: ExpenseObject.name,
        schema: ExpenseObjectSchema,
      },
      { name: Account.name, schema: AccountSchema },
    ]),
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
