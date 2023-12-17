import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CredencialesUsuarioModule } from './credenciales-usuario/credenciales-usuario.module';
import { ErrorCatcherMiddleware } from './middlewares/error-catcher/error-catcher.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { SECRET_KEY } from 'config';
@Module({
  imports: [
    PrismaModule,
    CredencialesUsuarioModule,
    JwtModule.register({
      global: true,
      secret: SECRET_KEY,
      signOptions: {
        expiresIn: '3d',
      },
    }),
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorCatcherMiddleware).forRoutes('*');
  }
}
