import { Module } from '@nestjs/common';
import { HistorialAccionesService } from 'src/historial-acciones/historial-acciones.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { AsignaturaController } from './asignatura.controller';
import { AsignaturaService } from './asignatura.service';

@Module({
  controllers: [AsignaturaController],
  providers: [
    AsignaturaService,
    PrismaService,
    UsuarioService,
    HistorialAccionesService,
  ],
})
export class AsignaturaModule {}
