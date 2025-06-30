import CustomButton from '@/components/atoms/custom-button'
import CustomCheckbox from '@/components/atoms/custom-checkbox'
import CustomInput from '@/components/atoms/custom-input'
import { Heading } from "@/components/atoms/heading";
import { Text } from '@/components/atoms/text'
import ResetPasswordForm from '@/features/authentication/components/reset-password-form'
import React from 'react'

const ResetPassword = () => {
  return (
    <div className='relative w-full max-w-[454px] m-auto'>
      <Heading variant='h2' lineHeight='leading-[43px]' fontWeight='semibold' classNames='mb-2'>Reset Password</Heading>
      <Text variant='pl' classNames='mb-7' color='text-deep-gray-100'>Please enter a new strong and memorable password.</Text>
      
      <ResetPasswordForm />
    </div>
  )
}

export default ResetPassword