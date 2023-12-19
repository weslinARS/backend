import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/guards/roles/roles.guard';
import { HistorialAccionesService } from 'src/historial-acciones/historial-acciones.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { CursoController } from './curso.controller';
import { CursoService } from './curso.service';

@Module({
  controllers: [CursoController],
  providers: [
    CursoService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    PrismaService,
    HistorialAccionesService,
    UsuarioService,
  ],
})
export class CursoModule {}
