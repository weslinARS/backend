import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import {
  Account,
  AccountObject,
  AccountObjectSchema,
  AccountSchema,
} from './entities/account.entity';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Account.name,
        schema: AccountSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: AccountObject.name,
        schema: AccountObjectSchema,
      },
    ]),
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
