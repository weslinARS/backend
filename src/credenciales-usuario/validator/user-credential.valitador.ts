import * as z from 'zod';

export const UserCredentialValidator = z
  .object({
    correoUsuario: z
      .string({
        required_error: 'El correo es requerido',
      })
      .trim()
      .email({ message: 'Correo no valido' }),
    constraseniaUsuario: z
      .string({
        required_error: 'La contraseña es requerida',
      })
      .trim()
      .min(8, { message: 'la constraseña debe tener al menos 8 caracteres' }),
  })
  .required();
