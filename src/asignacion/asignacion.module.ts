import { Module } from '@nestjs/common';
import { HistorialAccionesService } from 'src/historial-acciones/historial-acciones.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { AsignacionController } from './asignacion.controller';
import { AsignacionService } from './asignacion.service';

@Module({
  controllers: [AsignacionController],
  providers: [
    AsignacionService,
    PrismaService,
    UsuarioService,
    HistorialAccionesService,
  ],
})
export class AsignacionModule {}
