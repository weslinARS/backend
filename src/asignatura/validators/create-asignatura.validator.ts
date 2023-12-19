import * as z from 'zod';

export const CreateAsignaturaValidator = z.object({
  IdCurso: z.string({ required_error: 'El id del curso es requerido' }).trim(),
  IdProfesor: z
    .string({ required_error: 'El id del profesor es requerido' })
    .trim(),
  Nombre: z.string({ required_error: 'El nombre es requerido' }).trim(),
  Descripcion: z
    .string({ required_error: 'La descripcion es requerida' })
    .trim(),
});
