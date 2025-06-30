'use client';
import React, { useEffect } from 'react';
import Image from 'next/image';
import Pattern from '@assets/images/Pattern.svg';
import { Text } from '@/components/atoms/text';
import { Heading } from '@/components/atoms/heading';
import { Sora } from 'next/font/google';
import {
  TransporterCard,
  TransporterRoot,
} from '@/components/atoms/transporter-card';
import CustomButton from '@/components/atoms/custom-button';
import useTruckOrderHook from '@/hooks/useTruckOrder.hook';
import { useParams } from 'next/navigation';
import { formatNumber } from '@/utils/formatNumber';
import CustomLoader from '@/components/atoms/custom-loader';
import { StatusText } from '@/features/transporter-dashboard/components/truck-order-list/status-text';
import { useQueryClient } from '@tanstack/react-query';
import io from 'socket.io-client';

const sora = Sora({ subsets: ['latin'] });

const TruckRfq = () => {
  const params = useParams();
  const { useGetTruckOrderDetails, useUpdateTruckOrderRFQStatus } =
    useTruckOrderHook();
  const { data, isLoading, refetch } = useGetTruckOrderDetails(
    params.truckOrderId as string,
  );
  const { mutateAsync: updateRFQStatus, isPending: isUpdatingStatus } =
    useUpdateTruckOrderRFQStatus(params.truckOrderId as string);

  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
      transports: ['websocket'],
      secure: true,
    });
    socket.on('updatedTruckOrderStatus', (res) => {
      queryClient.invalidateQueries({
        queryKey: [`${res._id}_TRUCK_ORDER_DETAIL`],
      });
      refetch();
    });
  }, [queryClient, refetch]);

  const handleAccept = async () => {
    await updateRFQStatus({
      rfqStatus: 'accepted',
    });
  };

  const handleReject = async () => {
    await updateRFQStatus({
      rfqStatus: 'rejected',
    });
  };

  return (
    <div className="relative bg-white">
      <div className="container mx-auto py-8">
        <div className="relative max-w-[1064px] mx-auto border border-mid-gray-550 rounded-[10px]">
          <Image
            src={Pattern}
            alt="pattern"
            className="absolute top-0 left-0 z-0"
            height={440}
            width={1140}
          />
          {isLoading ? (
            <CustomLoader />
          ) : (
            <>
              <div className=" relative pt-24 px-4">
                <Heading
                  variant="h5"
                  classNames="text-center mb-4"
                  fontWeight="semibold"
                  color="text-dark-500"
                >
                  Truck RFQ
                </Heading>
                <Text
                  variant="pm"
                  color="text-black/70"
                  classNames="max-w-[517px] mx-auto text-center mb-9"
                >
                  This is quotation for securing truck number{' '}
                  <span className="font-bold">
                    {data?.data.truckId.truckNumber}
                  </span>
                  . Kindly contact Transporter for truck location and to
                  finalize payment and loading.
                </Text>
                <Heading
                  variant="h5"
                  classNames="text-center mb-7"
                  fontFamily={sora.className}
                  fontWeight="semibold"
                  color="text-red-tone-600"
                >
                  &#8358; {formatNumber(data.data.price, true)}
                </Heading>

                <TransporterRoot classNames="max-w-[496px] mx-auto">
                  <Text
                    variant="pm"
                    color="text-dark-gray-400"
                    fontWeight="medium"
                    classNames="mb-3.5"
                  >
                    Transporter
                  </Text>
                  <TransporterCard
                    data={data.data.profileId}
                    truckSize={data.data.truckId.capacity}
                  />
                </TransporterRoot>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-light-gray-700 mt-32 py-6 px-10">
                {data.data.rfqStatus === 'sent' ? (
                  <>
                    <CustomButton
                      variant="white"
                      border="border-red-tone-200 border-[1.5px]"
                      color="text-red-tone-200"
                      label="Reject"
                      width="w-[182px]"
                      height="h-[55px]"
                      loading={isUpdatingStatus}
                      onClick={handleReject}
                    />
                    <CustomButton
                      variant="primary"
                      label="Accept Offer"
                      width="w-[182px]"
                      height="h-[55px]"
                      loading={isUpdatingStatus}
                      onClick={handleAccept}
                    />
                  </>
                ) : (
                  <StatusText status={data.data.rfqStatus} />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TruckRfq;
