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
import { CreateAsignaturaDto } from './dto/create-asignatura.dto';
import { UpdateAsignaturaDto } from './dto/update-asignatura.dto';

@Injectable()
export class AsignaturaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usuarioService: UsuarioService,
    private readonly historialAccionesService: HistorialAccionesService,
  ) {}
  async create(
    createAsignaturaDto: CreateAsignaturaDto,
    IdUsuario: string,
    rolUsuario: string,
  ): Promise<any> {
    if (rolUsuario !== usuario_Rol.Master)
      throw new ForbiddenException('No tienes permisos para crear asignaturas');
    if (!(await this.usuarioService.verificarUsuarioExiste(IdUsuario)))
      throw new ForbiddenException('El usuario master no existe');
    try {
      const asignatura = await this.prisma.asignatura.create({
        data: {
          ...createAsignaturaDto,
        },
      });
      const payload: CreateHistorialAccioneDto = {
        Accion: historial_acciones.Creacion,
        TipoRegistro: historial_TipoRegistro.Asignatura,
        IdUsuario: IdUsuario,
        IdRegistroManipulado: asignatura.IdAsignatura,
      };
      const historia = await this.historialAccionesService.create(payload);
      return {
        Asignatura: { ...asignatura },
        Historia: { ...historia },
      };
    } catch (error) {
      throw new InternalServerErrorException(error.messsage);
    }
  }

  async findAll(IdUsuarioMaster: string, rolUsuario: string) {
    if (rolUsuario !== usuario_Rol.Master)
      throw new ForbiddenException('No tienes permisos para ver asignaturas');
    if (!(await this.usuarioService.verificarUsuarioExiste(IdUsuarioMaster)))
      throw new ForbiddenException('El usuario master no existe');
    try {
      const asignaturas = await this.prisma.asignatura.findMany();
      return asignaturas;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  findOne(id: string) {
    if (id === undefined)
      throw new ForbiddenException('El id no puede ser undefined');
    if (id === null) throw new ForbiddenException('El id no puede ser null');
    try {
      const asignatura = this.prisma.asignatura.findUnique({
        where: {
          IdAsignatura: id,
        },
      });
      if (asignatura === null)
        throw new BadRequestException('La asignatura no existe');
      return asignatura;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(
    id: string,
    updateAsignaturaDto: UpdateAsignaturaDto,
    idUsuarioMaster: string,
    rolUsuario: string,
  ) {
    if (rolUsuario !== usuario_Rol.Master)
      throw new ForbiddenException(
        'No tienes permisos para modificar asignaturas',
      );
    if (id === undefined)
      throw new BadRequestException('El id no puede ser undefined');
    if (id === null) throw new BadRequestException('El id no puede ser null');
    try {
      const asignaturaActualizada = await this.prisma.asignatura.update({
        where: {
          IdAsignatura: id,
        },
        data: {
          ...updateAsignaturaDto,
          Version: {
            increment: 1,
          },
          FechaModificacion: new Date(),
        },
        select: {
          IdAsignatura: true,
          Nombre: true,
          IdCurso: true,
          IdProfesor: true,
          curso: false,
          profesor: false,
          asignacion: false,
          asistencia: false,
          Descripcion: true,
          estaActivo: true,
        },
      });
      const payload: CreateHistorialAccioneDto = {
        Accion: historial_acciones.Modificacion,
        TipoRegistro: historial_TipoRegistro.Asignatura,
        IdUsuario: idUsuarioMaster,
        IdRegistroManipulado: id,
      };
      const historia = await this.historialAccionesService.create(payload);
      return {
        Asignatura: { ...asignaturaActualizada },
        Historia: { ...historia },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  remove(id: string, idUsuarioMaster: string, rol: string) {
    if (rol !== usuario_Rol.Master)
      throw new ForbiddenException(
        'No tienes permisos para eliminar asignaturas',
      );
    if (id === undefined)
      throw new BadRequestException('El id no puede ser undefined');
    if (id === null) throw new BadRequestException('El id no puede ser null');
    try {
      const asignaturaEliminada = this.prisma.asignatura.delete({
        where: {
          IdAsignatura: id,
        },
        include: {
          asignacion: true,
          asistencia: true,
          curso: true,
        },
      });
      const payload: CreateHistorialAccioneDto = {
        Accion: historial_acciones.Eliminacion,
        TipoRegistro: historial_TipoRegistro.Asignatura,
        IdUsuario: idUsuarioMaster,
        IdRegistroManipulado: id,
      };
      const historia = this.historialAccionesService.create(payload);
      return {
        Asignatura: { ...asignaturaEliminada },
        Historia: { ...historia },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
