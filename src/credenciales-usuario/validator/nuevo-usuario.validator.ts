import * as z from 'zod';

export const nuevoUsuarioValidator = z.object({
  CedulaIdentidad: z.string().trim().optional(),
  IdCurso: z.string().trim().optional(),
  NombreUsuario: z
    .string({ required_error: 'El nombre es requerido' })
    .trim()
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
  Apellido: z
    .string({ required_error: 'El apellido es requerido' })
    .trim()
    .min(3, { message: 'El apellido debe tener al menos 3 caracteres' }),
  Rol: z.enum(['Estudiante', 'Profesor', 'Master'], {
    required_error: 'El rol es requerido',
  }),
  CorreoElectronico: z
    .string({
      required_error: 'El correo es requerido',
    })
    .trim()
    .email({ message: 'Correo no valido' }),
  contraseniaUsuario: z
    .string({
      required_error: 'La contraseña es requerida',
    })
    .trim()
    .min(8, { message: 'la constraseña debe tener al menos 8 caracteres' }),
  FechaNacimiento: z.string({ required_error: 'La fecha es requerida' }).trim(),
  genero: z.enum(['Masculino', 'Femenino'], {
    required_error: 'El genero es requerido',
  }),
  Edad: z.number().optional(),
});
