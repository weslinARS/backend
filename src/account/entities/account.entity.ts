import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { HydratedDocument } from 'mongoose';
@Schema()
export class AccountObject {
  @Prop({
    required: true,
    unique: true,
  })
  accountName: string;
  @Prop({
    required: true,
    options: ['savings', 'credit'],
  })
  accountType: string;
  @Prop({
    required: false,
    default: 0,
  })
  accountBalance: number;
  @Prop({
    required: false,
    options: ['dollars', 'euros', 'cordobas'],
  })
  accountCurrency: string;
  @Prop({
    required: false,
    default: true,
  })
  IncludedInBalance: boolean;
  @Prop({
    required: false,
  })
  accountCutOffDate: number;
  @Prop({
    required: false,
  })
  accountDeadlineDate: number;
  @Prop({
    required: false,
  })
  accountLimit: number;
}
@Schema()
export class Account {
  @Prop({
    required: true,
    unique: true,
  })
  userId: ObjectId;
  @Prop({
    required: true,
  })
  Accounts: Array<AccountObject>;
}
export const AccountSchema = SchemaFactory.createForClass(Account);
export const AccountObjectSchema = SchemaFactory.createForClass(AccountObject);
export type AccountDocument = HydratedDocument<Account>;
