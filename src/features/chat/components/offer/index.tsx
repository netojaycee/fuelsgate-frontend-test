import { Text } from '@/components/atoms/text';
import { cn } from '@/lib/utils';
import { MessageDto } from '@/types/message.type';
import { OfferDto } from '@/types/offer.types';
import { ProductUploadDto } from '@/types/product-upload.types';
import { ProductDto } from '@/types/product.types';
import { TruckOfferDto } from '@/types/truckOffer.types';
import { timeDiff } from '@/utils/formatDate';
import { formatNumber } from '@/utils/formatNumber';
import { FGFlask } from '@fg-icons';
import { Truck } from 'lucide-react';
import React, { HTMLProps } from 'react';

type OfferActionProps = {
  item: MessageDto | any; // Allow any for truck messages
  offer?: any;
  className?: HTMLProps<HTMLElement>['className'];
};

const Offer: React.FC<OfferActionProps> = ({ item, offer, className }: any) => {
  // Check if this is a truck offer
  const isTruckOffer = offer?.type === 'truck';

  // Get the appropriate product value and opening price
  // For truck, show truck number, capacity, destination, loading depot, etc.
  const getTruckDetails = () => {
    if (!isTruckOffer) return null;
    const order = offer?.orderId;
    return {
      truckNumber: order?.truckId?.truckNumber || order?.truckId || '',
      capacity: order?.truckId?.capacity || '',
      destination: order?.destination || '',
      loadingDepot: order?.loadingDepot || '',
      state: order?.state || '',
      city: order?.city || '',
      loadingDate: order?.loadingDate || '',
      refNo: order?.truckId?.refNo || '',
    };
  };

  const getProductValue = () => {
    if (isTruckOffer) {
      const details = getTruckDetails();
      return details?.truckNumber
        ? `Truck: ${details.truckNumber}`
        : 'TRUCK SERVICE';
    }
    const productId = ((offer as OfferDto)?.productUploadId as ProductUploadDto)
      ?.productId;
    return typeof productId === 'object'
      ? (productId as ProductDto)?.value
      : productId;
  };

  const getOpeningPrice = () => {
    return offer?.orderId?.price;
  };

  const getOfferPrice = () => {
    return item?.offerPrice;
  };

  const truckDetails = isTruckOffer ? getTruckDetails() : null;

  // Get product color for truck
  let productColor = '#50CD89';
  let productBg = 'bg-green-tone-100';
  if (isTruckOffer && offer?.orderId?.truckId?.productId?.color) {
    productColor = offer.orderId.truckId.productId.color;
    
  }

  return (
    <div className={cn(className)}>
      <div className="bg-[#DEE0E51A] border border-green-tone-200 rounded-xl p-3 ml-auto max-w-[320px]">
        <div className="mb-3 flex items-center gap-2">
          <span
            className={cn(
              'h-[30px] w-[30px] rounded-full flex items-center justify-center',
            )}
            style={
              isTruckOffer && offer?.orderId?.truckId?.productId?.color
                ? productColor.includes('-')
                  ? {
                      background: `linear-gradient(90deg, ${
                        productColor.split('-')[0]
                      } 70%, ${productColor.split('-')[1]} 70%)`,
                    }
                  : {
                      background: productColor,
                    }
                : undefined
            }
          >
            {isTruckOffer ? (
              <Truck
                className=""
                style={{
                  color: productColor.includes('-')
                    ? productColor.split('-')[1]
                    : productColor,
                  height: 16,
                  width: 16,
                }}
              />
            ) : (
              <FGFlask color="#50CD89" height={16} width={16} />
            )}
          </span>
          <div>
            <Text
              variant="pxs"
              fontWeight="medium"
              color="text-dark-gray-400"
              classNames="uppercase"
            >
              {getProductValue()}
            </Text>
            <Text variant="pxs" color="text-dark-gray-400">
              Opening Price:
            </Text>
          </div>
          <Text
            variant="pxs"
            color="text-red-tone-600"
            fontWeight="semibold"
            classNames="ml-auto self-end"
          >
            ₦{formatNumber(getOpeningPrice(), true)}
          </Text>
        </div>

        <div className="bg-light-gray-200 border border-green-tone-300 rounded-lg p-2.5">
          <div className="flex items-center justify-between gap-3 mb-2">
            <Text variant="pxs" color="text-dark-gray-400">
              Time of Request
            </Text>
            <Text
              variant="pxs"
              color="text-dark-gray-400"
              classNames="text-right"
            >
              {timeDiff(item?.createdAt)}
            </Text>
          </div>
          {!isTruckOffer && (
            <div className="flex items-center justify-between gap-3 mb-2">
              <Text variant="pxs" color="text-dark-gray-400">
                Volume Requested
              </Text>
              <Text variant="pxs" color="text-dark-gray-400">
                {formatNumber((offer as OfferDto)?.volume || 0)} Ltr
              </Text>
            </div>
          )}
          {isTruckOffer && truckDetails && (
            <>
              <div className="flex items-center justify-between gap-3 mb-2">
                <Text variant="pxs" color="text-dark-gray-400">
                  Ref No.
                </Text>
                <Text variant="pxs" color="text-dark-gray-400">
                  {truckDetails?.refNo}
                </Text>
              </div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <Text variant="pxs" color="text-dark-gray-400">
                  Capacity
                </Text>
                <Text variant="pxs" color="text-dark-gray-400">
                  {truckDetails.capacity} Ltrs
                </Text>
              </div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <Text variant="pxs" color="text-dark-gray-400">
                  Destination
                </Text>
                <Text variant="pxs" color="text-dark-gray-400">
                  {truckDetails.destination}
                </Text>
              </div>
              <div className="flex items-center justify-between gap-3 mb-2">
                <Text variant="pxs" color="text-dark-gray-400">
                  Loading Depot
                </Text>
                <Text variant="pxs" color="text-dark-gray-400">
                  {truckDetails.loadingDepot}
                </Text>
              </div>
              {/* <div className="flex items-center justify-between gap-3 mb-2">
                <Text variant="pxs" color="text-dark-gray-400">
                  State
                </Text>
                <Text variant="pxs" color="text-dark-gray-400">
                  {truckDetails.state}
                </Text>
              </div> */}
              {/* <div className="flex items-center justify-between gap-3 mb-2">
                <Text variant="pxs" color="text-dark-gray-400">
                  City
                </Text>
                <Text variant="pxs" color="text-dark-gray-400">
                  {truckDetails.city}
                </Text>
              </div> */}
              <div className="flex items-center justify-between gap-3 mb-2">
                <Text variant="pxs" color="text-dark-gray-400">
                  Loading Date
                </Text>
                <Text variant="pxs" color="text-dark-gray-400">
                  {truckDetails.loadingDate
                    ? new Date(truckDetails.loadingDate).toLocaleDateString()
                    : ''}
                </Text>
              </div>
            </>
          )}
          <div className="flex items-center justify-between gap-3">
            <Text variant="pxs" color="text-dark-gray-400">
              Offer Price
            </Text>
            <Text variant="ps" fontWeight="bold" color="text-deep-gray-300">
              ₦{formatNumber(getOfferPrice(), true)}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offer;
