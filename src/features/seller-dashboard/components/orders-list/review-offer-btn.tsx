import React, { useContext } from 'react';
import { FGEyeFill } from '@fg-icons';
import CustomButton from '@/components/atoms/custom-button';
import { ModalContext } from '@/contexts/ModalContext';
import { REVIEW_ORDER } from '@/modals/review-order-modal';
import { OrderStatus } from '@/types/order.types';
import { Check } from 'lucide-react';
import Link from 'next/link';

const ReviewOfferBtn: React.FC<{
  orderId: string;
  orderStatus: OrderStatus;
}> = ({ orderId, orderStatus }) => {
  const { handleToggle } = useContext(ModalContext);
  const toggleReviewModal = () =>
    handleToggle &&
    handleToggle({
      state: true,
      name: REVIEW_ORDER,
      data: { orderId, orderStatus },
    });

  return orderStatus === 'awaiting-approval' ||
    orderStatus === 'in-progress' ? (
    <CustomButton
      variant="white"
      classNames="gap-1.5"
      label={
        orderStatus === 'awaiting-approval'
          ? 'Review Offer'
          : orderStatus === 'in-progress'
          ? 'Complete Order'
          : ''
      }
      leftIcon={
        orderStatus === 'awaiting-approval' ? (
          <FGEyeFill
            className="shrink-0"
            height={18}
            width={18}
            color="#666666"
          />
        ) : orderStatus === 'in-progress' ? (
          <Check height={18} width={18} className="shrink-0" />
        ) : undefined
      }
      height="h-[38px]"
      border="border-mid-gray-400 border"
      color="text-dark-gray-400"
      fontSize="text-xs"
      fontWeight="medium"
      width="w-[145px]"
      onClick={toggleReviewModal}
    />
  ) : orderStatus === 'completed' ? (
    <Link
      href={`/dashboard/ticket/${orderId}`}
      className="text-sm font-medium text-dark-100 bg-slate-100 rounded-md px-2 py-1"
    >
      Print ticket
    </Link>
  ) : null;
};

export { ReviewOfferBtn };
