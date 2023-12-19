import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { HistorialAccionesController } from './historial-acciones.controller';
import { HistorialAccionesService } from './historial-acciones.service';

@Module({
  controllers: [HistorialAccionesController],
  providers: [HistorialAccionesService, PrismaService, UsuarioService],
})
export class HistorialAccionesModule {}
