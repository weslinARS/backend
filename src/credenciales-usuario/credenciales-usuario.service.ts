import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { usuario_Rol } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCredencialesUsuarioDto } from './dto/create-credenciales-usuario.dto';
import { CreateUsuarioDto } from './dto/create-usuario-dto';
import { Estudiante, Profesor, Usuario } from './dto/usuario-loggeado.dto';
@Injectable()
export class CredencialesUsuarioService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}
  async logIn(credencialesIn: CreateCredencialesUsuarioDto): Promise<any> {
    console.log(credencialesIn);
    //verificar si el usuario existe
    if (!(await this.checkIfUserExists(credencialesIn.correoUsuario)))
      throw new BadRequestException('El usuario no existe');
    const usuarioCred = await this.prisma.credenciales.findFirst({
      where: {
        CorreoUsuario: credencialesIn.correoUsuario,
      },
    });
    if (usuarioCred == null)
      throw new BadRequestException('El usuario no existe');
    const esvalidaContrasenia = await bcrypt.compare(
      credencialesIn.constraseniaUsuario,
      usuarioCred.ContraseniaUsuario,
    );
    if (!esvalidaContrasenia)
      throw new BadRequestException('La contraseña no es valida');
    // obtener el usuario
    const usuarioInfo = await this.prisma.usuario.findUnique({
      where: {
        IdUsuario: usuarioCred.IdUsuario,
      },
    });
    if (!usuarioInfo)
      throw new BadRequestException('La informacion del usuario no existe');
    //obtener la informacion del usuario segun su rol
    if (usuarioInfo.Rol === usuario_Rol.Master) {
      //envia la informacion del usuario
      const token = this.jwt.sign({
        username: usuarioInfo.CorreoElectronico,
        idUsuario: usuarioInfo.IdUsuario,
        rol: usuarioInfo.Rol,
      });
      return new Usuario(usuarioInfo, token);
    } else if (usuarioInfo.Rol === usuario_Rol.Estudiante) {
      //busca la informacion del estudiante y la envia
      const estudianteInfo = await this.prisma.estudiante.findUnique({
        where: {
          IdUsuario: usuarioInfo.IdUsuario,
        },
        select: {
          IdCurso: true,
          IdEstudiante: true,
          IdUsuario: true,
        },
      });
      if (!estudianteInfo)
        throw new BadRequestException(
          'La informacion del estudiante no existe',
        );
      //obtener token
      const payload = {
        username: usuarioInfo.CorreoElectronico,
        idUsuario: usuarioInfo.IdUsuario,
        idSegunRol: estudianteInfo.IdEstudiante,
        rol: usuarioInfo.Rol,
      };
      const token = this.jwt.sign(payload);
      const infoCompleta: Estudiante = new Estudiante(
        usuarioInfo,
        estudianteInfo,
        token,
      );
      return infoCompleta;
    } else if ((usuarioInfo.Rol = usuario_Rol.Profesor)) {
      //busca la informacion del profesor y la envia
      const profesorInfo = await this.prisma.profesor.findUnique({
        where: {
          IdUsuario: usuarioInfo.IdUsuario,
        },
      });
      if (!profesorInfo)
        throw new BadRequestException('La informacion del profesor no existe');
      const payload = {
        username: usuarioInfo.CorreoElectronico,
        idUsuario: usuarioInfo.IdUsuario,
        idSegunRol: profesorInfo.IdProfesor,
        rol: usuarioInfo.Rol,
      };
      const token = this.jwt.sign(payload);
      const infoCompleta: Profesor = new Profesor(
        usuarioInfo,
        profesorInfo,
        token,
      );
      return infoCompleta;
      //obtener token
    } else {
      throw new BadRequestException('El rol no es valido');
    }
  }
  async signUp(usuarioInfo: CreateUsuarioDto) {
    if (!(await this.checkIfUserExists(usuarioInfo.CorreoElectronico))) {
      const fechaMysql = new Date(usuarioInfo.FechaNacimiento).toISOString();
      // !if user does not exist, create user
      // generate salts
      const salt = await bcrypt.genSalt(10);
      try {
        //hash password
        const hashedPassWord = await bcrypt.hash(
          usuarioInfo.contraseniaUsuario,
          salt,
        );
        //!create userCredentials
        const userCreated = await this.prisma.usuario.create({
          data: {
            CorreoElectronico: usuarioInfo.CorreoElectronico,
            NombreUsuario: usuarioInfo.NombreUsuario,
            Apellido: usuarioInfo.Apellido,
            Rol: usuarioInfo.Rol,
            genero: usuarioInfo.genero,
            FechaNacimiento: fechaMysql,
            Edad: usuarioInfo.Edad,
            credenciales: {
              create: {
                CorreoUsuario: usuarioInfo.CorreoElectronico,
                ContraseniaUsuario: hashedPassWord,
              },
            },
          },
        });
        if (userCreated.Rol == usuario_Rol.Master) return userCreated;
        if (userCreated.Rol === usuario_Rol.Estudiante) {
          // !create student
          const estudianteCreado = await this.prisma.estudiante.create({
            data: {
              IdUsuario: userCreated.IdUsuario,
              IdCurso: usuarioInfo.IdCurso,
            },
          });
          return { estudianteCreado, userCreated };
        } else if (userCreated.Rol === usuario_Rol.Profesor) {
          // !create teacher
          const profesorCreado = await this.prisma.profesor.create({
            data: {
              IdUsuario: userCreated.IdUsuario,
              CedulaIdentidad: usuarioInfo.CedulaIdentidad,
            },
          });
          return { userCreated, profesorCreado };
        }
        return userCreated;
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  /**
   * function to check if user exists
   * @param userEmail email to check if exists
   * @returns true if exists, false if not
   */
  private async checkIfUserExists(userEmail: string) {
    const userEmailExist = await this.prisma.usuario.findFirst({
      where: { CorreoElectronico: userEmail },
    });
    return userEmailExist;
  }
}
