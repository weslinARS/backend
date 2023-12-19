import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SECRET_KEY } from 'config';
import { CredencialesUsuarioModule } from './credenciales-usuario/credenciales-usuario.module';
import { CursoModule } from './curso/curso.module';
import { HistorialAccionesModule } from './historial-acciones/historial-acciones.module';
import { ErrorCatcherMiddleware } from './middlewares/error-catcher/error-catcher.middleware';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { ProfesorModule } from './profesor/profesor.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AsignaturaModule } from './asignatura/asignatura.module';
import { AsignacionModule } from './asignacion/asignacion.module';
import { CalificacionModule } from './calificacion/calificacion.module';
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
    ProfesorModule,
    CursoModule,
    HistorialAccionesModule,
    UsuarioModule,
    AsignaturaModule,
    AsignacionModule,
    CalificacionModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ErrorCatcherMiddleware).forRoutes('*');
  }
}
