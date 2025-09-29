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
import useOrderHook from '@/hooks/useOrder.hook';

type RfqBtnProps = {
  truckOrderId: string;
  status: TruckOrderStatus;
  rfqStatus: TruckOrderRFQStatus;
  negotiationId?: string;
};

const RfqBtn = ({ truckOrderId, status, rfqStatus }: RfqBtnProps) => {
  const { handleToggle } = useContext(ModalContext);
  const { useUpdateOrder } = useOrderHook();
    const { mutateAsync: updateOrder, isPending: isUpdatingOrder } =
      useUpdateOrder(truckOrderId as string);

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

    const handleStatusUpdate = async () => {
      try {
        const credentials = {
          description:
            status === 'in-progress'
              ? 'order_to_completed'
              : status === 'pending'
              ? 'order_to_in_progress'
              : null,
          type: 'truck',
          status:
            status === 'in-progress'
              ? 'completed'
              : status === 'pending'
              ? 'in-progress'
              : null, // Assuming you want to set status to in-progress when accepting
        };
        // console.log(credentials);
        await updateOrder(credentials);
      } catch (error: any) {
        console.error('Error updating RFQ status:', error);
      }
    };

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
      label={rfqStatus === 'pending' ? 'Send Invoice' : undefined}
      height="h-[38px]"
      fontSize="text-xs"
      fontWeight="medium"
      width="w-[122px]"
      onClick={rfqStatus === 'pending' ? handleSendRFQButton : () => {}}
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
          : 'completed'
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
      loading={isUpdatingOrder}
      onClick={
        status === 'pending' || status === 'in-progress'
          ? handleStatusUpdate
          : () => {}
        // : () => router.push(`/dashboard/rfq/${truckOrderId}`)
      }
    />
  );
};

export { RfqBtn };
 