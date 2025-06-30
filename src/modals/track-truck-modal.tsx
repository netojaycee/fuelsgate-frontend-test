import React, { useContext } from 'react';
import { cn } from '@/lib/utils';
import { Sora } from 'next/font/google';
import { Text } from '@/components/atoms/text';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Heading } from '@/components/atoms/heading';
import { FGCheckCircle } from '@fg-icons';
import { ModalContext } from '@/contexts/ModalContext';
import useTruckOrderHook from '@/hooks/useTruckOrder.hook';
import CustomLoader from '@/components/atoms/custom-loader';
import { formatNumber } from '@/utils/formatNumber';
import { formatOnlyDate, formatOnlyTime } from '@/utils/formatDate';

const sora = Sora({ subsets: ['latin'] });
const TRACK_TRUCK = 'track-truck';

const TrackTruckModal = () => {
  const { openModal } = useContext(ModalContext);
  const { useGetTruckOrderDetails } = useTruckOrderHook();
  const { data, isLoading } = useGetTruckOrderDetails(
    openModal?.data.truckOrderId,
  );

  return (
    <>
      <DialogHeader>
        <DialogTitle
          className={cn(
            'leading-5 text-blue-tone-200 font-semibold text-2xl',
            sora.className,
          )}
        >
          Truck RFQ
        </DialogTitle>
      </DialogHeader>
      <div>
        <DialogDescription className="text-dark-gray-400 text-sm mb-5">
          Details of the billing for this truck request
        </DialogDescription>

        {isLoading ? (
          <CustomLoader />
        ) : (
          <>
            <div className="bg-light-gray-150 py-[10px] px-4 rounded-[10px] mb-3">
              <div className="bg-white p-4 rounded-lg mb-3">
                <Text
                  variant="ps"
                  color="text-dark-gray-550"
                  fontWeight="semibold"
                  classNames="mb-4"
                >
                  Customer Details
                </Text>

                <div className="flex items-center justify-between gap-2 mb-4">
                  <Text variant="ps" color="text-dark-gray-550">
                    Customer name
                  </Text>
                  <Text variant="ps" color="text-[#151A23]" fontWeight="bold">
                    {data.data.buyerId.userId.firstName}{' '}
                    {data.data.buyerId.userId.lastName}
                  </Text>
                </div>

                <div className="flex items-center justify-between gap-2 mb-4">
                  <Text variant="ps" color="text-dark-gray-550">
                    Date/Time
                  </Text>
                  <Text
                    variant="ps"
                    color="text-[#151A23]"
                    fontWeight="medium"
                    classNames="text-right"
                  >
                    {formatOnlyDate(data.data.createdAt)}, <br />
                    <span className="text-[12px] opacity-60">
                      {formatOnlyTime(data.data.createdAt)}
                    </span>
                  </Text>
                </div>

                <div className="flex items-center justify-between gap-2 mb-4">
                  <Text variant="ps" color="text-dark-gray-550">
                    RFQ
                  </Text>
                  <Text
                    variant="pxs"
                    fontWeight="medium"
                    color="text-red-tone-500"
                    classNames="flex items-center gap-1.5 p-1 pr-2 rounded-[6px] border border-mid-gray-400"
                  >
                    {(data.data.rfqStatus === 'sent' ||
                      data.data.rfqStatus === 'accepted') && (
                      <>
                        <FGCheckCircle height={12} width={12} color="#38C793" />
                        {data.data.rfqStatus}
                      </>
                    )}
                  </Text>
                </div>
              </div>
            </div>

            <div className="bg-light-gray-150 py-[10px] px-4 rounded-[10px] mb-3">
              <div className="bg-white p-4 rounded-lg mb-3">
                <Text
                  variant="ps"
                  color="text-dark-gray-550"
                  fontWeight="semibold"
                  classNames="mb-4"
                >
                  Request Details
                </Text>

                <div className="flex items-center justify-between gap-2 mb-4">
                  <Text variant="ps" color="text-dark-gray-550">
                    Truck number
                  </Text>
                  <Text variant="ps" color="text-[#151A23]" fontWeight="bold">
                    {data.data.truckId.truckNumber}
                  </Text>
                </div>

                <div className="flex items-center justify-between gap-2 mb-4">
                  <Text variant="ps" color="text-dark-gray-550">
                    Product
                  </Text>
                  <Text
                    variant="ps"
                    color="text-[#151A23]"
                    fontWeight="medium"
                    classNames="uppercase"
                  >
                    {data.data.truckId.productId.value}
                  </Text>
                </div>

                <div className="flex items-center justify-between gap-2 mb-4">
                  <Text variant="ps" color="text-dark-gray-550">
                    Transporting Volume
                  </Text>
                  <Text variant="ps" color="text-[#151A23]" fontWeight="medium">
                    {formatNumber(data.data.truckId.capacity)} Ltrs
                  </Text>
                </div>

                <div className="flex items-center justify-between gap-2 mb-4">
                  <Text variant="ps" color="text-dark-gray-550">
                    Loading Depot
                  </Text>
                  <Text variant="ps" color="text-[#151A23]" fontWeight="medium">
                    {/* TODO: update this to order depot and hub */}
                    {data.data.loadingDepot},{' '}
                    {data.data.truckId.depotHubId.name}
                  </Text>
                </div>

                <div className="flex items-center justify-between gap-2 mb-4">
                  <Text variant="ps" color="text-dark-gray-550">
                    Destination
                  </Text>
                  <Text
                    variant="ps"
                    color="text-[#151A23]"
                    fontWeight="medium"
                    classNames="text-right"
                  >
                    {data.data.destination}, {data.data.city}, {data.data.state}
                  </Text>
                </div>
              </div>
            </div>

            <div className="bg-light-gray-150 flex items-center flex-wrap justify-between min-h-[78px] px-4 rounded-[10px]">
              <Text variant="ps" color="text-dark-500">
                Quote Amount
              </Text>
              <Heading variant="h5" color="text-[#151A23]" fontWeight="bold">
                ₦ {formatNumber(data.data.price, true)}
              </Heading>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export { TrackTruckModal, TRACK_TRUCK };
