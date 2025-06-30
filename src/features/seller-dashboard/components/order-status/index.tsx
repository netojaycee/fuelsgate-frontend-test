import CustomButton from '@/components/atoms/custom-button';
import useOrderHook from '@/hooks/useOrder.hook';
import useToastConfig from '@/hooks/useToastConfig.hook';
import { type OrderStatus } from '@/types/order.types';
import { Check, X } from 'lucide-react';
import React from 'react';

type OrderStatusProps = {
  orderId: string;
  orderStatus: OrderStatus;
  expiresIn?: number;
};
const OrderStatus: React.FC<OrderStatusProps> = ({
  orderId,
  orderStatus,
  expiresIn,
}) => {
  const { useUpdateOrderStatus } = useOrderHook();
  const { mutateAsync: updateStatus, isPending: isUpdating } =
    useUpdateOrderStatus(orderId);
  const { showToast } = useToastConfig();

  const handleAcceptClick = async () => {
    if (orderStatus === 'awaiting-approval') {
      if (expiresIn) {
        const currentTime = new Date();
        const expiresInMs = expiresIn * 60 * 60 * 1000;
        const newTime = new Date(currentTime.getTime() + expiresInMs);
        await updateStatus({
          status: 'in-progress',
          expiresIn: newTime.toISOString(),
        });
      } else {
        showToast('Please enter a duration for this order', 'error');
      }
    } else if (orderStatus === 'in-progress') {
      await updateStatus({
        status: 'completed',
      });
    }
  };

  const handleRejectClick = async () => {
    await updateStatus({
      status: 'cancelled',
    });
  };

  return (
    <div className="flex flex-wrap justify-end gap-4 items-center pt-3 border-t border-[#DEE0E566]">
      {orderStatus === 'awaiting-approval' && (
        <CustomButton
          variant="primary"
          bgColor="bg-red-tone-200 hover:bg-red-700"
          label="Cancel"
          leftIcon={<X />}
          fontSize="text-sm"
          classNames="rounded-lg gap-1 px-4 py-[10px]"
          height="h-11"
          width="w-fit"
          onClick={handleRejectClick}
          loading={isUpdating}
        />
      )}
      <CustomButton
        variant="primary"
        bgColor="bg-green-tone-500 hover:bg-green-700"
        label={
          orderStatus === 'awaiting-approval'
            ? 'Process'
            : orderStatus === 'in-progress'
            ? 'Complete'
            : ''
        }
        leftIcon={<Check />}
        fontSize="text-sm"
        classNames="rounded-lg gap-1 px-4 py-[10px]"
        height="h-11"
        width="w-fit"
        onClick={handleAcceptClick}
        loading={isUpdating}
      />
    </div>
  );
};

export default OrderStatus;
