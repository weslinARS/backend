import * as z from 'zod';
export const ExpenseObValidator = z.object({
  accountName: z
    .string({
      required_error: 'El Nombre de la cuenta es requerido',
    })
    .trim(),
  expenseAmount: z
    .number({
      required_error: 'El Monto es requerido',
    })
    .positive({ message: 'El monto debe de ser un numero positivo' }),
  expenseCategory: z
    .string({
      required_error: 'La categoria es requerida',
    })
    .trim(),
  expenseCurrency: z
    .string({
      required_error: 'La moneda es requerida',
    })
    .trim(),
  expenseDate: z
    .string({
      required_error: 'La fecha es requerida',
    })
    .trim(),
  expenseDescription: z
    .string({
      required_error: 'La descripcion es requerida',
    })
    .trim(),
});
