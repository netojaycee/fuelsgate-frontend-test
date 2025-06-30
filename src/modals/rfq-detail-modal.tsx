import { cn } from '@/lib/utils';
import { Sora } from 'next/font/google';
import React, { useContext } from 'react';
import { Text } from '@/components/atoms/text';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Heading } from '@/components/atoms/heading';
import { ModalContext } from '@/contexts/ModalContext';
import useTruckOrderHook from '@/hooks/useTruckOrder.hook';
import CustomLoader from '@/components/atoms/custom-loader';
import { formatNumber } from '@/utils/formatNumber';
import { StatusText } from '@/features/transporter-dashboard/components/truck-order-list/status-text';
import { useRouter } from 'next/navigation';
import { RFQ_TICKET } from '@/routes';
import { FGEye } from '@fg-icons';
import CustomButton from '@/components/atoms/custom-button';

const sora = Sora({ subsets: ['latin'] });
const TRUCK_RFQ_DETAILS = 'truck_rfq_details';

const RFQDetailModal = () => {
  const { openModal } = useContext(ModalContext);
  const { useGetTruckOrderDetails } = useTruckOrderHook();
  const { data, isLoading } = useGetTruckOrderDetails(
    openModal?.data.truckOrderId,
  );
  const router = useRouter();
  const gotoTicket = () => router.push(`${RFQ_TICKET}/${data?.data?._id}`);
  console.log(data?.data);

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
            {(data.data.status === 'in-progress' ||
              data.data.status === 'completed') && (
              <div className="mb-2 flex justify-end">
                <CustomButton
                  variant="primary"
                  onClick={gotoTicket}
                  height="h-11"
                  label="See Ticket"
                  leftIcon={<FGEye color="white" />}
                  fontSize="text-sm"
                  fontWeight="medium"
                  width="w-40"
                />
              </div>
            )}
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
                    Loading Depot
                  </Text>
                  <Text variant="ps" color="text-[#151A23]" fontWeight="medium">
                    {data.data.truckId.depot},{' '}
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

            <div className="bg-light-gray-150 py-[10px] px-4 rounded-[10px] mb-3">
              <div className="bg-white p-4 rounded-lg">
                <div className="flex items-center justify-between gap-2">
                  <Text variant="ps" color="text-dark-500">
                    Status
                  </Text>
                  <StatusText status={data.data.status} />
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

export { RFQDetailModal, TRUCK_RFQ_DETAILS };
