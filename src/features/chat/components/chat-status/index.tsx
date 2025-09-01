// import CustomButton from '@/components/atoms/custom-button';
// import { AuthContext } from '@/contexts/AuthContext';
// import useOfferHook from '@/hooks/useOffer.hook';
// import useTruckOfferHook from '@/hooks/useTruckOffer.hook';
// import { DASHBOARD, RFQ } from '@/routes';
// import { Check, X } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import React, { useContext } from 'react';

// type ChatStatusProps = {
//   // messageId: string;
//   // offerId: string;
//   // chatType?: 'order' | 'truck';
//   // truckOfferAmount?: number;
//   onReject?: () => void;
//   onAccept?: () => void;
// };

// const ChatStatus: React.FC<ChatStatusProps> = ({
//   // messageId,
//   // offerId,
//   // chatType = 'order',
//   // truckOfferAmount = 0,
//   onReject,
//   onAccept,
// }) => {
//   return (
//     <div className="flex flex-wrap justify-end gap-4 items-center px-6 py-6 max-sm:px-3 border-t border-[#DEE0E566]">
//       <CustomButton
//         variant="primary"
//         bgColor="bg-red-tone-200 hover:bg-red-700"
//         label="Reject"
//         leftIcon={<X />}
//         fontSize="text-sm"
//         classNames="rounded-lg gap-1 px-4 py-[10px]"
//         height="h-11"
//         width="w-fit"
//         onClick={onReject}
//       />
//       <CustomButton
//         variant="primary"
//         bgColor="bg-green-tone-500 hover:bg-green-700"
//         label="Accept"
//         leftIcon={<Check />}
//         fontSize="text-sm"
//         classNames="rounded-lg gap-1 px-4 py-[10px]"
//         height="h-11"
//         width="w-fit"
//         onClick={onAccept}
//       />
//     </div>
//   );
// };

// export default ChatStatus;


import CustomButton from '@/components/atoms/custom-button';
import React from 'react';

interface ChatStatusProps {
  onAccept: () => void;
  onReject: () => void;
  disabled?: boolean;
  isAcceptingNegotiation?: boolean;
}

const ChatStatus: React.FC<ChatStatusProps> = ({
  onAccept,
  onReject,
  isAcceptingNegotiation,
  disabled = false,
}) => {
  return (
    <div className="flex items-center gap-3 justify-center py-4 border-t border-gray-200">
      <CustomButton
        variant="secondary"
        label="Reject & Counter"
        fontSize="text-sm"
        classNames="rounded-lg px-6 py-2"
        height="h-10"
        width="w-fit"
        onClick={onReject}
        disabled={disabled}
      />
      <CustomButton
        variant="primary"
        label="Accept Offer"
        fontSize="text-sm"
        classNames="rounded-lg px-6 py-2"
        height="h-10"
        width="w-fit"
        loading={isAcceptingNegotiation}
        onClick={onAccept}
        disabled={disabled}
      />
    </div>
  );
};

export default ChatStatus;