import { Text } from '@/components/atoms/text'
import React, { useEffect, useState } from 'react'

const RenderEmail = ({ email, error }: { email: string | undefined, error?: string }) => {
  const [isClient, setIsClient] = useState(false)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className='mb-7'>
      <Text variant='pl' classNames='mb-1' color='text-deep-gray-100'>Enter reset code sent to <b>{(isClient && email) ? email: null}</b></Text>
      {error && <Text variant='ps' color='text-red-500' fontWeight='regular' classNames='mt-1'>{error}</Text>}
    </div>
  )
}

export default RenderEmail