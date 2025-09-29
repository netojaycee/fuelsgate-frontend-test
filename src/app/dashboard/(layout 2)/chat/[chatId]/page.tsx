

// 'use client';
// import CustomButton from '@/components/atoms/custom-button';
// import CustomInput from '@/components/atoms/custom-input';
// import CustomLoader from '@/components/atoms/custom-loader';
// import { Text } from '@/components/atoms/text';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Button } from '@/components/ui/button';
// import { AuthContext } from '@/contexts/AuthContext';
// import { useSocket } from '@/contexts/SocketContext';
// import ChatStatus from '@/features/chat/components/chat-status';
// import CounterOffer from '@/features/chat/components/counter-offer';
// import Offer from '@/features/chat/components/offer';
// import OfferAction from '@/features/chat/components/offer-action';
// import SystemMessage from '@/features/chat/components/system-message';
// import {
//   StatusText,
//   StatusTypes,
// } from '@/features/transporter-dashboard/components/truck-order-list/status-text';
// import useOrderHook from '@/hooks/useOrder.hook';
// import { SOCKET_EVENTS } from '@/lib/socketEvents';
// import { cn } from '@/lib/utils';
// import { RFQ_TICKET } from '@/routes';
// import { OfferStatus } from '@/types/offer.types';
// import { renderErrors } from '@/utils/renderErrors';
// import { flexibleMessageSchema } from '@/validations/message.validation';
// import { FGInfoFill, FGPaperPlane } from '@fg-icons';
// import { yupResolver } from '@hookform/resolvers/yup';
// import { LoaderCircle } from 'lucide-react';
// import { useParams, useRouter } from 'next/navigation';
// import React, { useContext, useEffect, useState, useRef } from 'react';
// import { useForm } from 'react-hook-form';

// // Extended message interface to match backend
// interface ExtendedMessage {
//   _id: string;
//   userId: any;
//   receiverId: string;
//   negotiationId: string;
//   orderId?: string;
//   content: string;
//   offerPrice?: number;
//   messageType: 'user' | 'system';
//   status: 'sent' | 'delivered' | 'read';
//   createdAt: string;
//   updatedAt: string;
// }

// const ChatDetails = () => {
//   const params = useParams();
//   const router = useRouter();
//   const { user } = useContext(AuthContext);
//   const {
//     socket,
//     onNewMessage,
//     onSystemMessage,
//     onNegotiationAccepted,
//     onNegotiationRejected,
//     onNegotiationCancelled,
//     onMessageStatusUpdate,
//   } = useSocket();
//   const { useGetNegotiationDetails, useCreateOrder } = useOrderHook();
//   const userId = user?.data?._id;
//   const role = user?.data?.role;

//   const [chatType, setChatType] = useState<'order' | 'truck'>('order');
//   const [fullName, setFullName] = useState('');
//   const [initials, setInitials] = useState('');
//   const [offer, setOffer] = useState<any>(undefined);
//   const [messages, setMessages] = useState<ExtendedMessage[]>([]);
//   const [isSending, setIsSending] = useState(false);
//   const [showCounterInput, setShowCounterInput] = useState(false);
//   const [justSubmittedCounter, setJustSubmittedCounter] = useState(false);
//   const [actionFeedback, setActionFeedback] = useState<string | null>(null);

//   const messageContainer = useRef<HTMLDivElement | null>(null);

//   const {
//     data: negotiation,
//     isLoading: fetchingNegotiation,
//     error,
//     refetch,
//   } = useGetNegotiationDetails(params?.chatId as string);

//   const { mutateAsync: createOrder, isPending: isCreatingOrder } =
//     useCreateOrder();

//   const {
//     setError,
//     register,
//     formState: { errors },
//     setValue,
//     handleSubmit,
//     reset,
//   } = useForm<{ offerId?: string; offer?: number }>({
//     resolver: yupResolver(flexibleMessageSchema),
//   });

//   // Set up real-time event listeners
//   useEffect(() => {
//     if (!params.chatId || !userId) return;

//     // Join the negotiation room
//     if (socket) {
//       socket.emit('joinRoom', { negotiationId: params.chatId });
//       console.log('Joined negotiation room:', params.chatId);
//     }

//     // Handle new messages (including counter offers from MessageGateway)
//     const unsubscribeNewMessage = onNewMessage((message) => {
//       console.log('Received new message:', message);
//       if (message.negotiationId === params.chatId) {
//         setMessages((prev: any) => {
//           // Check if message already exists to avoid duplicates
//           if (prev.some((msg: any) => msg._id === message._id)) return prev;
//           const newMessages = [...prev, message as ExtendedMessage];
//           console.log('Updated messages:', newMessages);
//           return newMessages;
//         });
//         setShowCounterInput(false);
//         setJustSubmittedCounter(false);
//       }
//     });

//     // Handle system messages from MessageGateway
//     const unsubscribeSystemMessage = onSystemMessage((message) => {
//       console.log('Received system message:', message);
//       if (message.negotiationId === params.chatId) {
//         setMessages((prev: any) => {
//           if (prev.some((msg: any) => msg._id === message._id)) return prev;
//           return [...prev, message as ExtendedMessage];
//         });
//       }
//     });

//     // Handle message status updates from MessageGateway
//     const unsubscribeMessageStatus = onMessageStatusUpdate((data) => {
//       console.log('Message status updated:', data);
//       setMessages((prev: any) =>
//         prev.map((msg: any) =>
//           msg._id === data.messageId
//             ? { ...msg, status: data.status as 'sent' | 'delivered' | 'read' }
//             : msg,
//         ),
//       );
//     });

//     // Handle negotiation accepted from NegotiationGateway
//     const unsubscribeAccepted = onNegotiationAccepted((data) => {
//       console.log('Negotiation accepted:', data);
//       if (data.negotiationId === params.chatId) {
//         setOffer((prev: any) => ({
//           ...prev,
//           status: 'completed',
//           orderId: data.order || prev?.orderId,
//         }));
//         setActionFeedback('🎉 Negotiation accepted successfully!');
//         setShowCounterInput(false);
//         setJustSubmittedCounter(false);
//         refetch(); // Refresh data
//       }
//     });

//     // Handle negotiation rejected (with counter offer) from NegotiationGateway
//     const unsubscribeRejected = onNegotiationRejected((data) => {
//       console.log('Negotiation rejected with counter offer:', data);
//       if (data.negotiationId === params.chatId) {
//         // The rejection message with counter offer should already be handled by onNewMessage
//         setActionFeedback(
//           `Counter offer of ₦${data.counterOffer} sent successfully!`,
//         );
//         setShowCounterInput(false);
//         setJustSubmittedCounter(true);
//       }
//     });

//     // Handle negotiation cancelled from NegotiationGateway
//     const unsubscribeCancelled = onNegotiationCancelled((data) => {
//       console.log('Negotiation cancelled:', data);
//       if (data.negotiationId === params.chatId) {
//         setOffer((prev: any) => ({
//           ...prev,
//           status: 'cancelled',
//           orderId: data.order || prev?.orderId,
//         }));
//         setActionFeedback('❌ Negotiation cancelled');
//         setShowCounterInput(false);
//         setJustSubmittedCounter(false);
//         refetch(); // Refresh data
//       }
//     });

//     // Cleanup
//     return () => {
//       unsubscribeNewMessage();
//       unsubscribeSystemMessage();
//       unsubscribeMessageStatus();
//       unsubscribeAccepted();
//       unsubscribeRejected();
//       unsubscribeCancelled();
//     };
//   }, [
//     params.chatId,
//     userId,
//     socket,
//     onNewMessage,
//     onSystemMessage,
//     onMessageStatusUpdate,
//     onNegotiationAccepted,
//     onNegotiationRejected,
//     onNegotiationCancelled,
//     refetch,
//   ]);

//   // Set negotiation and chat type when data loads
//   useEffect(() => {
//     if (negotiation) {
//       const sortedMessages = [...(negotiation.messages || [])].sort(
//         (a, b) =>
//           new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
//       );
//       setOffer({ ...negotiation, firstMessageId: sortedMessages[0]?._id });
//       setMessages(sortedMessages);
//       setChatType(negotiation.type === 'truck' ? 'truck' : 'order');
//       setValue('offerId', negotiation._id);

//       console.log('Loaded negotiation:', negotiation);
//       console.log('Sorted messages:', sortedMessages);
//     }
//   }, [negotiation, setValue]);

//   // Set user details
//   useEffect(() => {
//     if (offer?._id) {
//       const receiver = offer.receiverId;
//       const sender = offer.senderId;
//       if (userId === sender._id) {
//         setFullName(`${receiver.firstName} ${receiver.lastName}`);
//         setInitials(
//           `${receiver.firstName.substring(0, 1)}${receiver.lastName.substring(
//             0,
//             1,
//           )}`,
//         );
//       } else if (userId === receiver._id) {
//         setFullName(`${sender.firstName} ${sender.lastName}`);
//         setInitials(
//           `${sender.firstName.substring(0, 1)}${sender.lastName.substring(
//             0,
//             1,
//           )}`,
//         );
//       }
//     }
//   }, [offer, userId]);

//   // Handle counter-offer submission
//   const onSubmitCounterOffer = async (data: {
//     offerId?: string;
//     offer?: number;
//   }) => {
//     if (!data.offer || !offer) return;

//     console.log('Submitting counter offer:', data);
//     setIsSending(true);

//     try {
//       // Emit rejection with counter offer to backend via NegotiationGateway
//       socket?.emit(SOCKET_EVENTS.REJECT_NEGOTIATION, {
//         negotiationId: params.chatId,
//         orderId: offer?.orderId?._id,
//         rejectingUserId: userId,
//         counterOfferPrice: data.offer,
//         user: user?.data,
//       });

//       console.log('Counter offer emitted successfully');
//       reset();

//       // Don't close input immediately, wait for socket response
//       // setShowCounterInput(false);
//       // setJustSubmittedCounter(true);
//     } catch (error: any) {
//       console.error('Error submitting counter offer:', error);
//       renderErrors(error?.errors, setError);
//     } finally {
//       setIsSending(false);
//     }
//   };

//   // Handle accept negotiation
//   const handleAcceptNegotiation = async () => {
//     console.log('Accepting negotiation');
//     setIsSending(true);

//     try {
//       socket?.emit(SOCKET_EVENTS.ACCEPT_NEGOTIATION, {
//         negotiationId: params.chatId,
//         orderId: offer?.orderId?._id,
//         acceptingUserId: userId,
//         user: user?.data,
//       });

//       console.log('Accept negotiation emitted successfully');
//     } catch (error: any) {
//       console.error('Error accepting negotiation:', error);
//       renderErrors(error?.errors, setError);
//     } finally {
//       setIsSending(false);
//     }
//   };

//   // Handle cancel negotiation
//   const handleCancelNegotiation = async () => {
//     if (!confirm('Are you sure you want to cancel this negotiation?')) return;

//     console.log('Cancelling negotiation');
//     setIsSending(true);

//     try {
//       socket?.emit(SOCKET_EVENTS.CANCEL_NEGOTIATION, {
//         negotiationId: params.chatId,
//         orderId: offer?.orderId?._id,
//         cancellingUserId: userId,
//         user: user?.data,
//       });

//       console.log('Cancel negotiation emitted successfully');
//     } catch (error: any) {
//       console.error('Error cancelling negotiation:', error);
//       renderErrors(error?.errors, setError);
//     } finally {
//       setIsSending(false);
//     }
//   };

//   // Handle create order for product negotiations
//   const handleCreateOrder = async () => {
//     if (chatType !== 'order' || !offer) return;

//     console.log('Creating order');
//     try {
//       const lastMessage = messages
//         .filter((msg: any) => msg.messageType === 'user')
//         .slice(-1)[0];
//       const orderData = {
//         sellerId: offer.productUploadId?.sellerId,
//         productUploadId: offer.productUploadId?._id,
//         price: lastMessage?.offerPrice || offer.orderId?.price,
//         volume: offer.volume,
//       };

//       const order = await createOrder(orderData);

//       // Accept negotiation with the created order
//       socket?.emit(SOCKET_EVENTS.ACCEPT_NEGOTIATION, {
//         negotiationId: params.chatId,
//         orderId: order.data._id,
//         acceptingUserId: userId,
//         user: user?.data,
//       });

//       setOffer((prev: any) => ({
//         ...prev,
//         orderId: { ...prev?.orderId, _id: order.data._id },
//       }));

//       console.log('Order created and negotiation accepted');
//     } catch (error: any) {
//       console.error('Error creating order:', error);
//       renderErrors(error?.errors, setError);
//     }
//   };

//   const mapOfferStatusToStatusText = (
//     status: OfferStatus,
//   ): StatusTypes | undefined => {
//     switch (status) {
//       case 'ongoing':
//         return 'ongoing';
//       case 'completed':
//         return 'completed';
//       case 'cancelled':
//         return 'cancelled';
//       default:
//         console.log('Unexpected status:', status);
//         return 'ongoing';
//     }
//   };

//   // Auto-scroll to bottom when new messages arrive
//   useEffect(() => {
//     if (messageContainer.current) {
//       messageContainer.current.scrollTop =
//         messageContainer.current.scrollHeight;
//     }
//   }, [messages]);

//   // Clear action feedback after delay
//   useEffect(() => {
//     if (actionFeedback) {
//       const timer = setTimeout(() => setActionFeedback(null), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [actionFeedback]);

//   if (fetchingNegotiation) return <CustomLoader />;
//   if (error) return <Text variant="pxs">Error loading negotiation</Text>;

//   // Find last user message (not system message) to determine if we should show chat status
//   const lastUserMessage = messages
//     .filter((msg: any) => msg.messageType === 'user')
//     .slice(-1)[0];
//   const canShowChatStatus =
//     lastUserMessage &&
//     lastUserMessage.userId._id !== userId &&
//     !showCounterInput &&
//     !justSubmittedCounter &&
//     offer?.status === 'ongoing';

//   console.log('Render state:', {
//     messagesCount: messages.length,
//     lastUserMessage,
//     canShowChatStatus,
//     showCounterInput,
//     justSubmittedCounter,
//     offerStatus: offer?.status,
//   });

//   return (
//     <div className="border border-mid-gray-300 rounded-2xl">
//       {/* Header */}
//       <div className="flex items-center flex-wrap justify-between pl-10 pr-4 py-6 max-sm:px-3 gap-2 border-b border-[#DEE0E566]">
//         <div className="flex items-center gap-3">
//           <Avatar className="h-[51px] w-[51px] border border-gold">
//             <AvatarImage src="" className="object-cover" />
//             <AvatarFallback>{initials}</AvatarFallback>
//           </Avatar>
//           <div>
//             <Text variant="pm" fontWeight="medium" color="text-deep-gray-300">
//               {fullName}
//             </Text>
//             <div className="flex items-center gap-2">
//               <StatusText
//                 status={
//                   mapOfferStatusToStatusText(
//                     offer?.status as OfferStatus,
//                   ) as StatusTypes
//                 }
//               />
//               <span
//                 className={`px-2 py-1 text-xs rounded-full ${
//                   chatType === 'order'
//                     ? 'bg-blue-100 text-blue-800'
//                     : 'bg-green-100 text-green-800'
//                 }`}
//               >
//                 {chatType === 'order' ? 'Product Order' : 'Truck Service'}
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           {offer?.status === 'ongoing' && (
//             <CustomButton
//               variant="secondary"
//               label="Cancel"
//               fontSize="text-sm"
//               classNames="rounded-lg px-4 py-[10px]"
//               height="h-11"
//               width="w-fit"
//               onClick={handleCancelNegotiation}
//               disabled={isSending}
//             />
//           )}

//           {offer?.status === 'completed' &&
//             chatType === 'order' &&
//             role === 'buyer' &&
//             !offer?.orderId?._id && (
//               <CustomButton
//                 variant="primary"
//                 label="Create Order"
//                 fontSize="text-sm"
//                 classNames="rounded-lg gap-1 px-4 py-[10px] relative z-[1] before:z-0 before:absolute before:bg-black/20 before:rounded-lg before:animate-ping before:h-full before:w-full"
//                 height="h-11"
//                 width="w-fit"
//                 onClick={handleCreateOrder}
//                 disabled={isCreatingOrder}
//               />
//             )}
//         </div>
//       </div>

//       {/* Action Feedback */}
//       {actionFeedback && (
//         <Alert className="mx-10 my-4 rounded-xl bg-green-50 border-green-200">
//           <FGInfoFill height={20} width={20} color="#10B981" />
//           <AlertDescription className="text-sm text-green-800">
//             {actionFeedback}
//           </AlertDescription>
//         </Alert>
//       )}

//       {/* Messages Container */}
//       <div
//         ref={messageContainer}
//         className="max-lg:h-[60vh] h-[50vh] overflow-y-auto py-7 px-10 max-sm:px-3 mb-2"
//       >
//         {messages.map((item, index) => (
//           <React.Fragment key={item._id}>
//             {item.messageType === 'system' ? (
//               <SystemMessage
//                 content={item.content}
//                 timestamp={item.createdAt}
//               />
//             ) : offer?.firstMessageId === item._id ? (
//               // First message - show as initial offer
//               <div
//                 className={cn(
//                   'flex flex-col',
//                   item.userId._id === userId ? 'items-end' : 'items-start',
//                 )}
//               >
//                 <OfferAction
//                   item={item}
//                   offer={offer}
//                   userId={userId}
//                   first={true}
//                 />
//                 <Offer item={item} offer={offer} />
//               </div>
//             ) : (
//               // All other user messages are counter offers
//               <CounterOffer item={item} offer={offer} userId={userId} />
//             )}
//           </React.Fragment>
//         ))}

//         {/* Loading indicator */}
//         {fetchingNegotiation && <CustomLoader />}
//       </div>

//       {/* Bottom Section */}
//       <div className="mb-7 px-10 max-sm:px-3">
//         {/* Completion Alert */}
//         {offer?.status === 'completed' && (
//           <Alert className="rounded-xl bg-blue-tone-50 border-blue-200 mb-4">
//             <FGInfoFill height={20} width={20} color="#375DFB" />
//             <div className="flex flex-col gap-3">
//               <AlertDescription className="text-sm text-dark-gray-350">
//                 {role === 'buyer' ? (
//                   <>
//                     🎉 Negotiation completed! Please{' '}
//                     <span className="font-semibold">print your ticket</span> and
//                     contact the{' '}
//                     {chatType === 'order' ? 'seller' : 'transporter'} to
//                     finalize {chatType === 'order' ? 'delivery' : 'service'}.
//                   </>
//                 ) : (
//                   <>
//                     ✅ Negotiation completed! Please{' '}
//                     <span className="font-semibold">print the ticket</span> and
//                     contact the buyer to finalize{' '}
//                     {chatType === 'order' ? 'delivery' : 'service'}.
//                   </>
//                 )}
//               </AlertDescription>
//               {offer?.orderId?._id && (
//                 <CustomButton
//                   variant="primary"
//                   label="Print Ticket"
//                   fontSize="text-sm"
//                   classNames="rounded-lg w-fit"
//                   height="h-10"
//                   width="w-fit"
//                   onClick={() =>
//                     router.push(`${RFQ_TICKET}/${offer.orderId._id}`)
//                   }
//                 />
//               )}
//             </div>
//           </Alert>
//         )}

//         {/* Counter Offer Input */}
//         {showCounterInput && (
//           <form
//             onSubmit={handleSubmit(onSubmitCounterOffer)}
//             className="flex items-center border border-mid-gray-300 px-1.5 rounded-lg bg-light-gray-100 mb-4"
//           >
//             <CustomInput
//               type="number"
//               name="offer"
//               prefixPadding="pl-10"
//               className="border-none bg-transparent"
//               placeholder={`Enter counter offer ${
//                 chatType === 'truck' ? 'for transport service' : 'for product'
//               }`}
//               classNames="grow"
//               prefix="₦"
//               register={register}
//               error={errors.offer?.message}
//             />
//             <Button
//               className="bg-deep-gray-300 h-10 w-12 rounded-lg"
//               disabled={isSending}
//               type="submit"
//             >
//               {isSending ? (
//                 <LoaderCircle color="white" height={24} width={24} />
//               ) : (
//                 <FGPaperPlane color="white" height={24} width={24} />
//               )}
//             </Button>
//           </form>
//         )}

//         {/* Chat Status (Accept/Reject buttons) */}
//         {canShowChatStatus && (
//           <ChatStatus
//             onReject={() => {
//               console.log('Reject clicked, showing counter input');
//               setShowCounterInput(true);
//             }}
//             onAccept={handleAcceptNegotiation}
//             disabled={isSending}
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatDetails;


'use client';
import CustomButton from '@/components/atoms/custom-button';
import CustomInput from '@/components/atoms/custom-input';
import CustomLoader from '@/components/atoms/custom-loader';
import { Text } from '@/components/atoms/text';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/contexts/AuthContext';
import { useSocket } from '@/contexts/SocketContext';
import ChatStatus from '@/features/chat/components/chat-status';
import CounterOffer from '@/features/chat/components/counter-offer';
import Offer from '@/features/chat/components/offer';
import OfferAction from '@/features/chat/components/offer-action';
import SystemMessage from '@/features/chat/components/system-message';
import {
  StatusText,
  StatusTypes,
} from '@/features/transporter-dashboard/components/truck-order-list/status-text';
import useOrderHook from '@/hooks/useOrder.hook';
import { SOCKET_EVENTS } from '@/lib/socketEvents';
import { cn } from '@/lib/utils';
import { RFQ_TICKET } from '@/routes';
import { OfferStatus } from '@/types/offer.types';
import { renderErrors } from '@/utils/renderErrors';
import { flexibleMessageSchema } from '@/validations/message.validation';
import { FGInfoFill, FGPaperPlane } from '@fg-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoaderCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';

// Extended message interface to match backend
interface ExtendedMessage {
  _id: string;
  userId: any;
  receiverId: string;
  negotiationId: string;
  orderId?: string;
  content: string;
  offerPrice?: number;
  messageType: 'user' | 'system';
  status: 'sent' | 'delivered' | 'read';
  createdAt: string;
  updatedAt: string;
}

const ChatDetails = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const {
    socket,
    onNewMessage,
    onSystemMessage,
    onNegotiationAccepted,
    onNegotiationRejected,
    onNegotiationCancelled,
    onMessageStatusUpdate,
  } = useSocket();
  const { useGetNegotiationDetails, useCreateOrder, useAcceptNegotiation } = useOrderHook();
  const userId = user?.data?._id;
  const role = user?.data?.role;

  const [chatType, setChatType] = useState<'order' | 'truck'>('order');
  const [fullName, setFullName] = useState('');
  const [initials, setInitials] = useState('');
  const [offer, setOffer] = useState<any>(undefined);
  const [messages, setMessages] = useState<ExtendedMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [showCounterInput, setShowCounterInput] = useState(false);
  const [justSubmittedCounter, setJustSubmittedCounter] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [pendingCounterOffer, setPendingCounterOffer] =
    useState<boolean>(false);

  const messageContainer = useRef<HTMLDivElement | null>(null);

  const {
    data: negotiation,
    isLoading: fetchingNegotiation,
    error,
    refetch,
  } = useGetNegotiationDetails(params?.chatId as string);

  const { mutateAsync: createOrder, isPending: isCreatingOrder } =
    useCreateOrder();

    const { mutateAsync: acceptNegotiation, isPending: isAcceptingNegotiation } =
      useAcceptNegotiation(params?.chatId as string);

  const {
    setError,
    register,
    formState: { errors },
    setValue,
    handleSubmit,
    reset,
  } = useForm<{ offerId?: string; offer?: number }>({
    resolver: yupResolver(flexibleMessageSchema),
  });

  // Set up real-time event listeners
  useEffect(() => {
    if (!params.chatId || !userId) return;

    // Join the negotiation room
    if (socket) {
      socket.emit('joinRoom', { negotiationId: params.chatId });
      console.log('Joined negotiation room:', params.chatId);
    }

    // Handle new messages (including counter offers from MessageGateway)
    const unsubscribeNewMessage = onNewMessage((message) => {
      console.log('Received new message:', message);
      if (message.negotiationId === params.chatId) {
        setMessages((prev: any) => {
          // Check if message already exists to avoid duplicates
          if (prev.some((msg: any) => msg._id === message._id)) return prev;

          const newMessage = {
            ...message,
            userId:
              typeof message.userId === 'string'
                ? { _id: message.userId }
                : message.userId,
          } as ExtendedMessage;

          const newMessages = [...prev, newMessage];
          console.log('Updated messages:', newMessages);
          return newMessages;
        });

        // Close counter input when ANY new message arrives
        setShowCounterInput(false);

        // If this message is from the other user, mark it as read immediately
        const isFromOtherUser =
          (typeof message.userId === 'string'
            ? message.userId
            : (typeof message.userId === 'object' && message.userId !== null && '_id' in message.userId
                ? (message.userId as { _id: string })._id
                : undefined)) !== userId;
        if (isFromOtherUser && socket) {
          console.log('Marking message as read:', message._id);
          socket.emit('markMessageAsRead', {
            messageId: message._id,
            userId: userId,
            negotiationId: params.chatId,
          });
        }

        // If this message is from the current user, mark as just submitted
        const isMyMessage =
          (typeof message.userId === 'string'
            ? message.userId
            : typeof message.userId === 'object' &&
              message.userId !== null &&
              '_id' in message.userId
            ? (message.userId as { _id: string })._id
            : undefined) === userId;
        if (isMyMessage) {
          setJustSubmittedCounter(true);
          setPendingCounterOffer(false);
          // Auto-clear the flag after a short delay
          setTimeout(() => setJustSubmittedCounter(false), 2000);
        } else {
          setJustSubmittedCounter(false);
        }
      }
    });



    // Handle system messages from MessageGateway
    const unsubscribeSystemMessage = onSystemMessage((message) => {
      console.log('Received system message:', message);
      if (message.negotiationId === params.chatId) {
        setMessages((prev: any) => {
          if (prev.some((msg: any) => msg._id === message._id)) return prev;

          const systemMessage = {
            ...message,
            userId: { _id: 'system' },
          } as ExtendedMessage;

          return [...prev, systemMessage];
        });
      }
    });

    // Handle message status updates from MessageGateway
    const unsubscribeMessageStatus = onMessageStatusUpdate((data) => {
      console.log('Message status updated:', data);
      setMessages((prev: any) =>
        prev.map((msg: any) =>
          msg._id === data.messageId
            ? { ...msg, status: data.status as 'sent' | 'delivered' | 'read' }
            : msg,
        ),
      );
    });

    // Handle negotiation accepted from NegotiationGateway
    const unsubscribeAccepted = onNegotiationAccepted((data) => {
      console.log('Negotiation accepted:', data);
      if (data.negotiationId === params.chatId) {
        setOffer((prev: any) => ({
          ...prev,
          status: 'completed',
          orderId: data.order || prev?.orderId,
        }));
        setActionFeedback('🎉 Negotiation accepted successfully!');
        setShowCounterInput(false);
        setJustSubmittedCounter(false);
        setPendingCounterOffer(false);
        refetch(); // Refresh data
      }
    });

    // Handle negotiation rejected (with counter offer) from NegotiationGateway
    const unsubscribeRejected = onNegotiationRejected((data) => {
      console.log('Negotiation rejected with counter offer:', data);
      if (data.negotiationId === params.chatId) {
        setActionFeedback(
          `Counter offer of ₦${data.counterOffer} sent successfully!`,
        );
        setShowCounterInput(false);
        setJustSubmittedCounter(true);
        setPendingCounterOffer(false);
        // Auto-clear the flag after a delay
        setTimeout(() => setJustSubmittedCounter(false), 3000);
      }
    });

    // Handle negotiation cancelled from NegotiationGateway
    const unsubscribeCancelled = onNegotiationCancelled((data) => {
      console.log('Negotiation cancelled:', data);
      if (data.negotiationId === params.chatId) {
        setOffer((prev: any) => ({
          ...prev,
          status: 'cancelled',
          orderId: data.order || prev?.orderId,
        }));
        setActionFeedback('❌ Negotiation cancelled');
        setShowCounterInput(false);
        setJustSubmittedCounter(false);
        setPendingCounterOffer(false);
        refetch(); // Refresh data
      }
    });

    // Cleanup
    return () => {
      unsubscribeNewMessage();
      unsubscribeSystemMessage();
      unsubscribeMessageStatus();
      unsubscribeAccepted();
      unsubscribeRejected();
      unsubscribeCancelled();
    };
  }, [
    params.chatId,
    userId,
    socket,
    onNewMessage,
    onSystemMessage,
    onMessageStatusUpdate,
    onNegotiationAccepted,
    onNegotiationRejected,
    onNegotiationCancelled,
    refetch,
  ]);

      useEffect(() => {
  if (params.chatId && userId && socket && messages.length > 0) {
    // Mark all unread messages as read when entering the chat
    const unreadMessages = messages.filter(msg => 
      msg.messageType === 'user' && 
      msg.userId?._id !== userId && 
      msg.status !== 'read'
    );

    if (unreadMessages.length > 0) {
      console.log('Marking existing unread messages as read:', unreadMessages.length);
      socket.emit('markNegotiationAsRead', {
        negotiationId: params.chatId,
        userId: userId,
      });
    }
  }
}, [params.chatId, userId, socket, messages]);

  // Set negotiation and chat type when data loads
  useEffect(() => {
    if (negotiation) {
      const sortedMessages = [...(negotiation.messages || [])].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );

      // Ensure userId is always an object with _id property for consistency
      const normalizedMessages = sortedMessages.map((msg: any) => ({
        ...msg,
        userId:
          typeof msg.userId === 'string' ? { _id: msg.userId } : msg.userId,
      }));

      setOffer({ ...negotiation, firstMessageId: normalizedMessages[0]?._id });
      setMessages(normalizedMessages);
      setChatType(negotiation.type === 'truck' ? 'truck' : 'order');
      setValue('offerId', negotiation._id);

      console.log('Loaded negotiation:', negotiation);
      console.log('Normalized messages:', normalizedMessages);
    }
  }, [negotiation, setValue]);

  // Set user details
  useEffect(() => {
    if (offer?._id) {
      const receiver = offer.receiverId;
      const sender = offer.senderId;
      if (userId === sender._id) {
        setFullName(`${receiver.firstName} ${receiver.lastName}`);
        setInitials(
          `${receiver.firstName.substring(0, 1)}${receiver.lastName.substring(
            0,
            1,
          )}`,
        );
      } else if (userId === receiver._id) {
        setFullName(`${sender.firstName} ${sender.lastName}`);
        setInitials(
          `${sender.firstName.substring(0, 1)}${sender.lastName.substring(
            0,
            1,
          )}`,
        );
      }
    }
  }, [offer, userId]);

  // Handle counter-offer submission
  const onSubmitCounterOffer = async (data: {
    offerId?: string;
    offer?: number;
  }) => {
    if (!data.offer || !offer) return;

    console.log('Submitting counter offer:', data);
    setIsSending(true);
    setPendingCounterOffer(true);

    try {
      // Emit rejection with counter offer to backend via NegotiationGateway
      socket?.emit(SOCKET_EVENTS.REJECT_NEGOTIATION, {
        negotiationId: params.chatId,
        orderId: offer?.orderId?._id,
        rejectingUserId: userId,
        counterOfferPrice: data.offer,
        user: user?.data,
      });

      console.log('Counter offer emitted successfully');
      reset();

      // Set justSubmittedCounter immediately to prevent chat status from showing
      setJustSubmittedCounter(true);
    } catch (error: any) {
      console.error('Error submitting counter offer:', error);
      renderErrors(error?.errors, setError);
      setPendingCounterOffer(false);
    } finally {
      setIsSending(false);
    }
  };

  // Handle accept negotiation
  const handleAcceptNegotiation = async () => {
    console.log('Accepting negotiation');
    setIsSending(true);

    try {
      // socket?.emit(SOCKET_EVENTS.ACCEPT_NEGOTIATION, {
      //   negotiationId: params.chatId,
      //   orderId: offer?.orderId?._id,
      //   acceptingUserId: userId,
      //   user: user?.data,
      // });
      const response = await acceptNegotiation({
        negotiationId: params.chatId,
        orderId: offer?.orderId?._id,
        acceptingUserId: userId,
        user: user?.data,
      });

      console.log('Accept negotiation emitted successfully');
    } catch (error: any) {
      console.error('Error accepting negotiation:', error);
      renderErrors(error?.errors, setError);
    } finally {
      setIsSending(false);
    }
  };

  // Handle cancel negotiation
  const handleCancelNegotiation = async () => {
    if (!confirm('Are you sure you want to cancel this negotiation?')) return;

    console.log('Cancelling negotiation');
    setIsSending(true);

    try {
      socket?.emit(SOCKET_EVENTS.CANCEL_NEGOTIATION, {
        negotiationId: params.chatId,
        orderId: offer?.orderId?._id,
        cancellingUserId: userId,
        user: user?.data,
      });

      console.log('Cancel negotiation emitted successfully');
    } catch (error: any) {
      console.error('Error cancelling negotiation:', error);
      renderErrors(error?.errors, setError);
    } finally {
      setIsSending(false);
    }
  };

  // Handle create order for product negotiations
  const handleCreateOrder = async () => {
    if (chatType !== 'order' || !offer) return;

    console.log('Creating order');
    try {
      const lastMessage = messages
        .filter((msg: any) => msg.messageType === 'user')
        .slice(-1)[0];
      const orderData = {
        sellerId: offer.productUploadId?.sellerId,
        productUploadId: offer.productUploadId?._id,
        price: lastMessage?.offerPrice || offer.orderId?.price,
        volume: offer.volume,
      };

      const order = await createOrder(orderData);

      // Accept negotiation with the created order
      socket?.emit(SOCKET_EVENTS.ACCEPT_NEGOTIATION, {
        negotiationId: params.chatId,
        orderId: order.data._id,
        acceptingUserId: userId,
        user: user?.data,
      });

      setOffer((prev: any) => ({
        ...prev,
        orderId: { ...prev?.orderId, _id: order.data._id },
      }));

      console.log('Order created and negotiation accepted');
    } catch (error: any) {
      console.error('Error creating order:', error);
      renderErrors(error?.errors, setError);
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
        console.log('Unexpected status:', status);
        return 'ongoing';
    }
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messageContainer.current) {
      messageContainer.current.scrollTop =
        messageContainer.current.scrollHeight;
    }
  }, [messages]);

  // Clear action feedback after delay
  useEffect(() => {
    if (actionFeedback) {
      const timer = setTimeout(() => setActionFeedback(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [actionFeedback]);

  if (fetchingNegotiation) return <CustomLoader />;
  if (error) return <Text variant="pxs">Error loading negotiation</Text>;

  // Find last user message (not system message) to determine if we should show chat status
  const lastUserMessage = messages
    .filter((msg: any) => msg.messageType === 'user')
    .slice(-1)[0];

  // More robust check for showing chat status
  const canShowChatStatus =
    lastUserMessage &&
    lastUserMessage.userId?._id !== userId &&
    !showCounterInput &&
    !justSubmittedCounter &&
    !pendingCounterOffer &&
    offer?.status === 'ongoing';

  console.log('Render state:', {
    messagesCount: messages.length,
    lastUserMessage: lastUserMessage
      ? {
          id: lastUserMessage._id,
          userId: lastUserMessage.userId?._id,
          isMyMessage: lastUserMessage.userId?._id === userId,
        }
      : null,
    canShowChatStatus,
    showCounterInput,
    justSubmittedCounter,
    pendingCounterOffer,
    offerStatus: offer?.status,
    currentUserId: userId,
  });

  return (
    <div className="border border-mid-gray-300 rounded-2xl">
      {/* Header */}
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
            <div className="flex items-center gap-2">
              <StatusText
                status={
                  mapOfferStatusToStatusText(
                    offer?.status as OfferStatus,
                  ) as StatusTypes
                }
              />
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  chatType === 'order'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}
              >
                {chatType === 'order' ? 'Product Order' : 'Truck Service'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {offer?.status === 'ongoing' && (
            <CustomButton
              variant="secondary"
              label="Cancel"
              fontSize="text-sm"
              classNames="rounded-lg px-4 py-[10px]"
              height="h-11"
              width="w-fit"
              onClick={handleCancelNegotiation}
              disabled={isSending}
            />
          )}

          {offer?.status === 'completed' &&
            chatType === 'order' &&
            role === 'buyer' &&
            !offer?.orderId?._id && (
              <CustomButton
                variant="primary"
                label="Create Order"
                fontSize="text-sm"
                classNames="rounded-lg gap-1 px-4 py-[10px] relative z-[1] before:z-0 before:absolute before:bg-black/20 before:rounded-lg before:animate-ping before:h-full before:w-full"
                height="h-11"
                width="w-fit"
                onClick={handleCreateOrder}
                disabled={isCreatingOrder}
              />
            )}
        </div>
      </div>

      {/* Action Feedback */}
      {actionFeedback && (
        <Alert className="mx-10 my-4 rounded-xl bg-green-50 border-green-200">
          <FGInfoFill height={20} width={20} color="#10B981" />
          <AlertDescription className="text-sm text-green-800">
            {actionFeedback}
          </AlertDescription>
        </Alert>
      )}

      {/* Messages Container */}
      <div
        ref={messageContainer}
        className="max-lg:h-[60vh] h-[50vh] overflow-y-auto py-7 px-10 max-sm:px-3 mb-2"
      >
        {messages.map((item, index) => {
          console.log('Rendering message:', {
            id: item._id,
            messageType: item.messageType,
            userId: item.userId?._id,
            isMyMessage: item.userId?._id === userId,
            isFirstMessage: offer?.firstMessageId === item._id,
          });

          return (
            <React.Fragment key={item._id}>
              {item.messageType === 'system' ? (
                <SystemMessage
                  content={item.content}
                  timestamp={item.createdAt}
                />
              ) : offer?.firstMessageId === item._id ? (
                // First message - show as initial offer
                <div
                  className={cn(
                    'flex flex-col',
                    item.userId?._id === userId ? 'items-end' : 'items-start',
                  )}
                >
                  <OfferAction
                    item={item}
                    offer={offer}
                    userId={userId}
                    first={true}
                  />
                  <Offer item={item} offer={offer} />
                </div>
              ) : (
                // All other user messages are counter offers
                <CounterOffer item={item} offer={offer} userId={userId} />
              )}
            </React.Fragment>
          );
        })}

        {/* Loading indicator */}
        {fetchingNegotiation && <CustomLoader />}
      </div>

      {/* Bottom Section */}
      <div className="mb-7 px-10 max-sm:px-3">
        {/* Completion Alert */}
        {offer?.status === 'completed' && (
          <Alert className="rounded-xl bg-blue-tone-50 border-blue-200 mb-4">
            <FGInfoFill height={20} width={20} color="#375DFB" />
            <div className="flex flex-col gap-3">
              <AlertDescription className="text-sm text-dark-gray-350">
                {role === 'buyer' ? (
                  <>
                    🎉 Negotiation completed! Please{' '}
                    <span className="font-semibold">print your ticket</span> and
                    contact the{' '}
                    {chatType === 'order' ? 'seller' : 'vendor'} to
                    finalize {chatType === 'order' ? 'delivery' : 'service'}.
                  </>
                ) : (
                  <>
                    ✅ Negotiation completed! Please{' '}
                    <span className="font-semibold">print the ticket</span> and
                    contact the buyer to finalize{' '}
                    {chatType === 'order' ? 'delivery' : 'service'}.
                  </>
                )}
              </AlertDescription>
              {offer?.orderId?._id && (
                <CustomButton
                  variant="primary"
                  label="Print Ticket"
                  fontSize="text-sm"
                  classNames="rounded-lg w-fit"
                  height="h-10"
                  width="w-fit"
                  onClick={() =>
                    router.push(`${RFQ_TICKET}/${offer.orderId._id}`)
                  }
                />
              )}
            </div>
          </Alert>
        )}

        {/* Counter Offer Input */}
        {showCounterInput && (
          <form
            onSubmit={handleSubmit(onSubmitCounterOffer)}
            className="flex items-center border border-mid-gray-300 px-1.5 rounded-lg bg-light-gray-100 mb-4"
          >
            <CustomInput
              type="number"
              name="offer"
              prefixPadding="pl-10"
              className="border-none bg-transparent"
              placeholder={`Enter counter offer ${
                chatType === 'truck' ? 'for transport service' : 'for product'
              }`}
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

        {/* Chat Status (Accept/Reject buttons) */}
        {canShowChatStatus && (
          <ChatStatus
            onReject={() => {
              console.log('Reject clicked, showing counter input');
              setShowCounterInput(true);
              setJustSubmittedCounter(false); // Allow showing input
            }}
            onAccept={handleAcceptNegotiation}
            isAcceptingNegotiation={isAcceptingNegotiation}
            disabled={isSending}
          />
        )}
      </div>
    </div>
  );
};

export default ChatDetails;