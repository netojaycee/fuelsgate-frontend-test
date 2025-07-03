'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { RefreshCcw } from 'lucide-react'
import { Text } from '@/components/atoms/text'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { renderErrors } from '@/utils/renderErrors'
import { VerifyOtpDto } from '../types/authentication.types'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import useAuthenticationHook from '../hooks/useAuthentication.hooks'
import { useRouter } from 'next/navigation'
import { verifyOtpSchema } from '../validations/validations'
import Cookies from "js-cookie";
import useToastConfig from '@/hooks/useToastConfig.hook'
import CountdownTimer from './countdown-timer'
import RenderEmail from './render-email'
import CustomButton from '@/components/atoms/custom-button'

const VerifyOtpForm = () => {
  const router = useRouter()
  const [time, setTime] = useState(15 * 60); 
  const { showToast } = useToastConfig();
  const [otp, setOtp] = useState<string>('')
  const { useVerifyOtp, useForgotPassword } = useAuthenticationHook()
  const { mutateAsync: verifyOtp, isPending } = useVerifyOtp;
  const { mutateAsync: forgotPassword, isPending: forgotPasswordLoading } = useForgotPassword;

  const email = useMemo(() => {
    const _email = Cookies.get('email');

    if (!_email) {
      showToast('An unexpected error occurred. Please retry', 'error');
      router.push('forgot-password');
    }

    return _email
  }, [router, showToast]);

  const { 
    setValue,
    setError,
    formState: { errors },
    handleSubmit
   } = useForm<VerifyOtpDto>({
    resolver: yupResolver(verifyOtpSchema),
    defaultValues: {
      email
    }
  });

  const onSubmit = async (data: VerifyOtpDto) => {
    try {
      await verifyOtp(data); 
    } catch (error: any) {
      renderErrors(error?.errors, setError);
    }
  }

  const onResetOtp = async () => {
    try {
      if (email) await forgotPassword({ email }); 
    } catch (error: any) {
      renderErrors(error?.errors, setError);
    } finally {
      setTime(15 * 60)
    }
  }

  const gotoLogin = () => router.push('/login');
  const handleOtpInputChange = (value: string): void => setOtp(value);

  useEffect(() => {
    setValue('otp', otp);
  }, [otp, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RenderEmail email={email} error={errors.email?.message} />

      <div className='mb-7'>
        <InputOTP onChange={handleOtpInputChange} value={otp} maxLength={5}>
          <InputOTPGroup className='w-full justify-between mb-2'>
            {[...Array(5)].map((_, index) => (
              <InputOTPSlot className='h-[60px] w-[60px] border-[1px] rounded-lg text-[26px] text-dark-gray-250' key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
        {errors.otp?.message && <Text variant='ps' color='text-red-500' fontWeight='regular' classNames='mt-1'>{errors.otp?.message}</Text>}
      </div>

      <CustomButton variant="primary" type='submit' label='Reset Password' classNames='mb-8' loading={isPending} />

      <div className='flex items-center justify-between gap-3'>
        <CountdownTimer {...{ time, setTime }} />
        <CustomButton type='button' onClick={onResetOtp} loading={forgotPasswordLoading} variant='white' label='Resend Code' height='h-[33px]' fontSize='text-sm' fontWeight='medium' color="text-blue-tone-300" width='w-[143px]' classNames='gap-1' leftIcon={<RefreshCcw className='h-6 w-4 text-dark-gray-300' />} />
      </div>
      <div className='relative my-7'>
        <hr className='border-mid-gray-50' />
      </div>
      <CustomButton type='button' variant='white' onClick={gotoLogin} label='Remember your password?' classNames='gap-1' rightIcon={<Text variant='pm' color='text-gold' fontWeight='semibold'>Sign In</Text>} /> 
    </form>
  )
}

export default VerifyOtpForm;
