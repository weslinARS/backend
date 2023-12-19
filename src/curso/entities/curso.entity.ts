export class Curso {
  IdCurso: string;
  IdProfesorGuia: string;
  NombreCurso: string;
  DescripcionCurso: string;
  /**
   *
   */
  constructor(
    IdCurso: string,
    IdProfesorGuia: string,
    NombreCurso: string,
    DescripcionCurso: string,
  ) {
    this.IdCurso = IdCurso;
    this.IdProfesorGuia = IdProfesorGuia;
    this.NombreCurso = NombreCurso;
    this.DescripcionCurso = DescripcionCurso;
  }
}
