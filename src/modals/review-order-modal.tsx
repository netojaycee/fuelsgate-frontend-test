import CustomInput from '@/components/atoms/custom-input';
import CustomLoader from '@/components/atoms/custom-loader';
import { Text } from '@/components/atoms/text';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ModalContext } from '@/contexts/ModalContext';
import OrderStatus from '@/features/seller-dashboard/components/order-status';
import useOrderHook from '@/hooks/useOrder.hook';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/utils/formatNumber';
import { Sora } from 'next/font/google';
import React, { useContext, useState } from 'react';

const sora = Sora({ subsets: ['latin'] });

const REVIEW_ORDER = 'review-order';

const ReviewOrderModal = () => {
  const { openModal } = useContext(ModalContext);
  const { useGetOrderDetails } = useOrderHook();
  const { data, isLoading } = useGetOrderDetails(openModal?.data?.orderId);
  const [expiresIn, setExpiresIn] = useState<number>(0);

  return (
    <>
      <DialogHeader>
        <DialogTitle
          className={cn(
            'leading-5 text-blue-tone-200 font-semibold text-2xl',
            sora.className,
          )}
        >
          Review Order
        </DialogTitle>
        <DialogDescription />
      </DialogHeader>
      {isLoading ? (
        <CustomLoader />
      ) : (
        <div>
          <div className="bg-light-gray-150 rounded-[10px] p-3 mb-3">
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center justify-between gap-2 mb-4">
                <Text
                  variant="pm"
                  color="text-dark-gray-550"
                  fontWeight="semibold"
                >
                  Order Details
                </Text>
                <span
                  className={cn(
                    'inline-flex items-center justify-center h-[17px] w-10 text-xs font-medium rounded-sm uppercase text-white',
                    data.data.productId?.color,
                  )}
                >
                  {data.data.productId?.value}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <Text
                  variant="ps"
                  color="text-dark-gray-550"
                  fontWeight="regular"
                >
                  <span className="uppercase">
                    {data.data.productId?.value}
                  </span>{' '}
                  Volume
                </Text>
                <Text
                  variant="ps"
                  color="text-dark-gray-550"
                  fontWeight="medium"
                >
                  {formatNumber(data.data.volume)} Ltr
                </Text>
              </div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <Text
                  variant="ps"
                  color="text-dark-gray-550"
                  fontWeight="regular"
                >
                  Price Per Litre
                </Text>
                <Text
                  variant="ps"
                  color="text-dark-gray-550"
                  fontWeight="medium"
                >
                  ₦{formatNumber(data.data.price, true)}/Ltr
                </Text>
              </div>

              <div className="flex items-center justify-between gap-2 bg-light-gray-200 p-2 rounded-[4px]">
                <Text
                  variant="ps"
                  color="text-dark-gray-550"
                  fontWeight="regular"
                >
                  Total (x {formatNumber(data.data.volume)})
                </Text>
                <Text variant="ps" color="text-dark-gray-550" fontWeight="bold">
                  ₦{formatNumber(data.data.volume * data.data.price, true)}
                </Text>
              </div>

              {data.data.status === 'awaiting-approval' && (
                <div className="mt-3">
                  <CustomInput
                    type="number"
                    name="expiresIn"
                    label="When would this order expire?(hours)"
                    placeholder="Enter expiry time"
                    value={expiresIn}
                    onChange={(value) =>
                      setExpiresIn(parseInt(value.target.value))
                    }
                  />
                </div>
              )}
            </div>
          </div>
          <OrderStatus
            orderId={data.data._id}
            expiresIn={expiresIn}
            orderStatus={data.data.status}
          />
        </div>
      )}
    </>
  );
};

export { ReviewOrderModal, REVIEW_ORDER };
