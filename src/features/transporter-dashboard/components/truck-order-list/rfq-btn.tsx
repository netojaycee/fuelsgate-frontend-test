import React, { useContext } from 'react';
import { FGCheckCircle } from '@fg-icons';
import { TRUCK_RFQ } from '@/modals/rfq-modal';
import { ModalContext } from '@/contexts/ModalContext';
import CustomButton from '@/components/atoms/custom-button';
import {
  TruckOrderRFQStatus,
  TruckOrderStatus,
} from '@/types/truck-order.types';
import useTruckOrderHook from '@/hooks/useTruckOrder.hook';
import { useRouter } from 'next/navigation';

type RfqBtnProps = {
  truckOrderId: string;
  status: TruckOrderStatus;
  rfqStatus: TruckOrderRFQStatus;
};

const RfqBtn = ({ truckOrderId, status, rfqStatus }: RfqBtnProps) => {
  const { handleToggle } = useContext(ModalContext);

  const handleSendRFQButton = () =>
    handleToggle &&
    handleToggle({ state: true, name: TRUCK_RFQ, data: { truckOrderId } });
    const router = useRouter();

  const { useUpdateTruckOrderStatus } = useTruckOrderHook();
  const { mutateAsync: updateOrderStatus, isPending: isUpdating } =
    useUpdateTruckOrderStatus(truckOrderId);

  const handleStartOrder = async () =>
    await updateOrderStatus({
      status: 'in-progress',
    });
  const handleCompleteOrder = async () =>
    await updateOrderStatus({
      status: 'completed',
    });

  const isRfqAccepted = rfqStatus === 'accepted';

  return !isRfqAccepted ? (
    <CustomButton
      variant={
        rfqStatus === 'pending' || rfqStatus === 'rejected'
          ? 'primary'
          : 'white'
      }
      classNames="gap-1.5"
      leftIcon={
        rfqStatus === 'sent' ? (
          <FGCheckCircle width={13} height={13} color="#38C793" />
        ) : undefined
      }
      label={
        rfqStatus === 'pending' || rfqStatus === 'rejected'
          ? 'Send Invoice'
          : 'RFQ Sent'
      }
      height="h-[38px]"
      fontSize="text-xs"
      fontWeight="medium"
      width="w-[122px]"
      onClick={
        rfqStatus === 'pending' || rfqStatus === 'rejected'
          ? handleSendRFQButton
          :  () => {}
      }
    />
  ) : (
    <CustomButton
      variant="white"
      classNames="gap-1.5"
      label={
        status === 'pending'
          ? 'Start Order'
          : status === 'in-progress'
          ? 'Complete Order'
          : 'Print Ticket'
      }
      leftIcon={
        status === 'completed' ? (
          <FGCheckCircle width={13} height={13} color="#38C793" />
        ) : undefined
      }
      height="h-[38px]"
      fontSize="text-xs"
      fontWeight="medium"
      width="w-[122px]"
      loading={isUpdating}
      onClick={
        status === 'pending'
          ? handleStartOrder
          : status === 'in-progress'
          ? handleCompleteOrder
          : () => router.push(`/dashboard/rfq/${truckOrderId}`)
      }
    />
  );
};

export { RfqBtn };
