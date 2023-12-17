import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CredencialesUsuarioController } from './credenciales-usuario.controller';
import { CredencialesUsuarioService } from './credenciales-usuario.service';

@Module({
  controllers: [CredencialesUsuarioController],
  providers: [CredencialesUsuarioService, PrismaService],
})
export class CredencialesUsuarioModule {}
