import { z } from 'zod'

export const registerSchema = z
  .object({
    firstName: z.string().min(1, 'Requerido'),
    lastName1: z.string().min(1, 'Requerido'),
    lastName2: z.string().optional(),
    email: z.string().min(1, 'Requerido').email('Email inválido'),
    phone: z
      .string()
      .min(1, 'Requerido')
      .regex(/^\+?\d{9,15}$/, 'Teléfono inválido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string().min(1, 'Requerido'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

export type RegisterFormValues = z.infer<typeof registerSchema>
