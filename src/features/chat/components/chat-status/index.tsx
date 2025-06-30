import CustomButton from '@/components/atoms/custom-button';
import useOfferHook from '@/hooks/useOffer.hook';
import { Check, X } from 'lucide-react';
import React from 'react';

type ChatStatusProps = {
  messageId: string;
  offerId: string;
};
const ChatStatus: React.FC<ChatStatusProps> = ({ messageId, offerId }) => {
  const { useUpdateOfferStatus, useUpdateMessageStatus } = useOfferHook();
  const { mutateAsync: updateMessageStatus, isPending: isUpdatingMessage } =
    useUpdateMessageStatus(messageId);
  const { mutateAsync: updateOfferStatus, isPending: isUpdatingOffer } =
    useUpdateOfferStatus(offerId);

  const handleAcceptClick = async () => {
    await updateMessageStatus({
      status: 'accepted',
    });
    await updateOfferStatus({
      status: 'completed',
    });
  };

  const handleRejectClick = async () => {
    await updateMessageStatus({
      status: 'rejected',
    });
  };

  return (
    <div className="flex flex-wrap justify-end gap-4 items-center px-6 py-6 max-sm:px-3 border-t border-[#DEE0E566]">
      <CustomButton
        variant="primary"
        bgColor="bg-red-tone-200 hover:bg-red-700"
        label="Reject"
        leftIcon={<X />}
        fontSize="text-sm"
        classNames="rounded-lg gap-1 px-4 py-[10px]"
        height="h-11"
        width="w-fit"
        onClick={handleRejectClick}
        loading={isUpdatingMessage}
      />
      <CustomButton
        variant="primary"
        bgColor="bg-green-tone-500 hover:bg-green-700"
        label="Accept"
        leftIcon={<Check />}
        fontSize="text-sm"
        classNames="rounded-lg gap-1 px-4 py-[10px]"
        height="h-11"
        width="w-fit"
        onClick={handleAcceptClick}
        loading={isUpdatingMessage || isUpdatingOffer}
      />
    </div>
  );
};

export default ChatStatus;
