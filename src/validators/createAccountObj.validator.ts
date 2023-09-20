import * as z from 'zod';
export const CreateAccountObjValidator = z.object({
  accountName: z
    .string({
      required_error: 'el nombre de la cuenta es requerido',
    })
    .trim()
    .min(8, {
      message: 'el nombre de la cuenta debe tener al menos 8 caracteres',
    }),
  accountType: z
    .string({
      required_error: 'el tipo de cuenta es requerido',
    })
    .trim(),
  accountBalance: z.number().positive().optional(),
  accountCurrency: z.string().trim().optional(),
  IncludedInBalance: z.boolean().optional(),
  accountCutOffDate: z
    .number()
    .positive({ message: 'la fecha de corte debe ser un numero positivo' })
    .int({ message: 'la fecha de corte debe ser un numero entero ' })
    .max(31, { message: 'la fecha de corte debe ser menor a 31' })
    .min(1, { message: 'la fecha de corte debe ser mayor a 0' })
    .optional(),
  accountDeadlineDate: z
    .number()
    .positive({ message: 'la fecha de pago debe ser un numero positivo' })
    .int({ message: 'la fecha de pago debe ser un numero entero ' })
    .max(31, { message: 'la fecha de pago debe ser menor a 31' })
    .min(1, { message: 'la fecha de pago debe ser mayor a 0' })
    .optional(),
  accountLimit: z
    .number()
    .positive({ message: 'el limite de la cuenta debe ser un numero positivo' })
    .optional(),
});
