// import { Text } from '@/components/atoms/text';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { MessageDto } from '@/types/message.type';
// import { OfferDto } from '@/types/offer.types';
// import { ProductUploadDto } from '@/types/product-upload.types';
// import { ProductDto } from '@/types/product.types';
// import { TruckOfferDto } from '@/types/truckOffer.types';
// import { formatNumber } from '@/utils/formatNumber';
// import { FGFlask } from '@fg-icons';
// import React from 'react';
// import { statusVariants } from '../offer-action';
// import { cn } from '@/lib/utils';
// import { UserType } from '@/types/user.types';
// import { timeDiff } from '@/utils/formatDate';

// type OfferActionProps = {
//   item: MessageDto | any; // Allow any for truck messages
//   offer?: any;
//   userId?: string;
// };

// const CounterOffer: React.FC<OfferActionProps> = ({ item, offer, userId }) => {
//   console.log(item, 'item in counter offer', offer, userId);

//   const me = userId === (item?.userId as UserType)?._id;
//   const initials =
//     (item.userId as UserType)?.firstName?.substring(0, 1) +
//     (item.userId as UserType)?.lastName?.substring(0, 1);

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
//     <div>
//       {!me && (
//         <div className="flex items-center gap-3 mb-3">
//           <Avatar className="h-[32px] w-[32px] border border-gold">
//             <AvatarImage src="" className="object-cover" />
//             <AvatarFallback>{initials}</AvatarFallback>
//           </Avatar>
//           <Text variant="pxs" color="text-dark-gray-400">
//             {timeDiff(item.createdAt as string)}
//           </Text>
//         </div>
//       )}
//       <div
//         className={cn(
//           'mb-3 flex items-center gap-2 bg-[#DEE0E51A] border border-green-tone-200 rounded-xl p-3 max-w-[255px]',
//           me ? 'ml-auto' : 'mr-auto',
//         )}
//       >
//         <span className="h-[30px] w-[30px] rounded-[5px] flex items-center justify-center bg-blue-tone-100">
//           <FGFlask color="#1868DB" height={16} width={16} />
//         </span>
//         <div>
//           <Text
//             variant="pxs"
//             fontWeight="medium"
//             color="text-dark-gray-400"
//             classNames="uppercase"
//           >
//             {getProductValue()}
//           </Text>
//           <Text variant="pxs" color="text-dark-gray-400">
//             Counter offer made
//           </Text>
//         </div>
//         <Text
//           variant="pxs"
//           color={cn(
//             statusVariants[item.status as keyof typeof statusVariants]
//               ?.className,
//           )}
//           fontWeight="semibold"
//           classNames="ml-auto self-end"
//         >
//           ₦{formatNumber(getOfferAmount(), true)}
//         </Text>
//       </div>
//     </div>
//   );
// };

// export default CounterOffer;



import { Text } from '@/components/atoms/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatNumber } from '@/utils/formatNumber';
import { FGFlask } from '@fg-icons';
import React from 'react';
import { cn } from '@/lib/utils';
import { timeDiff } from '@/utils/formatDate';
import { Truck } from 'lucide-react';

type CounterOfferProps = {
  item: any;
  offer?: any;
  userId?: string;
};

const CounterOffer: React.FC<CounterOfferProps> = ({ item, offer, userId }) => {
  const isMyMessage = userId === item?.userId?._id;
  const initials =
    item.userId?.firstName?.substring(0, 1) +
    item.userId?.lastName?.substring(0, 1);
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
    <div className="mb-4">
      {!isMyMessage && (
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-[32px] w-[32px] border border-gold">
            <AvatarImage src="" className="object-cover" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <Text variant="pxs" color="text-dark-gray-400">
            {timeDiff(item.createdAt)}
          </Text>
        </div>
      )}

      <div
        className={cn(
          'flex items-center gap-2 bg-[#DEE0E51A] border border-green-tone-200 rounded-xl p-3 max-w-[280px]',
          isMyMessage ? 'ml-auto' : 'mr-auto',
        )}
      >
        <span className="h-[30px] w-[30px] rounded-[5px] flex items-center justify-center bg-blue-tone-100">
          {isTruckOffer ? (
            <Truck color="#1868DB" height={16} width={16} />
          ) : (
            <FGFlask color="#1868DB" height={16} width={16} />
          )}
        </span>

        <div className="flex-1">
          <Text
            variant="pxs"
            fontWeight="medium"
            color="text-dark-gray-400"
            classNames="uppercase"
          >
            {getProductValue()}
          </Text>
          <Text variant="pxs" color="text-dark-gray-400">
            Counter offer made
          </Text>
        </div>

        <Text
          variant="pxs"
          color="text-blue-tone-600"
          fontWeight="semibold"
          classNames="self-end"
        >
          ₦{formatNumber(getOfferAmount(), true)}
        </Text>
      </div>

      {isMyMessage && (
        <Text
          variant="pxs"
          color="text-dark-gray-400"
          classNames="text-right mt-1"
        >
          {timeDiff(item.createdAt)}
        </Text>
      )}
    </div>
  );
};

export default CounterOffer;