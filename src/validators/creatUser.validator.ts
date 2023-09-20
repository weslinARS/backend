import * as z from 'zod';
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
export const CreateUserValidator = z.object({
  userName: z
    .string({
      required_error: 'El nombre es requerido',
    })
    .trim()
    .min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
  userLastName: z
    .string({
      required_error: 'El apellido es requerido',
    })
    .trim()
    .min(3, { message: 'El apellido debe tener al menos 3 caracteres' }),
  userEmail: z.string().trim().email({ message: 'Correo no valido' }),
  userPassword: z
    .string({
      required_error: 'La contraseña es requerida',
    })
    .trim()
    .min(8, { message: 'la constraseña debe tener al menos 8 caracteres' })
    .regex(strongPasswordRegex, {
      message:
        'La contraseña debe tener al menos una mayuscula, una minuscula, un numero y un caracter especial',
    }),
  userAge: z
    .number({
      required_error: 'La edad es requerida',
    })
    .min(18, { message: 'Debes ser mayor de edad' }),
});
