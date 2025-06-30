import { Text } from '@/components/atoms/text';
import { cn } from '@/lib/utils';
import { MessageDto } from '@/types/message.type';
import { OfferDto } from '@/types/offer.types';
import { ProductUploadDto } from '@/types/product-upload.types';
import { ProductDto } from '@/types/product.types';
import { timeDiff } from '@/utils/formatDate';
import { formatNumber } from '@/utils/formatNumber';
import { FGFlask } from '@fg-icons';
import React, { HTMLProps } from 'react';
// TODO: create storybook for this component
// TODO: create props and extend it
type OfferActionProps = {
  item: MessageDto;
  offer?: OfferDto;
  className?: HTMLProps<HTMLElement>['className'];
};
const Offer: React.FC<OfferActionProps> = ({ item, offer, className }: any) => {
  return (
    <div className={cn(className)}>
      <div className="bg-[#DEE0E51A] border border-green-tone-200 rounded-xl p-3 ml-auto max-w-[255px]">
        <div className="mb-3 flex items-center gap-2">
          <span className="h-[30px] w-[30px] rounded-[5px] flex items-center justify-center bg-green-tone-100">
            <FGFlask color="#50CD89" height={16} width={16} />
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
              Opening Price:
            </Text>
          </div>
          <Text
            variant="pxs"
            color="text-red-tone-600"
            fontWeight="semibold"
            classNames="ml-auto self-end"
          >
            ₦
            {formatNumber(
              (offer?.productUploadId as ProductUploadDto)?.price,
              true,
            )}
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
          <div className="flex items-center justify-between gap-3 mb-2">
            <Text variant="pxs" color="text-dark-gray-400">
              Volume Requested
            </Text>
            <Text variant="pxs" color="text-dark-gray-400">
              {formatNumber(offer?.volume)} Ltr
            </Text>
          </div>
          <div className="flex items-center justify-between gap-3">
            <Text variant="pxs" color="text-dark-gray-400">
              Offer Price
            </Text>
            <Text variant="ps" fontWeight="bold" color="text-deep-gray-300">
              ₦{formatNumber(item?.offer, true)}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Offer;
