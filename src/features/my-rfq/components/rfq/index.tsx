'use client';
import CustomButton from '@/components/atoms/custom-button';
import { Text } from '@/components/atoms/text';
import { FGEye, FGTruckFill } from '@fg-icons';
import React, { useContext } from 'react';
import { ModalContext } from '@/contexts/ModalContext';
import { TRUCK_RFQ_DETAILS } from '@/modals/rfq-detail-modal';
import { TruckOrderDto } from '@/types/truck-order.types';
import { TruckDto } from '@/features/transporter-dashboard/types/truck.type';
import { ProductDto } from '@/types/product.types';
import { formatNumber } from '@/utils/formatNumber';
import { BuyerDto } from '@/features/authentication/types/onboarding.types';
import { UserType } from '@/types/user.types';
import { timeDiffDay } from '@/utils/formatDate';
import { useRouter } from 'next/navigation';
import ClickableUserName from '@/components/atoms/clickable-user-name';
import RateButton from '@/components/atoms/rate-button';
import { TransporterDto } from '@/features/authentication/types/onboarding.types';
import { AuthContext } from '@/contexts/AuthContext';

// TODO: create a story and props for this
const RfqComponent = ({ truckOrder }: { truckOrder: TruckOrderDto }) => {
  const { handleToggle } = useContext(ModalContext);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const userRole = user?.data?.role;

  const handleTruckRfqDetailModal = () => {
    if (truckOrder.rfqStatus !== 'accepted') {
      router.push(`/dashboard/my-rfq/${truckOrder._id}`);
    } else {
      handleToggle &&
        handleToggle({
          name: TRUCK_RFQ_DETAILS,
          state: true,
          data: { truckOrderId: truckOrder._id },
        });
    }
  };

  // Dynamic rendering based on user role
  const renderUserInfo = () => {
    if (userRole === 'buyer') {
      // If logged in user is buyer, show transporter info
      return (
        <Text
          variant="ps"
          color="text-dark-gray-50"
          fontWeight="regular"
          classNames="mb-1"
        >
          Transporter -{' '}
          <ClickableUserName
            user={{
              _id:
                ((truckOrder.profileId as TransporterDto)?.userId as UserType)
                  ?._id || '',
              firstName:
                ((truckOrder.profileId as TransporterDto)?.userId as UserType)
                  ?.firstName || '',
              lastName:
                ((truckOrder.profileId as TransporterDto)?.userId as UserType)
                  ?.lastName || '',
              email: (
                (truckOrder.profileId as TransporterDto)?.userId as UserType
              )?.email,
              role: 'transporter',
            }}
            variant="ps"
            fontWeight="medium"
            color="text-blue-600"
          />
        </Text>
      );
    } else {
      // If logged in user is transporter/seller, show customer (buyer) info
      return (
        <Text
          variant="ps"
          color="text-dark-gray-50"
          fontWeight="regular"
          classNames="mb-1"
        >
          Customer -{' '}
          <ClickableUserName
            user={{
              _id:
                ((truckOrder.buyerId as BuyerDto)?.userId as UserType)?._id ||
                '',
              firstName:
                ((truckOrder.buyerId as BuyerDto)?.userId as UserType)
                  ?.firstName || '',
              lastName:
                ((truckOrder.buyerId as BuyerDto)?.userId as UserType)
                  ?.lastName || '',
              email: ((truckOrder.buyerId as BuyerDto)?.userId as UserType)
                ?.email,
              role: 'buyer',
            }}
            variant="ps"
            fontWeight="medium"
            color="text-blue-600"
          />
        </Text>
      );
    }
  };

  return (
    <div className="relative bg-white flex items-center justify-between border border-mid-gray-550 p-4 rounded-[10px] min-h-[120px] max-h-[120px]">
      <div className="flex items-start gap-4 flex-1 min-w-0 pr-4">
        <div className="h-[50px] w-[50px] rounded-[7px] bg-blue-tone-100 flex items-center justify-center flex-shrink-0">
          <FGTruckFill height={31} width={31} color="#1868DB" />
        </div>
        <div className="flex-1 min-w-0">
          <Text
            variant="pl"
            color="text-deep-gray-300"
            fontWeight="semibold"
            classNames="flex flex-wrap items-center gap-2 mb-1"
          >
            <span className="inline-flex items-center justify-center bg-green-tone-700 w-[43px] h-[17px] text-white rounded-[2px] uppercase font-medium text-xs flex-shrink-0">
              {((truckOrder.truckId as TruckDto).productId as ProductDto).value}
            </span>
            <span className="flex-shrink-0">
              {formatNumber((truckOrder.truckId as TruckDto).capacity)} Ltrs
            </span>
            {truckOrder.rfqStatus === 'pending' ? (
              <span className="text-orange-500 ml-3 flex-shrink-0 italic">
                Pending Quote
              </span>
            ) : (
              <span className="text-green-tone-500 ml-3 flex-shrink-0">
                &#8358; {formatNumber(truckOrder.price, true)}
              </span>
            )}
          </Text>{' '}
          {renderUserInfo()}
          <Text
            variant="ps"
            color="text-dark-gray-50"
            fontWeight="regular"
            classNames="mb-1"
          >
            Destination -{' '}
            <span
              className="text-medium truncate inline-block max-w-[200px]"
              title={`${truckOrder.destination}, ${truckOrder.city}, ${truckOrder.state}`}
            >
              {truckOrder.destination}, {truckOrder.city}, {truckOrder.state}.
            </span>
          </Text>
        </div>
      </div>
      <div className="flex-shrink-0 text-right min-w-[140px]">
        <Text variant="ps" color="text-dark-gray-50" classNames="mb-3">
          {timeDiffDay(truckOrder.createdAt as Date)}
        </Text>
        <div className="flex items-center gap-2 justify-end">
          <CustomButton
            variant="primary"
            onClick={handleTruckRfqDetailModal}
            height="h-11"
            label="See Details"
            leftIcon={<FGEye color="white" />}
            fontSize="text-sm"
            fontWeight="medium"
          />
          {truckOrder.status === 'completed' && (
            <RateButton
              truckOrderId={truckOrder._id}
              orderType="truck-order"
              orderStatus={truckOrder.status}
              ratedUser={{
                _id:
                  ((truckOrder.profileId as TransporterDto)?.userId as UserType)
                    ?._id || '',
                firstName:
                  ((truckOrder.profileId as TransporterDto)?.userId as UserType)
                    ?.firstName || '',
                lastName:
                  ((truckOrder.profileId as TransporterDto)?.userId as UserType)
                    ?.lastName || '',
                email: (
                  (truckOrder.profileId as TransporterDto)?.userId as UserType
                )?.email,
              }}
              size="md"
              variant="outline"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export { RfqComponent };
