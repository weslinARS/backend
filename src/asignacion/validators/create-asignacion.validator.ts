import * as z from 'zod';

export const createAsignacionValidator = z.object({
  IdAsignatura: z
    .string({
      required_error: 'Id de asignatura requerido',
    })
    .uuid({
      message: 'formato de Id de asignatura no valido',
    }),
  PonderacionMaxima: z
    .number({
      required_error: 'Ponderacion maxima no valida',
    })
    .int({
      message: 'Ponderacion maxima no valida',
    })
    .min(0, {
      message: 'La ponderacion maxima debe ser mayor a 0',
    }),
  NombreAsignacion: z
    .string({
      required_error: 'Nombre de asignacion no valido',
    })
    .min(1)
    .max(255),
  TipoAsignacion: z.enum(
    [
      'Presentacion',
      'Otro',
      'Trabajo Grupal',
      'Trabajo Individual',
      'Examen Parcial',
      'Prueba en Linea',
      'Prueba Escrita',
      'Proyecto',
    ],
    {
      required_error: 'Tipo de asignacion no valido',
    },
  ),
  FechaAsignacion: z
    .string({
      required_error: 'Fecha de asignacion no valida',
    })
    .datetime(),
  FechaEntrega: z
    .string({
      required_error: 'Fecha de entrega no valida',
    })
    .datetime(),
});
