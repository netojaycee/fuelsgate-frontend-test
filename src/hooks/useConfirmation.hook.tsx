import { useContext } from 'react';
import { ModalContext } from '@/contexts/ModalContext';
import {
  CONFIRMATION_MODAL,
  ConfirmationData,
} from '@/modals/confirmation-modal';

export const useConfirmation = () => {
  const { handleToggle } = useContext(ModalContext);

  const showConfirmation = (options: ConfirmationData) => {
    handleToggle &&
      handleToggle({
        state: true,
        name: CONFIRMATION_MODAL,
        data: options,
      });
  };

  return { showConfirmation };
};
