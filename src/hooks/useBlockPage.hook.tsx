import { useEffect } from 'react'

type BlockPageProps = {
  isBlocking: boolean
}

const useBlockPageHook = ({ isBlocking }: BlockPageProps) => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isBlocking) {
        const message = 'Are you sure you want to leave? Changes you made may not be saved.'
        event.preventDefault()
        event.returnValue = message 
        return message 
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [isBlocking])
}

export default useBlockPageHook