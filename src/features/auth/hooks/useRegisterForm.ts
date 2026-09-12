import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema, RegisterFormValues } from '../schemas/register.schema'

/** Wires react-hook-form + zod validation for the register screen and mocks the submit call. */
export function useRegisterForm(onSuccess: () => void) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  })

  const onSubmit = handleSubmit(async () => {
    await new Promise((r) => setTimeout(r, 1400))
    onSuccess()
  })

  return { register, onSubmit, errors, isSubmitting }
}
