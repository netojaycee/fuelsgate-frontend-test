import React, { useContext } from 'react';
import { cn } from '@/lib/utils';
import { Sora } from 'next/font/google';
import { Text } from '@/components/atoms/text';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import CustomButton from '@/components/atoms/custom-button';
import { ModalContext } from '@/contexts/ModalContext';
import { AlertTriangle } from 'lucide-react';

const sora = Sora({ subsets: ['latin'] });
const CONFIRMATION_MODAL = 'confirmation_modal';

type ConfirmationData = {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: 'danger' | 'primary';
};

const ConfirmationModal = () => {
  const { handleClose, openModal } = useContext(ModalContext);

  const data = openModal?.data as ConfirmationData;
  const {
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Yes',
    cancelText = 'No',
    onConfirm,
    onCancel,
    variant = 'primary',
  } = data || {};

  const handleConfirm = () => {
    onConfirm?.();
    handleClose && handleClose();
  };

  const handleCancel = () => {
    onCancel?.();
    handleClose && handleClose();
  };

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle
            className={cn(
              'h-6 w-6',
              variant === 'danger' ? 'text-red-tone-600' : 'text-blue-tone-200',
            )}
          />
          <DialogTitle
            className={cn(
              'leading-5 font-semibold text-xl',
              sora.className,
              variant === 'danger' ? 'text-red-tone-600' : 'text-blue-tone-200',
            )}
          >
            {title}
          </DialogTitle>
        </div>
      </DialogHeader>

      <div className="py-4">
        <DialogDescription className="text-dark-gray-400 text-sm mb-8">
          {message}
        </DialogDescription>

        <div className="flex items-center gap-3 justify-end">
          <CustomButton
            variant="white"
            label={cancelText}
            onClick={handleCancel}
            border="border-gray-300 border"
            color="text-dark-gray-400"
          />
          <CustomButton
            variant={variant === 'danger' ? 'primary' : 'primary'}
            label={confirmText}
            onClick={handleConfirm}
            classNames={cn(
              variant === 'danger' && 'bg-red-tone-600 hover:bg-red-tone-700',
            )}
          />
        </div>
      </div>
    </>
  );
};

export { ConfirmationModal, CONFIRMATION_MODAL };
export type { ConfirmationData };
