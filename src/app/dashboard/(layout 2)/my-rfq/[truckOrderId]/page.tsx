'use client';
import React, { useContext, useEffect } from 'react';
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
import { useParams, useRouter } from 'next/navigation';
import { formatNumber } from '@/utils/formatNumber';
import CustomLoader from '@/components/atoms/custom-loader';
import { StatusText } from '@/features/transporter-dashboard/components/truck-order-list/status-text';
import { useQueryClient } from '@tanstack/react-query';
import io from 'socket.io-client';
// import { TruckOfferBtn } from '@/features/dashboard/components/product-list/truckOffer-btn';
import { ModalContext } from '@/contexts/ModalContext';
import { MAKE_A_TRUCK_OFFER } from '@/modals/make-a-truck-offer-modal';
import useOrderHook from '@/hooks/useOrder.hook';
import { AuthContext } from '@/contexts/AuthContext';

const sora = Sora({ subsets: ['latin'] });

const TruckRfq = () => {
  const params = useParams();
  const { handleToggle } = useContext(ModalContext);
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const { useGetTruckOrderDetails, useUpdateTruckOrderRFQStatus } =
    useTruckOrderHook();
  const { data, isLoading, refetch } = useGetTruckOrderDetails(
    params.truckOrderId as string,
  );
  const { useGetOrderDetails, useUpdateOrder } = useOrderHook();
  const { data: orderData, isLoading: isLoadingOrder } = useGetOrderDetails(
    params.truckOrderId as string,
  );

  console.log(orderData, 'orderData in TruckRfq');

  const { mutateAsync: updateRFQStatus, isPending: isUpdatingStatus } =
    useUpdateTruckOrderRFQStatus(params.truckOrderId as string);

  const { mutateAsync: updateOrder, isPending: isUpdatingOrder } =
    useUpdateOrder(params.truckOrderId as string);

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

  const handleStatus = async (status: 'accepted' | 'rejected') => {
    try {
      const credentials = {
        ...data,
        description:
          status === 'accepted' ? 'accepting_order' : 'rejecting_order',
        type: 'truck',
        rfqStatus: status,
        status: "in-progress", // Assuming you want to set status to in-progress when accepting
      };
      // console.log(credentials);
      await updateOrder(credentials);
    } catch (error: any) {
      console.error('Error updating RFQ status:', error);
    }
  };

  const handleOnClick = () => {
    if (
      orderData?.data.rfqStatus === 'sent' ||
      orderData?.data.rfqStatus === 'rejected'
    ) {
      handleToggle &&
        handleToggle({
          state: true,
          name: MAKE_A_TRUCK_OFFER,
          data: {
            price: orderData?.data.price,
            // receiverId: orderData?.data.profileId._id,
            truckOrderId: orderData?.data._id,
          },
        });
    } else {
      // router.push(`/dashboard/chat/${truckOfferId}`);
    }
  };
  // console.log(`data`, data);
  // Determine user role
  const userRole = user?.data?.role;
  const isBuyer = userRole === 'buyer';
  const isSellerOrTransporter =
    userRole === 'seller' || userRole === 'transporter';

  // Pick which profile to show
  const profileToShow = isBuyer
    ? orderData?.data?.profileId
    : orderData?.data?.buyerId;
  const profileLabel = isBuyer ? 'Transporter' : 'Buyer';

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
          {isLoadingOrder ? (
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
                  {isBuyer ? (
                    <>
                      This is a quotation for securing truck number{' '}
                      <span className="font-bold">
                        {orderData?.data.truckId.truckNumber}
                      </span>
                      . Kindly contact the transporter for truck location and to
                      finalize payment and loading.
                    </>
                  ) : (
                    <>
                      This is a quotation for your truck order from buyer{' '}
                      <span className="font-bold">
                        {orderData?.data.buyerId?.userId?.firstName}{' '}
                        {orderData?.data.buyerId?.userId?.lastName}
                      </span>
                      . Kindly check the chat for buyer&apos;s instructions and
                      respond as needed.
                    </>
                  )}
                </Text>
                <Heading
                  variant="h5"
                  classNames="text-center mb-7"
                  fontFamily={sora.className}
                  fontWeight="semibold"
                  color="text-red-tone-600"
                >
                  &#8358; {formatNumber(orderData?.data.price, true)}
                </Heading>

                <TransporterRoot classNames="max-w-[496px] mx-auto">
                  <Text
                    variant="pm"
                    color="text-dark-gray-400"
                    fontWeight="medium"
                    classNames="mb-3.5"
                  >
                    {profileLabel}
                  </Text>
                  <TransporterCard
                    data={profileToShow}
                    truckSize={orderData?.data.truckId.capacity}
                  />
                </TransporterRoot>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-light-gray-700 mt-32 py-6 px-5">
                {/* Always show RFQ status label */}
                <div className="flex items-center gap-2 w-full mb-2">
                  <span className="font-semibold text-xs text-gray-500">
                    RFQ Status:
                  </span>
                  <StatusText status={orderData?.data.rfqStatus} />
                </div>

                {/* Buyer actions */}
                {isBuyer && orderData?.data.rfqStatus === 'sent' && (
                  <>
                    <CustomButton
                      variant="white"
                      border="border-red-tone-200 border-[1.5px]"
                      color="text-red-tone-200"
                      label="Reject"
                      width="w-[182px]"
                      height="h-[55px]"
                      onClick={() => {
                        handleOnClick();
                      }}
                    />
                    <CustomButton
                      variant="primary"
                      label="Accept Offer"
                      width="w-[182px]"
                      height="h-[55px]"
                      loading={isUpdatingStatus}
                      onClick={() => {
                        handleStatus('accepted');
                      }}
                    />
                  </>
                )}

                {/* Seller/Transporter: show Send Invoice if pending */}
                {isSellerOrTransporter &&
                  orderData?.data.rfqStatus === 'pending' && (
                    <CustomButton
                      variant="primary"
                      label="Send Invoice"
                      width="w-[182px]"
                      height="h-[55px]"
                      onClick={() => {
                        /* TODO: implement send invoice */
                      }}
                    />
                  )}

                {/* Only show Go to Chat if negotiationId exists and order status is pending */}
                {orderData?.data.status === 'pending' &&
                  orderData?.data.negotiationId && (
                    <div className="ml-2 flex items-center w-full justify-between">
                      <span className="text-sm text-dark-gray-400 w-2/3 md:w-auto">
                        Check chat for responses and continue negotiating.
                      </span>
                      <button
                        className="text-primary-600 underline font-medium w-1/3 md:w-auto"
                        onClick={() =>
                          router.push(
                            `/dashboard/chat/${orderData.data.negotiationId}`,
                          )
                        }
                      >
                        Go to chat
                      </button>
                    </div>
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
