'use client';
import CustomButton from '@/components/atoms/custom-button';
import CustomInput from '@/components/atoms/custom-input';
import CustomLoader from '@/components/atoms/custom-loader';
import { Text } from '@/components/atoms/text';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/contexts/AuthContext';
import ChatStatus from '@/features/chat/components/chat-status';
import CounterOffer from '@/features/chat/components/counter-offer';
import Offer from '@/features/chat/components/offer';
import OfferAction from '@/features/chat/components/offer-action';
import {
  StatusText,
  StatusTypes,
} from '@/features/transporter-dashboard/components/truck-order-list/status-text';
import useOfferHook from '@/hooks/useOffer.hook';
import useOrderHook from '@/hooks/useOrder.hook';
import { cn } from '@/lib/utils';
import { MessageDto } from '@/types/message.type';
import { OfferDto, OfferStatus, SendMessageDto } from '@/types/offer.types';
import { ProductUploadDto } from '@/types/product-upload.types';
import { UserType } from '@/types/user.types';
import { renderErrors } from '@/utils/renderErrors';
import { messageSchema } from '@/validations/message.validation';
import { FGInfoFill, FGPaperPlane } from '@fg-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoaderCircle } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

const ChatDetails = () => {
  const params = useParams();
  const { useFetchMessages, useSendNewMessage, useUpdateOfferStatus } =
    useOfferHook();
  const messageContainer = useRef<HTMLDivElement | null>(null);

  const {
    data: messageList,
    isLoading: fetchingMessages,
    isFetchingNextPage,
    fetchNextPage: fetchMessageNextPage,
  } = useFetchMessages(params?.chatId as string, '?limit=20&page=');

  const { mutateAsync: sendMessage, isPending: isSending } =
    useSendNewMessage();

  const { useCreateOrder } = useOrderHook();

  const { user } = useContext(AuthContext);
  const userId = user?.data?._id;
  const role = user?.data?.role;
  const [fullName, setFullName] = useState('');
  const [initials, setInitials] = useState('');
  const [offer, setOffer] = useState<
    (OfferDto & { firstMessageId: string }) | undefined
  >(undefined);

  const { mutateAsync: createOrder, isPending: isLoading } = useCreateOrder();
  const { mutateAsync: updatedOffer, isPending: updatingOffer } =
    useUpdateOfferStatus(offer?._id as string);

  const {
    setError,
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm<SendMessageDto>({
    resolver: yupResolver(messageSchema),
  });

  useEffect(() => {
    setOffer(messageList?.pages[0].data.offer);
  }, [messageList]);

  useEffect(() => {
    offer?._id && setValue('offerId', offer?._id);
    const receiver = offer?.receiverId as UserType;
    const sender = offer?.senderId as UserType;

    if (userId === sender?._id) {
      setFullName(`${receiver?.firstName} ${receiver?.lastName}`);
      setInitials(
        `${receiver?.firstName.substring(0, 1)}${receiver?.lastName.substring(
          0,
          1,
        )}`,
      );
    } else if (userId === receiver?._id) {
      setFullName(`${sender?.firstName} ${sender?.lastName}`);
      setInitials(
        `${sender?.firstName.substring(0, 1)}${sender?.lastName.substring(
          0,
          1,
        )}`,
      );
    }
  }, [offer, userId, setValue]);

  const onSubmit = async (data: SendMessageDto) => {
    try {
      await sendMessage(data);
    } catch (error: any) {
      renderErrors(error?.errors, setError);
    }
  };

  const handleCreateOrder = async () => {
    if (offer) {
      const order = await createOrder({
        sellerId: (offer.productUploadId as ProductUploadDto)
          ?.sellerId as string,
        productUploadId: (offer.productUploadId as ProductUploadDto)
          ?._id as string,
        price: offer?.lastMessage?.offer as number,
        volume: offer?.volume as number,
      });
      const _offer = await updatedOffer({
        orderId: order.data._id,
        status: offer.status,
      });
      setOffer(_offer.data);
    }
  };

  const mapOfferStatusToStatusText = (
    status: OfferStatus,
  ): StatusTypes | undefined => {
    switch (status) {
      case 'ongoing':
        return 'ongoing';
      case 'completed':
        return 'completed';
      case 'cancelled':
        return 'cancelled';
      default:
        console.log('unexpected status');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (messageContainer.current) {
        if (messageContainer.current.scrollTop === 0) {
          fetchMessageNextPage();
        }
      }
    };

    if (messageContainer.current) {
      messageContainer.current.scrollTop =
        messageContainer.current.scrollHeight;
      messageContainer.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (messageContainer.current) {
        messageContainer.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [fetchMessageNextPage]);

  return (
    <div className="border border-mid-gray-300 rounded-2xl">
      <div className="flex items-center flex-wrap justify-between pl-10 pr-4 py-6 max-sm:px-3 gap-2 border-b border-[#DEE0E566]">
        <div className="flex items-center gap-3">
          <Avatar className="h-[51px] w-[51px] border border-gold">
            <AvatarImage src="" className="object-cover" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <Text variant="pm" fontWeight="medium" color="text-deep-gray-300">
              {fullName}
            </Text>
            <StatusText
              status={
                mapOfferStatusToStatusText(
                  offer?.status as OfferStatus,
                ) as StatusTypes
              }
            />
          </div>
        </div>
        {offer?.lastMessage?.status === 'accepted' &&
          offer?.orderId === null &&
          role === 'buyer' && (
            <div className="flex items-center justify-end p-4">
              <CustomButton
                variant="primary"
                label="Create Order"
                fontSize="text-sm"
                classNames="rounded-lg gap-1 px-4 py-[10px] relative z-[1] before:z-0 before:absolute before:bg-black/20 before:rounded-lg before:animate-ping before:h-full before:w-full"
                height="h-11"
                width="w-fit"
                onClick={handleCreateOrder}
                loading={isLoading || updatingOffer}
              />
            </div>
          )}
      </div>

      {/* MESSAGES */}
      <div
        ref={messageContainer}
        className="max-lg:h-[60vh] h-[50vh] overflow-x-auto py-7 px-10 max-sm:px-3 mb-2"
      >
        {messageList?.pages
          .slice()
          .reverse()
          .map((batch) =>
            batch.data.messages
              .slice()
              .reverse()
              .map((item: MessageDto) => (
                <React.Fragment key={item._id}>
                  {offer?.firstMessageId === item._id ? (
                    <div
                      className={cn(
                        'flex flex-col',
                        (item.userId as UserType)?._id === userId
                          ? 'items-end'
                          : 'items-start',
                      )}
                    >
                      <OfferAction {...{ item, offer, userId }} first={true} />
                      <Offer {...{ item, offer }} />
                    </div>
                  ) : item.status === 'accepted' ? (
                    <OfferAction {...{ item, offer, userId }} />
                  ) : (
                    <CounterOffer {...{ item, offer, userId }} />
                  )}
                </React.Fragment>
              )),
          )}
        {(fetchingMessages || isFetchingNextPage) && <CustomLoader />}
      </div>

      <div className="mb-7 px-10 max-sm:px-3">
        {offer?.lastMessage?.status === 'accepted' &&
          offer?.lastMessage?.userId === userId && (
            <Alert className="rounded-xl bg-blue-tone-50 border-none">
              <FGInfoFill height={20} width={20} color="#375DFB" />
              <AlertDescription className="text-sm text-dark-gray-350 !translate-y-0">
                Contact seller and make all necessary payment and then you can
                close out this order
              </AlertDescription>
            </Alert>
          )}

        {offer?.lastMessage?.status === 'rejected' &&
          offer?.lastMessage?.userId !== userId && (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex items-center border border-mid-gray-300 px-1.5 rounded-lg bg-light-gray-100"
            >
              <CustomInput
                type="number"
                name="offer"
                prefixPadding="pl-10"
                className="border-none bg-transparent"
                placeholder="Enter counter offer"
                classNames="grow"
                prefix="₦"
                register={register}
                error={errors.offer?.message}
              />
              <Button
                className="bg-deep-gray-300 h-10 w-12 rounded-lg"
                disabled={isSending}
                type="submit"
              >
                {isSending ? (
                  <LoaderCircle color="white" height={24} width={24} />
                ) : (
                  <FGPaperPlane color="white" height={24} width={24} />
                )}
              </Button>
            </form>
          )}
      </div>

      {offer?.lastMessage?.status === 'pending' &&
        offer?.lastMessage?.userId !== userId && (
          <ChatStatus
            messageId={offer?.lastMessage?._id ?? ''}
            offerId={params.chatId as string}
          />
        )}
    </div>
  );
};

export default ChatDetails;
