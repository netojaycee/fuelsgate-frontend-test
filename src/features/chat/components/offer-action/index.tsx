// import { Text } from '@/components/atoms/text';
// import { cn } from '@/lib/utils';
// import { MessageDto } from '@/types/message.type';
// import { OfferDto } from '@/types/offer.types';
// import { ProductUploadDto } from '@/types/product-upload.types';
// import { ProductDto } from '@/types/product.types';
// import { TruckOfferDto } from '@/types/truckOffer.types';
// import { UserType } from '@/types/user.types';
// import { formatNumber } from '@/utils/formatNumber';
// import React from 'react';

// export const statusVariants = {
//   pending: { text: 'made', className: '' },
//   accepted: { text: 'accepted', className: 'text-green-tone-500' },
//   rejected: { text: 'rejected', className: 'text-red-tone-500' },
// };

// type OfferActionProps = {
//   item: MessageDto | any; // Allow any for truck messages
//   offer?: any;
//   userId?: string;
//   first?: boolean;
// };

// const OfferAction: React.FC<OfferActionProps> = ({
//   item,
//   offer,
//   userId,
//   first,
// }) => {
//   const messages = {
//     pending: 'made an',
//     accepted: 'accepted',
//     rejected: 'rejected',
//   };

//   const me = userId === (item?.userId as UserType)?._id;
//   const isActionByMe = userId === (item?.userId as UserType)?._id;
//   // const isActionByMe = userId === (item?.actionBy as UserType)?._id;

//   // Check if this is a truck offer
//   const isTruckOffer = offer?.type === 'truck';

//   // Get the product value
//   const getProductValue = () => {
//     if (isTruckOffer) {
//       return 'TRUCK SERVICE';
//     }
//     const productId = ((offer as OfferDto)?.productUploadId as ProductUploadDto)
//       ?.productId;
//     return typeof productId === 'object'
//       ? (productId as ProductDto)?.value
//       : productId;
//   };

//   // Get the offer amount
//   const getOfferAmount = () => {
    
//     return item?.offerPrice;
//   };

//   return (
//     <div
//       className={cn(
//         'rounded-2xl bg-[#DEE0E52B] p-4 w-fit mb-2.5',
//         isActionByMe ? 'rounded-bl-none mr-auto' : 'rounded-br-none m-auto',
//       )}
//     >
//       <Text variant="ps" color="text-deep-gray-300">
//         {item?.status === 'accepted'
//           ? isActionByMe
//             ? 'You'
//             : (item?.actionBy as UserType)?.firstName
//           : me
//           ? 'You'
//           : (item?.userId as UserType)?.firstName}{' '}
//         <span
//           className={cn(
//             statusVariants[item.status as keyof typeof statusVariants]
//               ?.className,
//           )}
//         >
//           {
//             messages[
//               first ? 'pending' : (item?.status as keyof typeof messages)
//             ]
//           }
//         </span>{' '}
//         offer of <b>₦{formatNumber(getOfferAmount(), true)}</b> for{' '}
//         <b className="uppercase">{getProductValue()}</b>
//       </Text>
//     </div>
//   );
// };

// export default OfferAction;


import { Text } from '@/components/atoms/text';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/utils/formatNumber';
import React from 'react';

export const statusVariants = {
  pending: { text: 'made', className: '' },
  accepted: { text: 'accepted', className: 'text-green-tone-500' },
  rejected: { text: 'rejected', className: 'text-red-tone-500' },
};

type OfferActionProps = {
  item: any;
  offer?: any;
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

  const isActionByMe = userId === item?.userId?._id;
  const isTruckOffer = offer?.type === 'truck';

  const getProductValue = () => {
    if (isTruckOffer) {
      return 'TRUCK SERVICE';
    }
    return offer?.productUploadId?.productId?.value || 'PRODUCT';
  };

  const getOfferAmount = () => {
    return item?.offerPrice || 0;
  };

  return (
    <div
      className={cn(
        'rounded-2xl bg-[#DEE0E52B] p-4 w-fit mb-2.5 max-w-md',
        isActionByMe ? 'rounded-bl-none mr-auto' : 'rounded-br-none m-auto',
      )}
    >
      <Text variant="ps" color="text-deep-gray-300">
        {isActionByMe ? 'You' : item?.userId?.firstName}{' '}
        <span
          className={cn(
            statusVariants[
              first ? 'pending' : (item?.status as keyof typeof statusVariants)
            ]?.className,
          )}
        >
          {
            messages[
              first ? 'pending' : (item?.status as keyof typeof messages)
            ]
          }
        </span>{' '}
        offer of <b>₦{formatNumber(getOfferAmount(), true)}</b> for{' '}
        <b className="uppercase">{getProductValue()}</b>
      </Text>
    </div>
  );
};

export default OfferAction;