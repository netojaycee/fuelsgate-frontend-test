import React from 'react'
import { Text } from '@/components/atoms/text'
import ForgotPasswordForm from '@/features/authentication/components/forgot-password-form'
import { Heading } from '@/components/atoms/heading'

const ForgotPassword = () => {
  return (
    <div className='relative w-full max-w-[454px] m-auto'>
      <Heading variant='h2' lineHeight='leading-[43px]' fontWeight='semibold' classNames='mb-2'>Forgot Password</Heading>
      <Text variant='pl' classNames='mb-7' color='text-deep-gray-100'>Please enter the registered email address to receive the reset link</Text>
      <ForgotPasswordForm />
    </div>
  )
}

export default ForgotPassword