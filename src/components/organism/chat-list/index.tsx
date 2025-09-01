// 'use client';
// import React, { useCallback, useContext, useEffect, useState } from 'react';
// import { ArrowDownToLine, Search } from 'lucide-react';
// import { useParams } from 'next/navigation';
// import { Text } from '@/components/atoms/text';
// import CustomInput from '@/components/atoms/custom-input';
// import { ChatPreview } from '@/features/chat/components/chat-preview';
// import { cn } from '@/lib/utils';
// import useOfferHook from '@/hooks/useOffer.hook';
// import useTruckOfferHook from '@/hooks/useTruckOffer.hook';
// import { OfferDto } from '@/types/offer.types';
// import { TruckOfferDto } from '@/types/truckOffer.types';
// import { AuthContext } from '@/contexts/AuthContext';
// import CustomButton from '@/components/atoms/custom-button';
// import CustomLoader from '@/components/atoms/custom-loader';
// import { useSocket } from '@/contexts/SocketContext';
// import useOrderHook from '@/hooks/useOrder.hook';

// interface User {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   status: string;
//   email: string;
//   lastSeen: string;
//   provider: string | null;
//   providerId: string | null;
//   averageRating: number;
//   createdAt: string;
//   updatedAt: string;
// }

// interface Order {
//   _id: string;
//   buyerId: string;
//   profileId: string;
//   profileType: 'transporter' | 'seller';
//   type: 'truck' | 'product';
//   truckId?: string;
//   trackingId: string;
//   price: number;
//   volume: number | null;
//   destination: string;
//   state: string;
//   city: string;
//   loadingDepot: string;
//   loadingDate: string;
//   arrivalTime: string;
//   status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
//   rfqStatus: 'pending' | 'sent' | 'accepted' | 'rejected';
//   isRated: boolean;
//   expiresIn: string | null;
//   createdAt: string;
//   updatedAt: string;
// }

// interface LastMessage {
//   _id: string;
//   receiverId: string;
//   content: string;
//   offerPrice: number;
//   status: 'sent' | 'delivered' | 'read';
//   createdAt: string;
//   updatedAt: string;
// }

// interface Negotiation {
//   _id: string;
//   senderId: User;
//   receiverId: User;
//   type: 'truck' | 'product';
//   orderId: Order;
//   status: 'ongoing' | 'completed' | 'cancelled';
//   createdAt: string;
//   updatedAt: string;
//   lastMessage: LastMessage | null;
//   unreadCount: number;
// }

// interface Page {
//   data: Negotiation[];
//   total: number;
//   hasMore: boolean;
// }

// interface NegotiationsData {
//   pages: Page[];
//   pageParams: number[];
// }

// const ChatList = () => {
//   const param = useParams();
//   const { user } = useContext(AuthContext);
//   const { useFetchOffers } = useOfferHook();
//   const { useFetchTruckOffers } = useTruckOfferHook();
//   const { socket, notifications } = useSocket();
//   const { useFetchAllNegotiations } = useOrderHook();
//   const [search, setSearch] = useState('');
//   // Fetch both order and truck offers
//   const {
//     data: offerList,
//     isLoading: fetchingOffers,
//     isFetchingNextPage,
//     hasNextPage,
//     fetchNextPage,
//     refetch,
//   } = useFetchOffers(
//     `?profileId=${user?.data?._id}${
//       search ? `&search=${search}` : ''
//     }&limit=20&page=`,
//   );

//   const {
//     data: truckOfferList,
//     isLoading: fetchingTruckOffers,
//     isFetchingNextPage: isFetchingTruckNextPage,
//     hasNextPage: hasTruckNextPage,
//     fetchNextPage: fetchTruckNextPage,
//     refetch: refetchTruckOffers,
//   } = useFetchTruckOffers(
//     `?profileId=${user?.data?._id}${
//       search ? `&search=${search}` : ''
//     }&limit=20&page=`,
//   );

//   const {
//     data: negotiationsData,
//     isLoading: fetchingNegotiations,
//     isFetchingNextPage: isFetchingNegotiationsNextPage,
//     hasNextPage: hasNegotiationsNextPage,
//     fetchNextPage: fetchNegotiationsNextPage,
//     refetch: refetchNegotiations,
//   } = useFetchAllNegotiations(
//     `?profileId=${user?.data?._id}${search ? `&search=${search}` : ''}`,
//   );

//   console.log('Negotiations:', negotiationsData);
//   console.log('Offer List:', offerList, truckOfferList);

//   const allNegotiations = React.useMemo(() => {
//     // Flatten all pages' data into a single array
//     const negotiations = (negotiationsData?.pages || []).flatMap((page: Page) =>
//       (page.data || []).map((negotiation: Negotiation) => ({
//         ...negotiation,
//         // Prioritize notifications count, then negotiation.unreadCount, then 0
//         unreadCount:
//           notifications[negotiation._id]?.count ?? negotiation.unreadCount ?? 0,
//       })),
//     );

//     // Sort by lastMessage.updatedAt, lastMessage.createdAt, or negotiation.createdAt
//     return negotiations.sort((a: Negotiation, b: Negotiation) => {
//       const timeA = new Date(
//         a.lastMessage?.updatedAt || a.lastMessage?.createdAt || a.createdAt,
//       ).getTime();
//       const timeB = new Date(
//         b.lastMessage?.updatedAt || b.lastMessage?.createdAt || b.createdAt,
//       ).getTime();
//       return timeB - timeA; // Descending order (most recent first)
//     });
//   }, [negotiationsData, notifications]);
//   const debouncedSearch = useCallback((value: string) => {
//     const timeout = setTimeout(() => {
//       setSearch(value);
//     }, 1500);
//     return () => clearTimeout(timeout);
//   }, []);

//   // Join negotiation rooms
//   useEffect(() => {
//     if (socket && user?.data?._id && allNegotiations.length) {
//       allNegotiations.forEach((negotiation: any) => {
//         socket.emit('joinRoom', { negotiationId: negotiation._id });
//       });
//     }
//   }, [socket, user?.data?._id, allNegotiations]);

//   // Refetch on search change
//   useEffect(() => {
//     refetchNegotiations();
//   }, [search, refetchNegotiations]);

//   const totalConversations = negotiationsData?.pages?.[0]?.total || 0;
//   const isLoading = fetchingNegotiations;
//   const isFetchingNext = isFetchingNegotiationsNextPage;
//   const hasMore = hasNegotiationsNextPage;

//   // end here

//   // Combine and sort all offers by last message time
//   // const allOffers = React.useMemo(() => {
//   //   const orders =
//   //     offerList?.pages.flatMap((page) =>
//   //       page.data?.offers?.map((offer: OfferDto) => ({
//   //         ...offer,
//   //         type: 'order' as const,
//   //       })),
//   //     ) || [];

//   //   const trucks =
//   //     truckOfferList?.pages.flatMap((page) =>
//   //       page?.truckOffers?.map((offer: TruckOfferDto) => ({
//   //         ...offer,
//   //         type: 'truck' as const,
//   //       })),
//   //     ) || [];

//   //   const combined = [...orders, ...trucks];

//   //   // Sort by last message time (newest first)
//   //   return combined.sort((a, b) => {
//   //     const timeA = new Date(
//   //       a.lastMessage?.updatedAt || a.lastMessage?.createdAt || 0,
//   //     ).getTime();
//   //     const timeB = new Date(
//   //       b.lastMessage?.updatedAt || b.lastMessage?.createdAt || 0,
//   //     ).getTime();
//   //     return timeB - timeA;
//   //   });
//   // }, [offerList, truckOfferList]);

//   // const totalConversations =
//   //   (offerList?.pages[0]?.data?.total || 0) +
//   //   (truckOfferList?.pages[0]?.total || 0);
//   // const isLoading = fetchingOffers || fetchingTruckOffers;
//   // const isFetchingNext = isFetchingNextPage || isFetchingTruckNextPage;
//   // const hasMore = hasNextPage || hasTruckNextPage;

//   // const debouncedSearch = useCallback(
//   //   (value: string) => {
//   //     const timeout = setTimeout(() => {
//   //       setSearch(value);
//   //     }, 1500);
//   //     return () => clearTimeout(timeout);
//   //   },
//   //   [setSearch],
//   // );

//   // useEffect(() => {
//   //   refetch();
//   //   refetchTruckOffers();
//   // }, [search, refetch, refetchTruckOffers]);

//   return (
//     <div className={cn('w-full min-h-[70vh]', param.chatId && 'max-lg:hidden')}>
//       <CustomInput
//         name="search"
//         type="text"
//         value={search}
//         onChange={(e) => debouncedSearch(e.target.value)}
//         placeholder="Search..."
//         classNames="rounded-md mb-8"
//         affix={<Search />}
//       />
//       <Text variant="pl" fontWeight="semibold" classNames="mb-5">
//         {totalConversations} Conversations
//       </Text>

//       {totalConversations === 0 && (
//         <div className="flex items-center justify-center h-[70vh]">
//           <Text
//             variant="pm"
//             fontWeight="regular"
//             color="text-gray-300"
//             classNames="mb-5"
//           >
//             No conversations found
//           </Text>
//         </div>
//       )}

//       {/* RENDER UNIFIED MESSAGE LIST HERE */}
//       {allNegotiations.map((item) => (
//         <ChatPreview key={`${item?._id}`} data={item} />
//       ))}

//       {(isLoading || isFetchingNext) && <CustomLoader />}
//       {hasMore && (
//         <CustomButton
//           variant="white"
//           label="Load more"
//           onClick={() => {
//             if (hasNextPage) fetchNegotiationsNextPage();
//           }}
//           width="w-fit"
//           height="h-10"
//           fontSize="text-xs"
//           color="text-gray-500"
//           rightIcon={<ArrowDownToLine height={15} width={15} />}
//           classNames="mx-auto gap-1"
//         />
//       )}
//     </div>
//   );
// };

// export { ChatList };



'use client';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ArrowDownToLine, Search } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Text } from '@/components/atoms/text';
import CustomInput from '@/components/atoms/custom-input';
import { ChatPreview } from '@/features/chat/components/chat-preview';
import { cn } from '@/lib/utils';
import { AuthContext } from '@/contexts/AuthContext';
import CustomButton from '@/components/atoms/custom-button';
import CustomLoader from '@/components/atoms/custom-loader';
import { useSocket } from '@/contexts/SocketContext';
import useOrderHook from '@/hooks/useOrder.hook';
import { useQueryClient } from '@tanstack/react-query';

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  status: string;
  email: string;
  lastSeen: string;
  provider: string | null;
  providerId: string | null;
  averageRating: number;
  createdAt: string;
  updatedAt: string;
}

interface Order {
  _id: string;
  buyerId: string;
  profileId: string;
  profileType: 'transporter' | 'seller';
  type: 'truck' | 'product';
  truckId?: string;
  trackingId: string;
  price: number;
  volume: number | null;
  destination: string;
  state: string;
  city: string;
  loadingDepot: string;
  loadingDate: string;
  arrivalTime: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  rfqStatus: 'pending' | 'sent' | 'accepted' | 'rejected';
  isRated: boolean;
  expiresIn: string | null;
  createdAt: string;
  updatedAt: string;
}

interface LastMessage {
  _id: string;
  receiverId: string;
  content: string;
  offerPrice: number;
  status: 'sent' | 'delivered' | 'read';
  createdAt: string;
  updatedAt: string;
}

interface Negotiation {
  _id: string;
  senderId: User;
  receiverId: User;
  type: 'truck' | 'product';
  orderId: Order;
  status: 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  lastMessage: LastMessage | null;
  unreadCount: number;
}

interface Page {
  data: Negotiation[];
  total: number;
  hasMore: boolean;
}

const ChatList = () => {
  const param = useParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const {
    socket,
    onNewMessage,
    onSystemMessage,
    onMessageStatusUpdate,
    onNegotiationAccepted,
    onNegotiationRejected,
    onNegotiationCancelled,
  } = useSocket();
  const { useFetchAllNegotiations } = useOrderHook();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [localNegotiations, setLocalNegotiations] = useState<Negotiation[]>([]);

  const {
    data: negotiationsData,
    isLoading: fetchingNegotiations,
    isFetchingNextPage: isFetchingNegotiationsNextPage,
    hasNextPage: hasNegotiationsNextPage,
    fetchNextPage: fetchNegotiationsNextPage,
    refetch: refetchNegotiations,
  } = useFetchAllNegotiations(
    `?profileId=${user?.data?._id}${search ? `&search=${search}` : ''}`,
  );

  // Update local negotiations when data changes
  useEffect(() => {
    if (negotiationsData?.pages) {
      const flattenedNegotiations = negotiationsData.pages.flatMap(
        (page: Page) => page.data || [],
      );
      setLocalNegotiations(flattenedNegotiations);
    }
  }, [negotiationsData]);

  // Function to mark negotiation messages as read
  const markNegotiationAsRead = useCallback(
    async (negotiationId: string) => {
      if (!socket || !user?.data?._id) return;

      console.log('Marking negotiation as read:', negotiationId);

      // Find the negotiation and its unread messages
      const negotiation = localNegotiations.find(
        (neg) => neg._id === negotiationId,
      );
      if (
        !negotiation ||
        !negotiation.unreadCount ||
        negotiation.unreadCount === 0
      ) {
        console.log('No unread messages to mark as read');
        return;
      }

      // Emit event to mark all messages in this negotiation as read
      socket.emit('markNegotiationAsRead', {
        negotiationId,
        userId: user?.data?._id,
      });

      // Optimistically update local state
      setLocalNegotiations((prev) =>
        prev.map((neg) =>
          neg._id === negotiationId ? { ...neg, unreadCount: 0 } : neg,
        ),
      );

      // Update React Query cache
      queryClient.setQueryData(['negotiations'], (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data: page.data.map((neg: any) =>
              neg._id === negotiationId ? { ...neg, unreadCount: 0 } : neg,
            ),
          })),
        };
      });
    },
    [socket, user?.data?._id, localNegotiations, queryClient],
  );

  // Handle chat item click
  const handleChatClick = useCallback(
    async (negotiationId: string) => {
      // Mark as read before navigating
      await markNegotiationAsRead(negotiationId);

      // Navigate to chat
      router.push(`/dashboard/chat/${negotiationId}`);
    },
    [markNegotiationAsRead, router],
  );

  // Set up real-time event listeners
  useEffect(() => {
    if (!user?.data?._id) return;

    // Handle new messages
    const unsubscribeNewMessage = onNewMessage((message) => {
      // Update unread count for the negotiation
      setLocalNegotiations((prev) =>
        prev.map((neg) => {
          if (neg._id === message.negotiationId) {
            // Only increment if the message is not from the current user
            const shouldIncrement =
              message.userId !== user?.data?._id && message.status !== 'read';
            // Don't increment if we're currently viewing this chat
            const isCurrentChat = param.chatId === message.negotiationId;
            const incrementValue = shouldIncrement && !isCurrentChat ? 1 : 0;

            return {
              ...neg,
              unreadCount: (neg.unreadCount || 0) + incrementValue,
              lastMessage: {
                _id: message._id,
                receiverId: message.receiverId,
                content: message.content,
                offerPrice: message.offerPrice || 0,
                status: message.status,
                createdAt: message.createdAt,
                updatedAt: message.updatedAt,
              },
            };
          }
          return neg;
        }),
      );

      // If we're currently viewing this chat, mark it as read immediately
      if (
        param.chatId === message.negotiationId &&
        message.userId !== user?.data?._id
      ) {
        setTimeout(() => markNegotiationAsRead(message.negotiationId), 100);
      }

      // Invalidate negotiations query to refetch
      queryClient.invalidateQueries({ queryKey: ['negotiations'] });
    });

    // Handle system messages
    const unsubscribeSystemMessage = onSystemMessage((message) => {
      setLocalNegotiations((prev) =>
        prev.map((neg) => {
          if (neg._id === message.negotiationId) {
            return {
              ...neg,
              lastMessage: {
                _id: message._id,
                receiverId: message.receiverId,
                content: message.content,
                offerPrice: 0,
                status: message.status,
                createdAt: message.createdAt,
                updatedAt: message.updatedAt,
              },
            };
          }
          return neg;
        }),
      );
    });

    // Handle message status updates
    const unsubscribeMessageStatus = onMessageStatusUpdate((data) => {
      // If message is marked as read, we can decrease unread count
      if (data.status === 'read') {
        setLocalNegotiations((prev) =>
          prev.map((neg) => {
            if (neg.lastMessage?._id === data.messageId) {
              return {
                ...neg,
                lastMessage: {
                  ...neg.lastMessage,
                  status: 'read' as const,
                },
                unreadCount: Math.max(0, (neg.unreadCount || 0) - 1),
              };
            }
            return neg;
          }),
        );
      }
    });

    // Handle negotiation events (keep existing logic)
    const unsubscribeAccepted = onNegotiationAccepted((data) => {
      setLocalNegotiations((prev) =>
        prev.map((neg) => {
          if (neg._id === data.negotiationId) {
            return {
              ...neg,
              status: 'completed' as const,
              orderId: data.order || neg.orderId,
            };
          }
          return neg;
        }),
      );
      refetchNegotiations();
    });

    const unsubscribeRejected = onNegotiationRejected((data) => {
      setLocalNegotiations((prev) =>
        prev.map((neg) => {
          if (neg._id === data.negotiationId) {
            return {
              ...neg,
              lastMessage: data.message
                ? {
                    _id: data.message._id,
                    receiverId: data.message.receiverId,
                    content: data.message.content,
                    offerPrice: data.counterOffer || 0,
                    status: data.message.status,
                    createdAt: data.message.createdAt,
                    updatedAt: data.message.updatedAt,
                  }
                : neg.lastMessage,
              unreadCount: (neg.unreadCount || 0) + 1,
            };
          }
          return neg;
        }),
      );
    });

    const unsubscribeCancelled = onNegotiationCancelled((data) => {
      setLocalNegotiations((prev) =>
        prev.map((neg) => {
          if (neg._id === data.negotiationId) {
            return {
              ...neg,
              status: 'cancelled' as const,
              orderId: data.order || neg.orderId,
            };
          }
          return neg;
        }),
      );
      refetchNegotiations();
    });

    // Cleanup function
    return () => {
      unsubscribeNewMessage();
      unsubscribeSystemMessage();
      unsubscribeMessageStatus();
      unsubscribeAccepted();
      unsubscribeRejected();
      unsubscribeCancelled();
    };
  }, [
    user?.data?._id,
    param.chatId,
    onNewMessage,
    onSystemMessage,
    onMessageStatusUpdate,
    onNegotiationAccepted,
    onNegotiationRejected,
    onNegotiationCancelled,
    queryClient,
    refetchNegotiations,
    markNegotiationAsRead,
  ]);

  // Sort negotiations by most recent activity
  const allNegotiations = React.useMemo(() => {
    return localNegotiations.sort((a: Negotiation, b: Negotiation) => {
      const timeA = new Date(
        a.lastMessage?.updatedAt || a.lastMessage?.createdAt || a.createdAt,
      ).getTime();
      const timeB = new Date(
        b.lastMessage?.updatedAt || b.lastMessage?.createdAt || b.createdAt,
      ).getTime();
      return timeB - timeA; // Descending order (most recent first)
    });
  }, [localNegotiations]);

  const debouncedSearch = useCallback((value: string) => {
    const timeout = setTimeout(() => {
      setSearch(value);
    }, 1500);
    return () => clearTimeout(timeout);
  }, []);

  // Join negotiation rooms when socket connects and negotiations are loaded
  useEffect(() => {
    if (socket && user?.data?._id && allNegotiations.length) {
      allNegotiations.forEach((negotiation: Negotiation) => {
        socket.emit('joinRoom', { negotiationId: negotiation._id });
      });
    }
  }, [socket, user?.data?._id, allNegotiations]);

  // Refetch on search change
  useEffect(() => {
    refetchNegotiations();
  }, [search, refetchNegotiations]);

  const totalConversations = negotiationsData?.pages?.[0]?.total || 0;
  const isLoading = fetchingNegotiations;
  const isFetchingNext = isFetchingNegotiationsNextPage;
  const hasMore = hasNegotiationsNextPage;

  return (
    <div className={cn('w-full min-h-[70vh]', param.chatId && 'max-lg:hidden')}>
      <CustomInput
        name="search"
        type="text"
        value={search}
        onChange={(e) => debouncedSearch(e.target.value)}
        placeholder="Search..."
        classNames="rounded-md mb-8"
        affix={<Search />}
      />
      <Text variant="pl" fontWeight="semibold" classNames="mb-5">
        {totalConversations} Conversations
      </Text>

      {totalConversations === 0 && !isLoading && (
        <div className="flex items-center justify-center h-[70vh]">
          <Text
            variant="pm"
            fontWeight="regular"
            color="text-gray-300"
            classNames="mb-5"
          >
            No conversations found
          </Text>
        </div>
      )}

      {/* RENDER UNIFIED MESSAGE LIST HERE */}
      {allNegotiations.map((item) => (
        <ChatPreview
          key={`${item?._id}`}
          data={item}
          onClick={() => handleChatClick(item._id)}
        />
      ))}

      {(isLoading || isFetchingNext) && <CustomLoader />}
      {hasMore && !isLoading && (
        <CustomButton
          variant="white"
          label="Load more"
          onClick={() => {
            if (hasNegotiationsNextPage) fetchNegotiationsNextPage();
          }}
          width="w-fit"
          height="h-10"
          fontSize="text-xs"
          color="text-gray-500"
          rightIcon={<ArrowDownToLine height={15} width={15} />}
          classNames="mx-auto gap-1"
        />
      )}
    </div>
  );
};

export { ChatList };