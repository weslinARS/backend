import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
@Schema()
export class ExpenseObject {
  @Prop({
    required: true,
  })
  accountName: string;
  @Prop({
    required: true,
  })
  expenseAmount: string;
  @Prop({
    required: true,
  })
  expenseCategory: string;
  @Prop({
    required: true,
  })
  expenseCurrency: string;
  @Prop({
    required: true,
  })
  expenseDate: string;
  @Prop({
    required: true,
  })
  expenseDescription: string;
}
@Schema()
export class Expense {
  @Prop({
    required: true,
  })
  userId: ObjectId;
  @Prop({
    type: Array<ExpenseObject>(),
    required: true,
    default: [],
  })
  Expenses: ExpenseObject[];
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
export const ExpenseObjectSchema = SchemaFactory.createForClass(ExpenseObject);
