import { Text } from '@/components/atoms/text';
import { cn } from '@/lib/utils';
import { MessageDto } from '@/types/message.type';
import { OfferDto } from '@/types/offer.types';
import { ProductUploadDto } from '@/types/product-upload.types';
import { ProductDto } from '@/types/product.types';
import { UserType } from '@/types/user.types';
import { formatNumber } from '@/utils/formatNumber';
import React from 'react';
// TODO: create storybook for this component
// TODO: create props and extend it

export const statusVariants = {
  pending: { text: 'made', className: '' },
  accepted: { text: 'accepted', className: 'text-green-tone-500' },
  rejected: { text: 'rejected', className: 'text-red-tone-500' },
};

type OfferActionProps = {
  item: MessageDto;
  offer?: OfferDto;
  userId?: string;
  first?: boolean;
};
const OfferAction: React.FC<OfferActionProps> = ({
  item,
  offer,
  userId,
  first,
}) => {
  const messages = {
    pending: 'made an',
    accepted: 'accepted',
    rejected: 'rejected',
  };
  const me = userId === (item?.userId as UserType)?._id;
  const isActionByMe = userId === (item?.actionBy as UserType)?._id;

  return (
    <div
      className={cn(
        'rounded-2xl bg-[#DEE0E52B] p-4 w-fit mb-2.5',
        isActionByMe ? 'rounded-bl-none mr-auto' : 'rounded-br-none ml-auto',
      )}
    >
      <Text variant="ps" color="text-deep-gray-300">
        {item?.status === 'accepted'
          ? isActionByMe
            ? 'You'
            : (item?.actionBy as UserType)?.firstName
          : me
            ? 'You'
            : (item?.userId as UserType)?.firstName}{' '}
        <span className={cn(statusVariants[item.status].className)}>
          {messages[first ? 'pending' : item?.status]}
        </span>{' '}
        offer of <b>₦{formatNumber(item.offer, true)}</b> for{' '}
        <b className="uppercase">
          {
            (
              (offer?.productUploadId as ProductUploadDto)
                ?.productId as ProductDto
            )?.value
          }
        </b>
      </Text>
    </div>
  );
};

export default OfferAction;
