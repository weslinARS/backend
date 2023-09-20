import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGODB_URI } from 'config';
import { AccountModule } from './account/account.module';
import { ErrorCatcherMiddleware } from './middlewares/error-catcher/error-catcher.middleware';
import { UserCredentialsModule } from './user-credentials/user-credentials.module';
import { ExpenseModule } from './expense/expense.module';
@Module({
  imports: [
    MongooseModule.forRoot(MONGODB_URI),
    UserCredentialsModule,
    AccountModule,
    ExpenseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorCatcherMiddleware).forRoutes('*');
  }
}
