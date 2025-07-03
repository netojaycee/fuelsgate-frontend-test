import { cn } from '@/lib/utils';
import React, { useContext, useEffect, useState } from 'react';
import { ModalContext } from '@/contexts/ModalContext';
import { LockKeyhole, LockKeyholeOpen, Quote, Receipt } from 'lucide-react';
import CustomButton from '@/components/atoms/custom-button';
import { ORDER_SUMMARY } from '@/modals/order-summary-modal';
import { AuthContext } from '@/contexts/AuthContext';
import { OrderDto } from '@/types/order.types';
import { SellerDto } from '@/features/authentication/types/onboarding.types';
import { useRouter } from 'next/navigation';
import { LOCK_TRUCK } from '@/modals/lock-truck-modal';
import { TruckDto } from '@/features/transporter-dashboard/types/truck.type';
import { DepotHubDto } from '@/types/depot-hub.types';
import { ProductDto } from '@/types/product.types';
import { BuyerContext } from '../../contexts/BuyerContext';

type LockBtnProps = {
  orders?: OrderDto[];
  price?: number;
  truck?: TruckDto;
  productUploadId?: string;
  sellerId?: SellerDto | string;
  affix: 'Volume' | 'Truck';
  disabled?: boolean;
};

const LockBtn = ({
  orders,
  truck,
  price,
  productUploadId,
  sellerId,
  affix,
  disabled
}: LockBtnProps) => {
  const { handleToggle } = useContext(ModalContext);
  const { profile } = useContext(AuthContext);
  const { selectedState, selectedLGA } = useContext(BuyerContext);
  const profileId = profile?._id;
  const [orderStatus, setOrderStatus] = useState<boolean>(false);
  const [orderId, setOrderId] = useState('');
  const [isHovered, setIsHovered] = useState(false); // Hover state
  const router = useRouter();

  let availability: string | undefined,
    truckId: string | undefined,
    truckNumber: string | undefined,
    truckSize: string | undefined,
    depotHub: string | undefined,
    product: ProductDto | undefined;

  if (affix === 'Truck') {
    availability = truck?.status;
    truckId = truck?._id;
    truckNumber = truck?.truckNumber;
    truckSize = truck?.capacity;
    depotHub = (truck?.depotHubId as DepotHubDto).name;
    product = truck?.productId as ProductDto;
  }

  useEffect(() => {
    if (profileId && orders) {
      setOrderStatus(
        orders
          ?.filter((item) => item.status !== 'completed')
          ?.map((item) => item.buyerId)
          .includes(profileId),
      );
      setOrderId(
        orders
          ?.filter((item) => item.status !== 'completed')
          ?.find((item) => item.buyerId === profileId)?._id ?? '',
      );
    }
  }, [profileId, orders]);

  const handleOnClick = () => {
    if (affix === 'Volume') {
      if (orderStatus === false) {
        handleToggle &&
          handleToggle({
            state: true,
            name: ORDER_SUMMARY,
            data: { price, productUploadId, sellerId },
          });
      } else {
        router.push(`/dashboard/my-orders`);
      }
    } else if (affix === 'Truck') {
      if (availability === 'available') {
        handleToggle &&
          handleToggle({
            state: true,
            name: LOCK_TRUCK,
            data: {
              truckId,
              truckNumber,
              depotHub,
              product,
              truckSize,
              state: selectedState?.value,
              city: selectedLGA?.value,
            },
          });
      } else {
        router.push(`/dashboard/my-rfq`);
      }
    }
  };

  // console.log(truck, "Ffff")

  return (
    <CustomButton
      disabled={disabled}
      variant={cn(orderStatus ? 'primary' : 'white')}
      classNames={cn(
        'gap-1.5',
        orderStatus
          ? 'relative z-[1] before:z-0 before:absolute before:bg-black/20 before:rounded-full before:animate-ping before:h-full before:w-full'
          : '',
      )}
      label={cn(
        orderStatus && isHovered
          ? 'View Orders'
          : orderStatus
            ? 'Locked'
            : affix === 'Volume' ? 'Lock Volume' : "Request Quote",
      )}
      leftIcon={
        orderStatus ? (
          !isHovered ? (
            <LockKeyhole
              className="shrink-0"
              height={18}
              width={18}
              color="#fff"
            />
          ) : undefined
        ) : (
          // <LockKeyholeOpen
          //   className="shrink-0"
          //   height={18}
          //   width={18}
          //   color="#666666"
          // />
          <Receipt
            className="shrink-0"
            height={18}
            width={18}
            color="#666666"
          />
        )
      }
      height="h-[38px]"
      border="border-mid-gray-400 border"
      fontSize="text-xs"
      fontWeight="medium"
      width="w-[122px]"
      onClick={handleOnClick}
      onMouseLeave={() => setIsHovered(false)}
      onMouseEnter={() => setIsHovered(true)}
    />
  );
};

export { LockBtn };
