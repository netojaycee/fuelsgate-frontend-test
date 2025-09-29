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
import { TRUCK_RFQ } from '@/modals/rfq-modal';
import { RFQ_TICKET } from '@/routes';
import { FGEye } from '@fg-icons';

const sora = Sora({ subsets: ['latin'] });

const TruckRfq = () => {
  const params = useParams();
  const { handleToggle } = useContext(ModalContext);
  const { user } = useContext(AuthContext);
  const router = useRouter();
  // const { useGetTruckOrderDetails, useUpdateTruckOrderRFQStatus } =
  //   useTruckOrderHook();
  // const { data, isLoading, refetch } = useGetTruckOrderDetails(
  //   params.truckOrderId as string,
  // );
  const handleSendRFQButton = () =>
    handleToggle &&
    handleToggle({
      state: true,
      name: TRUCK_RFQ,
      data: { truckOrderId: params.truckOrderId as string },
    });

  const { useGetOrderDetails, useUpdateOrder } = useOrderHook();
  const { data: orderData, isLoading: isLoadingOrder } = useGetOrderDetails(
    params.truckOrderId as string,
  );

  const gotoTicket = () => {
    router.push(`${RFQ_TICKET}/${orderData?.data?._id}`);
  };
  console.log(orderData, 'orderData in TruckRfq');

  // const { mutateAsync: updateRFQStatus, isPending: isUpdatingStatus } =
  //   useUpdateTruckOrderRFQStatus(params.truckOrderId as string);

  const { mutateAsync: updateOrder, isPending: isUpdatingOrder } =
    useUpdateOrder(params.truckOrderId as string);

  // const queryClient = useQueryClient();

  // useEffect(() => {
  //   const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
  //     transports: ['websocket'],
  //     secure: true,
  //   });
  //   socket.on('updatedTruckOrderStatus', (res) => {
  //     queryClient.invalidateQueries({
  //       queryKey: [`${res._id}_TRUCK_ORDER_DETAIL`],
  //     });
  //     refetch();
  //   });
  // }, [queryClient, refetch]);

  // const handleAccept = async () => {
  //   await updateRFQStatus({
  //     rfqStatus: 'accepted',
  //   });
  // };

  // const handleReject = async () => {
  //   await updateRFQStatus({
  //     rfqStatus: 'rejected',
  //   });
  // };

  const handleStatus = async (status: 'accepted' | 'rejected') => {
    try {
      const credentials = {
        ...orderData,
        description:
          status === 'accepted' ? 'accepting_order' : 'rejecting_order',
        type: 'truck',
        rfqStatus: status,
        status: 'in-progress', // Assuming you want to set status to in-progress when accepting
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
  const profileLabel = isBuyer ? 'Vendor' : 'Customer';

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
                  {orderData?.data.truckId.truckType === 'tanker' &&
                  orderData?.data.truckId.loadStatus === 'loaded'
                    ? 'Volume RFQ'
                    : 'Truck RFQ'}
                </Heading>
                <Text
                  variant="pm"
                  color="text-black/70"
                  classNames="max-w-[517px] mx-auto text-center mb-9"
                >
                  {isBuyer ? (
                    <>
                      {orderData?.data.truckId.truckType === 'tanker' &&
                      orderData?.data.truckId.loadStatus === 'loaded' ? (
                        <>
                          This is a quotation for securing{' '}
                          <span className="font-bold">
                            {orderData?.data.truckId.capacity}
                          </span>{' '}
                          litres. Kindly contact the vendor for load/truck
                          location and to finalize payment and loading.
                        </>
                      ) : (
                        <>
                          This is a quotation for securing truck ref number{' '}
                          <span className="font-bold">
                            {orderData?.data.truckId.refNo}
                          </span>
                          . Kindly contact the vendor for truck location
                          and to finalize payment and loading.
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      Use the send Invoice button below to send quote for this
                      order to buyer{'  '}
                      <span className="font-bold">
                        {orderData?.data.buyerId?.userId?.firstName}{' '}
                        {orderData?.data.buyerId?.userId?.lastName}
                      </span>
                      . In the case of rejection, kindly check the chat for
                      buyer&apos;s counter offer and respond as needed. In the
                      case of acceptance please proceed to use the print ticket
                      button, download ticket and continue process offline.
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

                {/* Order Details Section */}
                <div className="max-w-[496px] mx-auto mt-8 border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <Heading
                    variant="h6"
                    classNames="mb-4 text-gray-800"
                    fontWeight="semibold"
                  >
                    📋 Order Details
                  </Heading>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tracking ID */}
                    <div>
                      <Text
                        variant="pxs"
                        color="text-gray-600"
                        fontWeight="medium"
                        classNames="mb-1"
                      >
                        Tracking ID
                      </Text>
                      <Text
                        variant="ps"
                        color="text-gray-800"
                        fontWeight="semibold"
                      >
                        {orderData?.data.trackingId}
                      </Text>
                    </div>

                    {/* Loading Depot */}
                    <div>
                      <Text
                        variant="pxs"
                        color="text-gray-600"
                        fontWeight="medium"
                        classNames="mb-1"
                      >
                        Loading Depot
                      </Text>
                      <Text variant="ps" color="text-gray-800">
                        {orderData?.data.loadingDepot}
                      </Text>
                    </div>

                    {/* Destination */}
                    <div className="col-span-full">
                      <Text
                        variant="pxs"
                        color="text-gray-600"
                        fontWeight="medium"
                        classNames="mb-1"
                      >
                        Destination
                      </Text>
                      <Text variant="ps" color="text-gray-800">
                        {orderData?.data.destination}, {orderData?.data.city},{' '}
                        {orderData?.data.state}
                      </Text>
                    </div>

                    {/* Loading Date */}
                    {orderData?.data.loadingDate && (
                      <div>
                        <Text
                          variant="pxs"
                          color="text-gray-600"
                          fontWeight="medium"
                          classNames="mb-1"
                        >
                          Loading Date
                        </Text>
                        <Text variant="ps" color="text-gray-800">
                          {new Date(
                            orderData.data.loadingDate,
                          ).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Text>
                      </div>
                    )}

                    {/* Status */}
                    <div>
                      <Text
                        variant="pxs"
                        color="text-gray-600"
                        fontWeight="medium"
                        classNames="mb-1"
                      >
                        Order Status
                      </Text>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          orderData?.data.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : orderData?.data.status === 'in-progress'
                            ? 'bg-blue-100 text-blue-700'
                            : orderData?.data.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {orderData?.data.status}
                      </span>
                    </div>
                  </div>

                  {/* Truck Information */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <Text
                      variant="ps"
                      color="text-gray-700"
                      fontWeight="medium"
                      classNames="mb-3"
                    >
                      🚛 Truck Information
                    </Text>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Text
                          variant="pxs"
                          color="text-gray-600"
                          fontWeight="medium"
                          classNames="mb-1"
                        >
                          Truck Type
                        </Text>
                        <Text
                          variant="ps"
                          color="text-gray-800"
                          classNames="capitalize"
                        >
                          {orderData?.data.truckId.truckType}
                        </Text>
                      </div>

                      <div>
                        <Text
                          variant="pxs"
                          color="text-gray-600"
                          fontWeight="medium"
                          classNames="mb-1"
                        >
                          Truck Category
                        </Text>
                        <Text variant="ps" color="text-gray-800">
                          {orderData?.data.truckId.truckCategory}
                        </Text>
                      </div>

                      {orderData?.data.truckId.truckNumber && (
                        <div>
                          <Text
                            variant="pxs"
                            color="text-gray-600"
                            fontWeight="medium"
                            classNames="mb-1"
                          >
                            Truck Number
                          </Text>
                          <Text variant="ps" color="text-gray-800">
                            {orderData?.data.truckId.truckNumber}
                          </Text>
                        </div>
                      )}

                      {orderData?.data.truckId.refNo && (
                        <div>
                          <Text
                            variant="pxs"
                            color="text-gray-600"
                            fontWeight="medium"
                            classNames="mb-1"
                          >
                            Ref No.
                          </Text>
                          <Text variant="ps" color="text-gray-800">
                            {orderData?.data.truckId.refNo}
                          </Text>
                        </div>
                      )}

                      <div>
                        <Text
                          variant="pxs"
                          color="text-gray-600"
                          fontWeight="medium"
                          classNames="mb-1"
                        >
                          Capacity
                        </Text>
                        <Text variant="ps" color="text-gray-800">
                          {orderData?.data.truckId.capacity}{' '}
                          {orderData?.data.truckId.truckType === 'tanker'
                            ? 'Ltrs'
                            : 'Tons'}
                        </Text>
                      </div>

                      {orderData?.data.truckId.truckType === 'tanker' && (
                        <div>
                          <Text
                            variant="pxs"
                            color="text-gray-600"
                            fontWeight="medium"
                            classNames="mb-1"
                          >
                            Load Status
                          </Text>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                              orderData?.data.truckId.loadStatus === 'loaded'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-orange-100 text-orange-700'
                            }`}
                          >
                            {orderData?.data.truckId.loadStatus}
                          </span>
                        </div>
                      )}

                      <div>
                        <Text
                          variant="pxs"
                          color="text-gray-600"
                          fontWeight="medium"
                          classNames="mb-1"
                        >
                          Current Location
                        </Text>
                        <Text variant="ps" color="text-gray-800">
                          {orderData?.data.truckId.depot}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Details for tanker trucks */}
                {orderData?.data.truckId.truckType === 'tanker' &&
                  orderData?.data.truckId.productId && (
                    <div className="max-w-[496px] mx-auto mt-8 border border-green-100 rounded-lg p-4 bg-green-50">
                      <Heading
                        variant="h6"
                        classNames="mb-2 text-green-700"
                        fontWeight="semibold"
                      >
                        🛢️ Product Information
                      </Heading>
                      <div className="flex flex-col gap-2">
                        <Text variant="ps" color="text-dark-gray-400">
                          <span className="font-semibold">Product:</span>{' '}
                          {orderData.data.truckId.productId.name}
                        </Text>
                        <Text variant="ps" color="text-dark-gray-400">
                          <span className="font-semibold">Product Type:</span>{' '}
                          {orderData.data.truckId.productId.value?.toUpperCase()}
                        </Text>
                        <Text variant="ps" color="text-dark-gray-400">
                          <span className="font-semibold">Unit:</span>{' '}
                          {orderData.data.truckId.productId.unit}
                        </Text>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-dark-gray-400 text-sm">
                            Product Color:
                          </span>
                          <div className="flex items-center gap-2">
                            {orderData.data.truckId.productId.color?.includes(
                              '-',
                            ) ? (
                              <div className="flex">
                                <div
                                  className="w-6 h-6 rounded-l border border-gray-300"
                                  style={{
                                    backgroundColor:
                                      orderData.data.truckId.productId.color.split(
                                        '-',
                                      )[0],
                                  }}
                                />
                                <div
                                  className="w-6 h-6 rounded-r border border-gray-300"
                                  style={{
                                    backgroundColor:
                                      orderData.data.truckId.productId.color.split(
                                        '-',
                                      )[1],
                                  }}
                                />
                              </div>
                            ) : (
                              <div
                                className="w-6 h-6 rounded border border-gray-300"
                                style={{
                                  backgroundColor:
                                    orderData.data.truckId.productId.color,
                                }}
                              />
                            )}
                            <Text variant="pxs" color="text-gray-600">
                              {orderData.data.truckId.productId.color}
                            </Text>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Cargo Details for non-tanker trucks */}
                {orderData?.data.truckId.truckType !== 'tanker' && (
                  <div className="max-w-[496px] mx-auto mt-8 border border-blue-100 rounded-lg p-4 bg-blue-50">
                    <Heading
                      variant="h6"
                      classNames="mb-2 text-blue-700"
                      fontWeight="semibold"
                    >
                      📦 Cargo Details
                    </Heading>
                    <div className="flex flex-col gap-2">
                      {orderData?.data.cargoType && (
                        <Text variant="ps" color="text-dark-gray-400">
                          <span className="font-semibold">Cargo Type:</span>{' '}
                          {orderData.data.cargoType}
                        </Text>
                      )}
                      {orderData?.data.cargoCategory && (
                        <Text variant="ps" color="text-dark-gray-400">
                          <span className="font-semibold">Cargo Category:</span>{' '}
                          {orderData.data.cargoCategory}
                        </Text>
                      )}
                      {orderData?.data.cargoWeight && (
                        <Text variant="ps" color="text-dark-gray-400">
                          <span className="font-semibold">Cargo Weight:</span>{' '}
                          {orderData.data.cargoWeight}
                        </Text>
                      )}
                      {orderData?.data.specialHandling &&
                        orderData.data.specialHandling.length > 0 && (
                          <Text variant="ps" color="text-dark-gray-400">
                            <span className="font-semibold">
                              Special Handling:
                            </span>{' '}
                            {orderData.data.specialHandling.join(', ')}
                          </Text>
                        )}
                      {orderData?.data.notes && (
                        <Text variant="ps" color="text-dark-gray-400">
                          <span className="font-semibold">Notes:</span>{' '}
                          {orderData.data.notes}
                        </Text>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-light-gray-700 mt-32 py-6 px-5">
                {/* View Ticket button if RFQ is accepted */}
                {orderData?.data.rfqStatus === 'accepted' && (
                  <CustomButton
                    variant="primary"
                    label="View Ticket"
                    width="w-[182px]"
                    height="h-[55px]"
                    onClick={() =>
                      router.push(`/dashboard/rfq/${orderData?.data?._id}`)
                    }
                  />
                )}
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
                      loading={isUpdatingOrder}
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
                      onClick={handleSendRFQButton}
                    />
                  )}

                {orderData?.data?.status !== 'pending' &&
                  orderData?.data?.status !== 'cancelled' && (
                    <CustomButton
                      variant="primary"
                      onClick={gotoTicket}
                      height="h-11"
                      label="Print Ticket"
                      leftIcon={<FGEye color="white" />}
                      fontSize="text-sm"
                      fontWeight="medium"
                      width="w-40"
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
