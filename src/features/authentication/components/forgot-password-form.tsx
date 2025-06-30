'use client'
import CustomButton from '@/components/atoms/custom-button'
import CustomInput from '@/components/atoms/custom-input'
import { Text } from '@/components/atoms/text'
import { yupResolver } from '@hookform/resolvers/yup'
import React from 'react'
import { useForm } from 'react-hook-form'
import { ForgotPasswordDto } from '../types/authentication.types'
import { forgotPasswordSchema } from '../validations/validations'
import { renderErrors } from '@/utils/renderErrors'
import useAuthenticationHook from '../hooks/useAuthentication.hooks'
import { useRouter } from 'next/navigation'

const ForgotPasswordForm = () => {
  const { useForgotPassword } = useAuthenticationHook()
  const { mutateAsync: forgotPassword, isPending } = useForgotPassword;
  const router = useRouter()

  const gotoLogin = () => router.push('/login')

  const { 
    register,
    setError,
    formState: { errors },
    handleSubmit
   } = useForm<ForgotPasswordDto>({
    resolver: yupResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordDto) => {
    try {
      await forgotPassword(data); 
    } catch (error: any) {
      renderErrors(error?.errors, setError);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomInput type='email' label='Email Address' name='email' register={register} error={errors.email?.message} classNames='mb-8' />
      <CustomButton variant="primary" type='submit' label='Submit' loading={isPending} />
      <div className='relative my-7'>
        <hr className='border-mid-gray-50' />
      </div>

      <CustomButton type='button' onClick={gotoLogin} variant='white' label='Remember your password?' classNames='gap-1' 
        rightIcon={
          <Text 
            variant='pm'
            color='text-gold'
            fontWeight='semibold'
          >Sign In</Text>}
        />
    </form>
  )
}

export default ForgotPasswordForm