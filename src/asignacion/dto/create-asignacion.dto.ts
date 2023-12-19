import { asignacion_TipoAsignacion } from '@prisma/client';

export class CreateAsignacionDto {
  IdAsignatura: string;
  PonderacionMaxima: number;
  NombreAsignacion: string;
  TipoAsignacion: asignacion_TipoAsignacion;
  FechaAsignacion: string;
  FechaEntrega: string;
}
