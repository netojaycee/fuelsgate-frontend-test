import CustomButton from '@/components/atoms/custom-button';
import { ModalContext } from '@/contexts/ModalContext';
import { cn } from '@/lib/utils';
import { FGBuyerOffer } from '@fg-icons';
import React, { useContext, useEffect, useState } from 'react';
import { MAKE_AN_OFFER } from '@/modals/make-an-offer-modal';
import { AuthContext } from '@/contexts/AuthContext';
import { OfferDto } from '@/types/offer.types';
import { useRouter } from 'next/navigation';
import { OrderDto } from '@/types/order.types';

type OfferBtnProps = {
  price: string;
  receiverId: string;
  productUploadId: string;
  buyerOffer: OfferDto[];
  orders: OrderDto[];
};

const OfferBtn = ({
  price,
  receiverId,
  productUploadId,
  buyerOffer,
  orders,
}: OfferBtnProps) => {
  const { handleToggle } = useContext(ModalContext);
  const { user, profile } = useContext(AuthContext);
  const userId = user?.data?._id;
  const profileId = profile?._id;
  const [offerStatus, setOfferStatus] = useState<boolean>(false);
  const [orderStatus, setOrderStatus] = useState<boolean>(false);
  const [offerId, setOfferId] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (userId) {
      setOfferStatus(buyerOffer.map((item) => item.senderId).includes(userId));
      setOrderStatus(orders?.map((item) => item.buyerId).includes(profileId));
      setOfferId(
        buyerOffer.find((item) => item.senderId === userId)?._id ?? '',
      );
    }
  }, [userId, buyerOffer, orders, profileId]);

  const handleOnClick = () => {
    if (offerStatus === false) {
      handleToggle &&
        handleToggle({
          state: true,
          name: MAKE_AN_OFFER,
          data: { price, receiverId, productUploadId },
        });
    } else {
      router.push(`/dashboard/chat/${offerId}`);
    }
  };

  return !orderStatus ? (
    <CustomButton
      variant="white"
      classNames="gap-1.5"
      label={cn(offerStatus ? 'Ongoing' : 'Make Offer')}
      leftIcon={
        <FGBuyerOffer color={cn(offerStatus ? '#375DFB' : '#666666')} />
      }
      height="h-[38px]"
      border="border-mid-gray-400 border"
      color={cn(offerStatus ? 'text-blue-tone-450' : 'text-dark-gray-400')}
      rightIcon={
        offerStatus ? (
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

export { OfferBtn };
