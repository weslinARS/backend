import { historial_TipoRegistro, historial_acciones } from '@prisma/client';
export class CreateHistorialAccioneDto {
  IdUsuario: string;
  Accion: historial_acciones;
  IdRegistroManipulado?: string;
  TipoRegistro: historial_TipoRegistro;
}
