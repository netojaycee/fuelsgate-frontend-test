import React, { useContext } from 'react'
import { LIST_TRUCK } from '@/modals/list-truck-modal'
import { Text } from '@/components/atoms/text'
import CustomButton from '@/components/atoms/custom-button'
import { Plus } from 'lucide-react'
import { ModalContext } from '@/contexts/ModalContext'

const Header = () => {
  const { handleToggle } = useContext(ModalContext)

  const openListTruckModal = () => handleToggle && handleToggle({ name: LIST_TRUCK, data: {}, state: true })

  return (
    <div className="flex items-center flex-wrap justify-between gap-2 py-4">
      <Text variant='pl' color='text-dark-gray-500' fontWeight='medium'>Available Trucks</Text>
      <CustomButton variant='primary' label='List Truck' width='w-fit' height='h-11' fontSize='text-sm' leftIcon={<Plus height={24} width={24} />} classNames='gap-1 rounded-lg p-2' onClick={openListTruckModal} />
    </div>
  )
}

export { Header }