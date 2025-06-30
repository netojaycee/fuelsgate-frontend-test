import { Text } from '@/components/atoms/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageDto } from '@/types/message.type';
import { OfferDto } from '@/types/offer.types';
import { ProductUploadDto } from '@/types/product-upload.types';
import { ProductDto } from '@/types/product.types';
import { formatNumber } from '@/utils/formatNumber';
import { FGFlask } from '@fg-icons';
import React from 'react';
import { statusVariants } from '../offer-action';
import { cn } from '@/lib/utils';
import { UserType } from '@/types/user.types';
import { timeDiff } from '@/utils/formatDate';
// TODO: create storybook for this component
// TODO: create props and extend it
type OfferActionProps = {
  item: MessageDto;
  offer?: OfferDto;
  userId?: string;
};
const CounterOffer: React.FC<OfferActionProps> = ({ item, offer, userId }) => {
  const me = userId === (item?.userId as UserType)?._id;
  const initials =
    (item.userId as UserType)?.firstName.substring(0, 1) +
    (item.userId as UserType)?.lastName.substring(0, 1);

  return (
    <div>
      {!me && (
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-[32px] w-[32px] border border-gold">
            <AvatarImage src="" className="object-cover" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <Text variant="pxs" color="text-dark-gray-400">
            {timeDiff(item.createdAt as string)}
          </Text>
        </div>
      )}
      <div
        className={cn(
          'mb-3 flex items-center gap-2 bg-[#DEE0E51A] border border-green-tone-200 rounded-xl p-3 max-w-[255px]',
          me ? 'ml-auto' : 'mr-auto',
        )}
      >
        <span className="h-[30px] w-[30px] rounded-[5px] flex items-center justify-center bg-blue-tone-100">
          <FGFlask color="#1868DB" height={16} width={16} />
        </span>
        <div>
          <Text
            variant="pxs"
            fontWeight="medium"
            color="text-dark-gray-400"
            classNames="uppercase"
          >
            {
              (
                (offer?.productUploadId as ProductUploadDto)
                  ?.productId as ProductDto
              )?.value
            }
          </Text>
          <Text variant="pxs" color="text-dark-gray-400">
            Counter offer made
          </Text>
        </div>
        <Text
          variant="pxs"
          color={cn(statusVariants[item.status].className)}
          fontWeight="semibold"
          classNames="ml-auto self-end"
        >
          ₦{formatNumber(item.offer, true)}
        </Text>
      </div>
    </div>
  );
};

export default CounterOffer;
