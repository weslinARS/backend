import { usuario_Rol, usuario_genero } from '@prisma/client';
export class CreateUsuarioDto {
  CedulaIdentidad?: string;
  IdCurso?: string;
  NombreUsuario: string;
  Apellido: string;
  Rol: usuario_Rol;
  CorreoElectronico: string;
  contraseniaUsuario: string;
  FechaNacimiento: string;
  genero: usuario_genero;
  Edad?: number;
}
