import React, { useContext } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { ModalContext } from '@/contexts/ModalContext'

const ModalRoot = ({ children }: Readonly<{
  children: React.ReactNode;
}>) => {
  const { openModal, handleClose } = useContext(ModalContext)

  return (
    <Dialog open={openModal?.state} onOpenChange={handleClose}>
      <DialogContent className='py-8 max-h-[90vh] max-sm:max-h-screen overflow-y-auto'>
        {children}
      </DialogContent>
    </Dialog>
  )
}

export default ModalRoot