import { z } from 'zod';
export const UserCredentialValidator = z
  .object({
    userEmail: z
      .string({
        required_error: 'El correo es requerido',
      })
      .trim()
      .email({ message: 'Correo no valido' }),
    userPassword: z
      .string({
        required_error: 'La contraseña es requerida',
      })
      .trim()
      .min(8, { message: 'la constraseña debe tener al menos 8 caracteres' }),
  })
  .required();

export type UserCredentialsDto = z.infer<typeof UserCredentialValidator>;
