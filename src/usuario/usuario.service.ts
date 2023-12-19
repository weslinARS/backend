import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}
  create(createUsuarioDto: CreateUsuarioDto) {
    return 'This action adds a new usuario';
  }

  findAll() {
    return `This action returns all usuario`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
  /**
   *  Verifica si el nombre de usuario existe en la base de datos
   * @param idUsuario id del usuario a verificar
   * @returns  true si el usuario existe, false si no existe
   */
  public async verificarNombreUsuarioExiste(idUsuario: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { IdUsuario: idUsuario },
    });
    return usuario !== null;
  }
  /**
   * Verifica si el nombre de usuario existe en la base de datos
   * @param idUsuario id del usuario a verificar
   * @returns  true si el usuario existe, false si no existe
   */
  public async verificarUsuarioExiste(idUsuario: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: {
        IdUsuario: idUsuario,
      },
    });
    return usuario !== null;
  }
}
