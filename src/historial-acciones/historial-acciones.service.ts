/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { CreateHistorialAccioneDto } from './dto/create-historial-accione.dto';

@Injectable()
export class HistorialAccionesService {
  constructor(
    private prisma: PrismaService,
    private usuarioS: UsuarioService,
  ) {}
  async create(
    createHistorialAccioneDto: CreateHistorialAccioneDto,
  ): Promise<any> {
    try {
      const historiaCreada = await this.prisma.historialacciones.create({
        data: {
          Accion: createHistorialAccioneDto.Accion,
          TipoRegistro: createHistorialAccioneDto.TipoRegistro,
          IdUsuario: createHistorialAccioneDto.IdUsuario,
          IdRegistroManipulado: createHistorialAccioneDto.IdRegistroManipulado,
        },
        select: {
          IdAccion: true,
          IdRegistroManipulado: true,
          Accion: true,
          TipoRegistro: true,
          FechaEjecucion: true,
        },
      });
      return historiaCreada;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(): Promise<any> {
    try {
      const historias = await this.prisma.historialacciones.findMany({
        select: {
          IdAccion: true,
          IdRegistroManipulado: true,
          Accion: true,
          TipoRegistro: true,
          FechaEjecucion: true,
        },
      });
      return historias;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findOne(id: number) {
    if (id === undefined)
      throw new BadRequestException('El id no puede ser undefined');
    if (id === null) throw new BadRequestException('El id no puede ser null');
    if (isNaN(id)) throw new BadRequestException('El id no es un numero');
    try {
      const historia = this.prisma.historialacciones.findUnique({
        where: {
          IdAccion: id,
        },
      });
      return historia;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async findAllByUserId(id: string): Promise<any> {
    if (id.length === 0)
      throw new BadRequestException('El id del usuario no puede estar vacio');
    if (!(await this.usuarioS.verificarNombreUsuarioExiste(id)))
      throw new BadRequestException('El usuario no existe');
    try {
      const historiasUsuario = await this.prisma.usuario
        .findUnique({
          where: {
            IdUsuario: id,
          },
        })
        .historialacciones();
      return historiasUsuario;
    } catch (error) {}
  }
}
