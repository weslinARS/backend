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
import { CreateHistorialAccioneDto } from 'src/historial-acciones/dto/create-historial-accione.dto';
import { HistorialAccionesService } from 'src/historial-acciones/historial-acciones.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursoService {
  constructor(
    private prisma: PrismaService,
    private historialService: HistorialAccionesService,
    private usuarioService: UsuarioService,
  ) {}
  async create(
    createCursoDto: CreateCursoDto,
    idUsuarioMaster: string,
    rolUsuario: string,
  ) {
    console.debug('createCursoDto', createCursoDto);
    if (rolUsuario !== usuario_Rol.Master)
      throw new ForbiddenException('No tiene permisos para crear un curso');
    if (await this.verificarNombreCursoExiste(createCursoDto.NombreCurso))
      throw new BadRequestException('El nombre del curso ya existe');
    console.debug('El nombre del curso no existe');
    try {
      const cursoCreado = await this.prisma.curso.create({
        data: {
          NombreCurso: createCursoDto.NombreCurso,
          DescripcionCurso: createCursoDto.DescripcionCurso,
          IdProfesorGuia: createCursoDto.IdProfesorGuia,
        },
      });
      //crear historia
      const payload: CreateHistorialAccioneDto = {
        Accion: historial_acciones.Creacion,
        TipoRegistro: historial_TipoRegistro.Curso,
        IdUsuario: idUsuarioMaster,
        IdRegistroManipulado: cursoCreado.IdCurso,
      };
      const historia = await this.historialService.create(payload);
      return {
        Curso: { ...cursoCreado },
        Historia: { ...historia },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findAll() {
    try {
      const cursos = await this.prisma.curso.findMany();
      return cursos;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findOne(id: number) {
    return `This action returns a #${id} curso`;
  }

  async update(
    id: string,
    updateCursoDto: UpdateCursoDto,
    idUsuarioMaster: string,
    rolUsuario: string,
  ) {
    if (rolUsuario !== usuario_Rol.Master)
      throw new ForbiddenException('No tiene permisos para modificar un curso');
    if (!(await this.usuarioService.verificarUsuarioExiste(idUsuarioMaster)))
      throw new BadRequestException('El usuario no existe');
    try {
      if (await this.verificarNombreCursoExiste(updateCursoDto.NombreCurso)) {
        const cursoActualizado = await this.prisma.curso.update({
          where: {
            IdCurso: id,
          },
          data: {
            ...updateCursoDto,
            Version: {
              increment: 1,
            },
            FechaMod: new Date(),
          },
        });
        const payload: CreateHistorialAccioneDto = {
          Accion: historial_acciones.Modificacion,
          TipoRegistro: historial_TipoRegistro.Curso,
          IdUsuario: idUsuarioMaster,
          IdRegistroManipulado: id,
        };
        const historia = await this.historialService.create(payload);
        return {
          Curso: { ...cursoActualizado },
          Historia: { ...historia },
        };
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async remove(id: string, idUsuarioMaster: string, rolUsuario: string) {
    if (rolUsuario !== usuario_Rol.Master)
      throw new ForbiddenException('No tiene permisos para eliminar un curso');
    if (await this.verificarCursoExiste(id)) {
      try {
        console.debug('El curso existe');
        console.debug('id', id);
        const cursoEliminado = await this.prisma.curso.delete({
          where: {
            IdCurso: id,
          },
          select: {
            IdCurso: true,
            NombreCurso: true,
            DescripcionCurso: true,
            IdProfesorGuia: true,
            asignatura: {
              include: {
                asignacion: {
                  include: {
                    calificacion: true,
                  },
                },
                asistencia: true,
              },
            },
          },
        });
        const payload: CreateHistorialAccioneDto = {
          Accion: historial_acciones.Eliminacion,
          TipoRegistro: historial_TipoRegistro.Curso,
          IdUsuario: idUsuarioMaster,
          IdRegistroManipulado: id,
        };
        const historia = await this.historialService.create(payload);
        return { Curso: { ...cursoEliminado }, Historia: { ...historia } };
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async verificarCursoExiste(idCurso: string) {
    const curso = await this.prisma.curso.findUnique({
      where: {
        IdCurso: idCurso,
      },
    });
    if (!curso) throw new BadRequestException('El curso no existe');
    return curso;
  }
  /**
   * Verifica si el nombre del curso existe
   * @param nombreCurso nombre del curso a verificar
   * @returns  true si el nombre del curso existe, false si no existe
   */
  async verificarNombreCursoExiste(nombreCurso: string) {
    const curso = await this.prisma.curso.findFirst({
      where: {
        NombreCurso: nombreCurso,
      },
    });
    return curso != null ? true : false;
  }
}
