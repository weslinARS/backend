import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProfesorController } from './profesor.controller';
import { ProfesorService } from './profesor.service';

@Module({
  controllers: [ProfesorController],
  providers: [ProfesorService, PrismaService],
})
export class ProfesorModule {}
