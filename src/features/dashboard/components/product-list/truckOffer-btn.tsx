import CustomButton from '@/components/atoms/custom-button';
import { ModalContext } from '@/contexts/ModalContext';
import { cn } from '@/lib/utils';
import { FGBuyerOffer } from '@fg-icons';
import React, { useContext, useEffect, useState } from 'react';
import { MAKE_A_TRUCK_OFFER } from '@/modals/make-a-truck-offer-modal';
import { AuthContext } from '@/contexts/AuthContext';
import { TruckOfferDto } from '@/types/truckOffer.types';
import { useRouter } from 'next/navigation';
import { TruckOrderDto } from '@/types/truckOrder.types';

type TruckOfferBtnProps = {
  price: string;
  receiverId: string;
  truckId: string;
  buyerOffer: TruckOfferDto[];
  truckOrders: TruckOrderDto[];
};

const TruckOfferBtn = ({
  price,
  receiverId,
  truckId,
  buyerOffer,
  truckOrders,
}: TruckOfferBtnProps) => {
  const { handleToggle } = useContext(ModalContext);
  const { user, profile } = useContext(AuthContext);
  const userId = user?.data?._id;
  const profileId = profile?._id;
  const [truckOfferStatus, setTruckOfferStatus] = useState<boolean>(false);
  const [truckOrderStatus, setTruckOrderStatus] = useState<boolean>(false);
  const [truckOfferId, setTruckOfferId] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      setTruckOfferStatus(buyerOffer.map((item) => item.senderId).includes(userId));
      setTruckOrderStatus(truckOrders?.map((item) => item.buyerId).includes(profileId));
      setTruckOfferId(
        buyerOffer.find((item) => item.senderId === userId)?._id ?? '',
      );
    }
  }, [userId, buyerOffer, truckOrders, profileId]);

  const handleOnClick = () => {
    if (truckOfferStatus === false) {
      handleToggle &&
        handleToggle({
          state: true,
          name: MAKE_A_TRUCK_OFFER,
          data: { price, receiverId, truckId },
        });
    } else {
      router.push(`/dashboard/chat/${truckOfferId}`);
    }
  };

  return !truckOrderStatus ? (
    <CustomButton
      variant="white"
      classNames="gap-1.5"
      label={cn(truckOfferStatus ? 'Ongoing' : 'Make Offer')}
      leftIcon={
        <FGBuyerOffer color={cn(truckOfferStatus ? '#375DFB' : '#666666')} />
      }
      height="h-[38px]"
      border="border-mid-gray-400 border"
      color={cn(truckOfferStatus ? 'text-blue-tone-450' : 'text-dark-gray-400')}
      rightIcon={
        truckOfferStatus ? (
          <div className="bg-blue-tone-450 h-[10px] w-[10px] rounded-full shrink-0" />
        ) : undefined
      }
      fontSize="text-xs"
      fontWeight="medium"
      width="w-[119px]"
      onClick={handleOnClick}
    />
  ) : (
    <>&ndash;</>
  );
};

export { TruckOfferBtn };
