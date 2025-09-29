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
    if (truckOrder.status === 'pending' || truckOrder.status === 'cancelled') {
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

  console.log(truckOrder, 'Truck Order in RFQ Component');

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
          Vendor -{' '}
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
    <div className="relative bg-white flex flex-col md:flex-row items-start md:items-center justify-between border border-mid-gray-550 p-4 rounded-[10px] min-h-[120px] max-h-[none] md:max-h-[120px]">
      <div className=" flex items-start gap-4 flex-1 min-w-0 pr-0 md:pr-4 w-full">
       <div className='flex flex-col gap-1'> <div className="h-[50px] w-[50px] rounded-[7px] bg-blue-tone-100 border border-black flex items-center justify-center flex-shrink-0">
          <FGTruckFill
            height={31}
            width={31}
            color={'#1868DB'}
            // ((truckOrder.truckId as TruckDto)?.productId as ProductDto)?.color ||
          />
        
        </div>    {(truckOrder.truckId as TruckDto)?.truckType === 'tanker' && (
              <span
                style={{
                  backgroundColor:
                    ((truckOrder.truckId as TruckDto)?.productId as ProductDto)
                      ?.color || '#1868DB',
                }}
                className="border border-black inline-flex items-center justify-center w-[50px] h-[17px] text-black rounded-[2px] uppercase font-medium text-xs flex-shrink-0"
              >
                {
                  ((truckOrder.truckId as TruckDto)?.productId as ProductDto)
                    ?.value
                }
              </span>
            )}
             {/* Truck type badge */}
            <span className="inline-flex items-center justify-center px-2 w-[50px] h-[17px] text-blue-700 bg-blue-100 rounded-[2px] uppercase font-medium text-[10px] flex-shrink-0">
              {(
                (truckOrder.truckId as TruckDto)?.truckType || ''
              ).toUpperCase()}
            </span>
            </div>
        <div className="flex-1 min-w-0 flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2 mb-1 w-full">
            {/* Product badge (only for tanker) */}
          
           
            {/* Capacity with correct unit */}
            <span className="flex-shrink-0 text-gray-700 font-semibold">
              {formatNumber((truckOrder.truckId as TruckDto)?.capacity ?? 0)}{' '}
              {(truckOrder.truckId as TruckDto)?.truckType === 'tanker'
                ? 'Ltrs'
                : 'Tons'}
            </span>
            {/* Load status (if not tanker) */}
            {(truckOrder.truckId as TruckDto)?.truckType === 'tanker' && (
              <span className="inline-flex items-center justify-center px-2 h-[17px] text-green-700 bg-green-100 rounded-[2px] uppercase font-medium text-xs flex-shrink-0">
                {(
                  (truckOrder.truckId as TruckDto)?.loadStatus || ''
                ).toUpperCase()}
              </span>
            )}
            {/* Price or Pending */}
            {truckOrder.rfqStatus === 'pending' ? (
              <span className="text-orange-500 ml-3 flex-shrink-0 italic">
                Pending Quote
              </span>
            ) : (
              <span className="text-green-tone-500 ml-3 flex-shrink-0 font-semibold">
                &#8358; {formatNumber(truckOrder.price, true)}
              </span>
            )}
          </div>
          {renderUserInfo()}
          <Text
            variant="ps"
            color="text-dark-gray-50"
            fontWeight="regular"
            classNames="mb-1 md:flex items-center"
          >
            Destination -{' '}
            <span
              className="text-medium truncate inline-block max-w-full md:max-w-[200px]"
              title={`${truckOrder.destination}, ${truckOrder.city}, ${truckOrder.state}`}
            >
              {truckOrder.destination}, {truckOrder.city}, {truckOrder.state}.
            </span>
          </Text>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center w-full mt-4 md:mt-0 md:flex-col md:justify-end md:items-end md:w-auto md:min-w-[140px] text-right">
        <Text variant="ps" color="text-dark-gray-50" classNames="mb-3 md:mb-3">
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
