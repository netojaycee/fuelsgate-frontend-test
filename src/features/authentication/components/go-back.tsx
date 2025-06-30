'use client'
import React from 'react'
import { CornerUpLeft } from 'lucide-react'
import CustomButton from '@/components/atoms/custom-button'
import { useRouter } from 'next/navigation'

const GoBack = () => {
  const router = useRouter()

  const handleClick = () => {
    router.back()
  }

  return (
    <CustomButton
      type="button"
      width="w-fit"
      label="Go Back"
      variant="plain"
      classNames="p-0"
      height="h-[24px]"
      fontSize="text-sm"
      onClick={handleClick}
      fontWeight="semibold"
      leftIcon={<CornerUpLeft className="h-6 w-6" />}
    />
  )
}

export default GoBack