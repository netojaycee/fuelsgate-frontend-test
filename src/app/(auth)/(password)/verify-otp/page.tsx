import React from 'react'
import { Heading } from "@/components/atoms/heading";
import VerifyOtpForm from '@/features/authentication/components/verify-otp-form'

const VerifyOtp = () => {
  return (
    <div className='relative w-full max-w-[454px] m-auto'>
      <Heading variant='h2' lineHeight='leading-[43px]' fontWeight='semibold' classNames='mb-2'>Reset Code Sent</Heading>
      <VerifyOtpForm />
    </div>
  )
}

export default VerifyOtp