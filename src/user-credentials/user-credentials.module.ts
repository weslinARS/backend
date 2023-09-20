import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { SECRET_KEY } from '../../config';
import {
  UserCredentials,
  UserCredSchema,
} from '../Schemas/UserCredentials.schema';
import { UserInfo, UserInfoSchema } from '../Schemas/UserInfo.schema';
import { LogInController } from './controllers/log-in/log-in.controller';
import { SignUpController } from './controllers/sign-up/sign-up.controller';
import { UserCredentialsService } from './user-credentials.service';
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: SECRET_KEY,
      signOptions: {
        expiresIn: '3d',
      },
    }),
    MongooseModule.forFeature([
      {
        name: UserCredentials.name,
        schema: UserCredSchema,
      },
    ]),
    MongooseModule.forFeature([
      {
        name: UserInfo.name,
        schema: UserInfoSchema,
      },
    ]),
  ],
  providers: [UserCredentialsService],
  controllers: [SignUpController, LogInController],
})
export class UserCredentialsModule {}
