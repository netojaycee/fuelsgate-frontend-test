'use client'
import React, { useMemo } from 'react'
import useAuthenticationHook from '../hooks/useAuthentication.hooks'
import useToastConfig from '@/hooks/useToastConfig.hook'
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation'
import { ResetPasswordDto } from '../types/authentication.types'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { resetPasswordSchema } from '../validations/validations'
import { renderErrors } from '@/utils/renderErrors'
import CustomInput from '@/components/atoms/custom-input';
import CustomButton from '@/components/atoms/custom-button';

const ResetPasswordForm = () => {
  const router = useRouter()
  const { showToast } = useToastConfig();
  const { useResetPassword } = useAuthenticationHook()
  const { mutateAsync: resetPassword, isPending } = useResetPassword;
  
  const email = useMemo(() => {
    const _email = Cookies.get('email');

    if (!_email) {
      showToast('An unexpected error occurred. Please retry', 'error');
      router.push('forgot-password');
    }

    return _email
  }, [router, showToast])

  const { 
    setError,
    register,
    formState: { errors },
    handleSubmit
   } = useForm<ResetPasswordDto>({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      email,
    }
  });

  const onSubmit = async (data: ResetPasswordDto) => {
    try {
      await resetPassword(data); 
    } catch (error: any) {
      renderErrors(error?.errors, setError);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomInput type='password' label='Password' name='password' error={errors.password?.message} register={register} classNames='mb-8' />
      <CustomInput type='password' label='Confirm Password' name='confirmPassword' error={errors.confirmPassword?.message} register={register} classNames='mb-8' />
      <CustomButton variant="primary" type='submit' loading={isPending} label='Save Password' />
    </form>
  )
}

export default ResetPasswordForm