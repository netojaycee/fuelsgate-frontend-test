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
import useOrderHook from '@/hooks/useOrder.hook';

const sora = Sora({ subsets: ['latin'] });
const TRUCK_RFQ_DETAILS = 'truck_rfq_details';

const RFQDetailModal = () => {
  const { openModal } = useContext(ModalContext);
  const { useGetTruckOrderDetails } = useTruckOrderHook();
  const { data, isLoading } = useGetTruckOrderDetails(
    openModal?.data.truckOrderId,
  );

  const { useGetOrderDetails, useUpdateOrder } = useOrderHook();
  const { data: orderData, isLoading: isLoadingOrder } = useGetOrderDetails(
    openModal?.data.truckOrderId as string,
  );
  const router = useRouter();
  const { handleClose } = useContext(ModalContext);

  const gotoTicket = () => {
    handleClose?.(); // Close the modal if handleClose exists
    router.push(`${RFQ_TICKET}/${orderData?.data?._id}`);
  };

  // Personalized info message based on user and order status
  const user = require('@/contexts/AuthContext').useAuthContext?.()?.user;
  const userRole = user?.data?.role;
  const isBuyer = userRole === 'buyer';
  const isSellerOrTransporter =
    userRole === 'seller' || userRole === 'transporter';
  const orderStatus = orderData?.data?.status;
  const rfqStatus = orderData?.data?.rfqStatus;
  const negotiationId = orderData?.data?.negotiationId;

  let infoMessage = '';
  if (orderStatus === 'pending') {
    if (isBuyer) {
      infoMessage =
        'You have received a quotation for this truck. You can accept, reject, or negotiate the offer.';
    } else {
      infoMessage =
        'You have sent a quotation to the buyer. Await their response or check the chat for negotiation.';
    }
  } else if (orderStatus === 'in-progress') {
    if (isBuyer) {
      infoMessage =
        'Order is in progress. Please coordinate with the transporter for loading and delivery.';
    } else {
      infoMessage =
        'Order is in progress. Proceed to complete the order after delivery.';
    }
  } else if (orderStatus === 'completed') {
    infoMessage =
      'Order has been completed. You can print the ticket for your records.';
  } else if (orderStatus === 'cancelled') {
    if (isBuyer) {
      infoMessage =
        'You cancelled this order. No further actions can be taken.';
    } else {
      infoMessage =
        'This order was cancelled by the buyer. No further actions can be taken.';
    }
  }
  // console.log(data?.data);

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

        {isLoadingOrder ? (
          <CustomLoader />
        ) : (
          <>
            {/* Print Ticket button for all users if not pending/cancelled */}
            {orderStatus !== 'pending' && orderStatus !== 'cancelled' && (
              <div className="mb-2 flex justify-end">
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

                {/* Personalized info message */}
                <div className="mb-4">
                  <Text variant="ps" color="text-blue-700">
                    {infoMessage}
                  </Text>
                </div>

                <div className="flex items-center justify-between gap-2 mb-4">
                  <Text variant="ps" color="text-dark-gray-550">
                    Truck number
                  </Text>
                  <Text variant="ps" color="text-[#151A23]" fontWeight="bold">
                    {orderData?.data?.truckId?.truckNumber}
                  </Text>
                </div>

                <div className="flex items-center justify-between gap-2 mb-4">
                  <Text variant="ps" color="text-dark-gray-550">
                    Loading Depot
                  </Text>
                  <Text variant="ps" color="text-[#151A23]" fontWeight="medium">
                    {orderData?.data?.truckId?.depot},{' '}
                    {orderData?.data?.truckId?.depotHubId?.name}
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
                    {orderData?.data?.destination}, {orderData?.data?.city},{' '}
                    {orderData?.data?.state}
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
                  <StatusText status={orderData?.data?.status} />
                </div>
                {/* Negotiation/Chat info for pending+rejected/accepted */}
                {orderStatus === 'pending' &&
                  rfqStatus === 'rejected' &&
                  negotiationId && (
                    <div className="mt-3 flex items-center justify-between">
                      <Text variant="ps" color="text-dark-gray-400">
                        Negotiation ongoing. Please check the chat to continue.
                      </Text>
                      <button
                        className="text-primary-600 underline font-medium"
                        onClick={() =>
                          router.push(`/dashboard/chat/${negotiationId}`)
                        }
                      >
                        Go to chat
                      </button>
                    </div>
                  )}
                {orderStatus === 'pending' && rfqStatus === 'accepted' && (
                  <div className="mt-3">
                    <Text variant="ps" color="text-green-600">
                      Offer accepted. Order is now in progress.
                    </Text>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-light-gray-150 flex items-center flex-wrap justify-between min-h-[78px] px-4 rounded-[10px]">
              <Text variant="ps" color="text-dark-500">
                Quote Amount
              </Text>
              <Heading variant="h5" color="text-[#151A23]" fontWeight="bold">
                ₦ {formatNumber(orderData?.data?.price, true)}
              </Heading>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export { RFQDetailModal, TRUCK_RFQ_DETAILS };
