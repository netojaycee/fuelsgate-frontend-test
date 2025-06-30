import { Text } from '@/components/atoms/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AuthContext } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { CHAT, CHAT_DETAILS } from '@/routes';
import { OfferDto } from '@/types/offer.types';
import { UserType } from '@/types/user.types';
import { timeDiff, timeDiff2 } from '@/utils/formatDate';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';

// TODO: create storybook for this component
// TODO: create props and extend it
type ChatPreviewProps = {
  data: OfferDto;
};
const ChatPreview: React.FC<ChatPreviewProps> = ({ data }) => {
  const { user } = useContext(AuthContext);
  const userId = user?.data?._id;
  const [fullName, setFullName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [initials, setInitials] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const receiver = data.receiverDetails as UserType;
    const sender = data.senderDetails as UserType;

    if (userId === sender?._id) {
      setFullName(`${receiver?.firstName} ${receiver?.lastName}`);
      setFirstName(receiver?.firstName);
      setInitials(
        `${receiver?.firstName.substring(0, 1)}${receiver?.lastName.substring(0, 1)}`,
      );
    } else if (userId === receiver?._id) {
      setFullName(`${sender?.firstName} ${sender?.lastName}`);
      setFirstName(sender?.firstName);
      setInitials(
        `${sender?.firstName.substring(0, 1)}${sender?.lastName.substring(0, 1)}`,
      );
    }
  }, [data, userId]);

  useEffect(() => {
    const lastMessage = data.lastMessage;
    if (lastMessage?.status === 'pending') {
      if (lastMessage.userId === userId) {
        setMessage(`Offer sent`);
      } else {
        setMessage(`${firstName} made an offer`);
      }
    } else if (lastMessage?.status === 'accepted') {
      setMessage(`Offer accepted`);
    } else if (lastMessage?.status === 'rejected') {
      setMessage(`Offer rejected`);
    }
  }, [firstName, data, userId]);

  return (
    <Link
      href={data?._id ? CHAT_DETAILS.replace('[chatId]', data?._id) : CHAT}
      className="flex mb-3 items-center gap-3 border border-light-gray-350 bg-light-gray-200 rounded-lg p-3"
    >
      <Avatar className="h-[51px] w-[51px] border">
        <AvatarImage src="" className="object-cover" />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="flex items-start justify-between grow gap-3">
        <div>
          <Text
            variant="pm"
            fontWeight="medium"
            color="text-deep-gray-300"
            classNames="mb-1 line-clamp-1"
          >
            {fullName}
          </Text>
          <Text
            variant="pxs"
            color={cn(
              data.lastMessage?.status === 'accepted'
                ? 'text-green-tone-500'
                : data.lastMessage?.status === 'rejected'
                  ? 'text-red-tone-250'
                  : 'text-dark-gray-100',
            )}
            classNames="line-clamp-1"
          >
            {message}
          </Text>
        </div>
        <Text
          variant="pxs"
          color="text-dark-gray-100"
          classNames="mt-1 text-right"
        >
          {data.lastMessage?.updatedAt &&
            timeDiff2(data.lastMessage?.updatedAt)}
        </Text>
      </div>
    </Link>
  );
};

export { ChatPreview };
