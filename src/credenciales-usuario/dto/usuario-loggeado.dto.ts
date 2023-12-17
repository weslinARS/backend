import { $Enums, estudiante, profesor, usuario } from '@prisma/client';
export class Usuario implements usuario {
  IdUsuario: string;
  NombreUsuario: string;
  Apellido: string;
  Rol: $Enums.usuario_Rol;
  CorreoElectronico: string;
  FechaNacimiento: Date;
  Version: number;
  FechaModificacion: Date;
  genero: $Enums.usuario_genero;
  Edad: number;
  token: string;
  constructor(datosUsuario: usuario, token: string) {
    this.IdUsuario = datosUsuario.IdUsuario;
    this.NombreUsuario = datosUsuario.NombreUsuario;
    this.Apellido = datosUsuario.Apellido;
    this.Rol = datosUsuario.Rol;
    this.CorreoElectronico = datosUsuario.CorreoElectronico;
    this.FechaNacimiento = datosUsuario.FechaNacimiento;
    this.Version = datosUsuario.Version;
    this.FechaModificacion = datosUsuario.FechaModificacion;
    this.genero = datosUsuario.genero;
    this.Edad = datosUsuario.Edad;
    this.token = token;
  }
}
export class Estudiante extends Usuario implements estudiante {
  IdCurso: string;
  IdEstudiante: string;
  constructor(
    datosUsuario: usuario,
    datosEstudiante: estudiante,
    token: string,
  ) {
    super(datosUsuario, token);
    this.IdCurso = datosEstudiante.IdCurso;
    this.IdEstudiante = datosEstudiante.IdEstudiante;
  }
}

export class Profesor extends Usuario implements profesor {
  IdProfesor: string;
  CedulaIdentidad: string;
  constructor(datosUsuario: usuario, datosProfesor: profesor, token: string) {
    super(datosUsuario, token);
    this.IdProfesor = datosProfesor.IdProfesor;
    this.CedulaIdentidad = datosProfesor.CedulaIdentidad;
  }
}
