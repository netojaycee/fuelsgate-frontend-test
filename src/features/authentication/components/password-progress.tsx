'use client'
import React from 'react'
import clsx from 'clsx'
import { Text } from '@/components/atoms/text'
import { Heading } from "@/components/atoms/heading";
import { Check } from 'lucide-react'
import { usePathname } from 'next/navigation'


type TabProps = {
  index: number, 
  title: string, 
  description: string, 
  active: boolean,
  done: boolean
}

const Tab = ({ index, title, description, active, done }: TabProps) => {
  return (
    <div className="flex items-center gap-3 ml-[-23px] mb-12 last:mb-0">
      <div className={clsx("h-[46px] w-[46px] rounded-[9px] flex items-center justify-center text-white", active ? 'bg-gold' : 'bg-dark-200 border border-dashed border-[#FFFFFF4D]')}>
      {done ? <Check className='text-gold' /> : <Text variant='pl' color='white' fontWeight='semibold' lineHeight='leading-[18px]'>{index}</Text>}
      </div>

      <div>
        <Heading variant='h6' color='text-white' fontWeight='semibold' lineHeight='leading-[20px]' classNames='mb-2'>{title}</Heading>
        <Text variant='pxs' color='text-white' lineHeight='leading-[14px]' classNames='opacity-50'>{description}</Text>
      </div>
    </div>
  )
}

const PasswordProgress = () => {
  const pathname = usePathname()

  return (
    <div className='border-l border-[#FFFFFF4D] border-dashed'>
      <Tab active={pathname === '/forgot-password'} done={pathname === '/verify-otp' || pathname === '/reset-password'} title="Submit Email" description='Select your account type' index={1} />
      <Tab active={pathname === '/verify-otp'} done={pathname === '/reset-password'} title="Reset Code" description='Setup your account settings' index={2} />
      <Tab active={pathname === '/reset-password'} done={false} title="Update Password" description='Setup your business details' index={3} />
    </div>
  )
}

export default PasswordProgress