/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  historial_TipoRegistro,
  historial_acciones,
  usuario_Rol,
} from '@prisma/client';
import { CreateCalificacionDto } from 'src/calificacion/dto/create-calificacion.dto';
import { CreateHistorialAccioneDto } from 'src/historial-acciones/dto/create-historial-accione.dto';
import { HistorialAccionesService } from 'src/historial-acciones/historial-acciones.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { CreateAsignacionDto } from './dto/create-asignacion.dto';
import { UpdateAsignacionDto } from './dto/update-asignacion.dto';

@Injectable()
export class AsignacionService {
  constructor(
    private prisma: PrismaService,
    private usuarioService: UsuarioService,
    private historialAccionesService: HistorialAccionesService,
  ) {}
  async create(
    createAsignacionDto: CreateAsignacionDto,
    idUsuario: string,
    rolUsuario: string,
  ) {
    if (
      rolUsuario === usuario_Rol.Profesor ||
      rolUsuario === usuario_Rol.Master
    ) {
      if (!(await this.usuarioService.verificarUsuarioExiste(idUsuario)))
        throw new ForbiddenException('El usuario no existe');
      try {
        // crear asignacion
        await this.prisma.$transaction(async (tx) => {
          const asignacion = await tx.asignacion.create({
            data: {
              ...createAsignacionDto,
            },
          });
          //obtener estudiantes de la asignatura
          const estudiantes = await tx.asignatura.findUnique({
            where: {
              IdAsignatura: createAsignacionDto.IdAsignatura,
            },
            select: {
              curso: {
                select: {
                  estudiante: true,
                },
              },
            },
          });
          // crear asignacion_estudiante
          const calificacionesXDeefecto: CreateCalificacionDto[] =
            estudiantes.curso.estudiante.map((estudiante) => ({
              IdEstudiante: estudiante.IdEstudiante,
              IdAsignacion: asignacion.IdAsignacion,
            }));
          await tx.calificacion.createMany({
            data: calificacionesXDeefecto,
          });
          const payload: CreateHistorialAccioneDto = {
            Accion: historial_acciones.Creacion,
            TipoRegistro: historial_TipoRegistro.Asignacion,
            IdUsuario: idUsuario,
            IdRegistroManipulado: asignacion.IdAsignacion.toString(),
          };
          const historia = await this.historialAccionesService.create(payload);
          return {
            Asignacion: { ...asignacion },
            Historia: { ...historia },
          };
        });
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    } else {
      throw new ForbiddenException(
        'No tienes permisos para crear una asignacion',
      );
    }
  }

  async findAllByAsignatura(
    idUsuario: string,
    rolUsuario: string,
    idAsignatura: string,
  ) {
    if (idAsignatura === undefined)
      throw new ForbiddenException('Id de asignatura no valido');
    try {
      const asignaciones = await this.prisma.asignacion.findMany({
        where: {
          IdAsignatura: idAsignatura,
        },
      });
      return asignaciones;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
    return `This action returns all asignacion`;
  }

  async findOne(id: number, idUsuario: string, rolUsuario: string) {
    try {
      const asignacion = await this.prisma.asignacion.findUnique({
        where: {
          IdAsignacion: id,
        },
        include: {
          asignatura: {
            select: {
              Nombre: true,
            },
          },
        },
      });
      if (!asignacion) throw new BadRequestException('Asignacion no existe');
      return asignacion;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    id: string,
    updateAsignacionDto: UpdateAsignacionDto,
    idUsuario: string,
    rolUsuario: string,
  ) {
    if (
      rolUsuario === usuario_Rol.Profesor ||
      rolUsuario === usuario_Rol.Master
    ) {
      try {
        const asignacion = await this.prisma.asignacion.update({
          where: {
            IdAsignacion: +id,
          },
          data: {
            ...updateAsignacionDto,
            Version: {
              increment: 1,
            },
            FechaMod: {
              set: new Date(),
            },
          },
        });
        const payload: CreateHistorialAccioneDto = {
          Accion: historial_acciones.Modificacion,
          TipoRegistro: historial_TipoRegistro.Asignacion,
          IdUsuario: idUsuario,
          IdRegistroManipulado: asignacion.IdAsignacion.toString(),
        };
        const historia = await this.historialAccionesService.create(payload);
        return {
          Asignacion: { ...asignacion },
          Historia: { ...historia },
        };
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    } else
      throw new ForbiddenException(
        'No tienes permisos para actualizar una asignacion',
      );
  }

  async remove(id: number, idUsuario: string, rolUsuario: string) {
    if (
      rolUsuario === usuario_Rol.Profesor ||
      rolUsuario === usuario_Rol.Master
    ) {
      try {
        const asignacion = await this.prisma.asignacion.delete({
          where: {
            IdAsignacion: id,
          },
        });
        const payload: CreateHistorialAccioneDto = {
          Accion: historial_acciones.Eliminacion,
          TipoRegistro: historial_TipoRegistro.Asignacion,
          IdUsuario: idUsuario,
          IdRegistroManipulado: asignacion.IdAsignacion.toString(),
        };
        const historia = await this.historialAccionesService.create(payload);
        return {
          Asignacion: { ...asignacion },
          Historia: { ...historia },
        };
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    } else
      throw new ForbiddenException(
        'No tienes permisos para eliminar una asignacion',
      );
  }
}
