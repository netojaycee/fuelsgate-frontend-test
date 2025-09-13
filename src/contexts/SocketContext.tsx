'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import io, { Socket } from 'socket.io-client';
import { AuthContext } from './AuthContext';
import { SOCKET_EVENTS } from '../lib/socketEvents';
import useNotificationHook from '../hooks/useNotification.hook';

interface BadgeCounts {
  product_order: number;
  truck_order: number;
  chat: number;
}

interface MessageEvent {
  _id: string;
  content: string;
  status: 'sent' | 'delivered' | 'read';
  messageType: 'user' | 'system';
  offerPrice?: number;
  negotiationId: string;
  userId: string;
  receiverId: string;
  createdAt: string;
  updatedAt: string;
}

interface NegotiationEvent {
  negotiationId: string;
  orderId: string;
  status: 'ongoing' | 'completed' | 'cancelled';
  order?: any;
  message?: any;
  counterOffer?: number;
  reason?: string;
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  badgeCounts: BadgeCounts;
  joinedRooms: string[];
  sendMessage: (payload: {
    negotiationId: string;
    receiverId: string;
    price: number;
  }) => void;
  markMessageRead: (messageId: string) => void;
  markCategoryAsRead: (category: keyof BadgeCounts) => void;
  isReconnecting: boolean;
  // New message and negotiation handlers
  onNewMessage: (callback: (message: MessageEvent) => void) => () => void;
  onSystemMessage: (callback: (message: MessageEvent) => void) => () => void;
  onMessageStatusUpdate: (
    callback: (data: {
      messageId: string;
      status: string;
      readBy?: string;
    }) => void,
  ) => () => void;
  onNegotiationAccepted: (
    callback: (data: NegotiationEvent) => void,
  ) => () => void;
  onNegotiationRejected: (
    callback: (data: NegotiationEvent) => void,
  ) => () => void;
  onNegotiationCancelled: (
    callback: (data: NegotiationEvent) => void,
  ) => () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [joinedRooms, setJoinedRooms] = useState<string[]>([]);
  const [badgeCounts, setBadgeCounts] = useState<BadgeCounts>({
    product_order: 0,
    truck_order: 0,
    chat: 0,
  });

  // Add reconnection state
  const [isReconnecting, setIsReconnecting] = useState(false);
  const reconnectIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 10;

  // Store event callbacks
  const eventCallbacksRef = useRef<{
    onNewMessage: ((message: MessageEvent) => void)[];
    onSystemMessage: ((message: MessageEvent) => void)[];
    onMessageStatusUpdate: ((data: {
      messageId: string;
      status: string;
      readBy?: string;
    }) => void)[];
    onNegotiationAccepted: ((data: NegotiationEvent) => void)[];
    onNegotiationRejected: ((data: NegotiationEvent) => void)[];
    onNegotiationCancelled: ((data: NegotiationEvent) => void)[];
  }>({
    onNewMessage: [],
    onSystemMessage: [],
    onMessageStatusUpdate: [],
    onNegotiationAccepted: [],
    onNegotiationRejected: [],
    onNegotiationCancelled: [],
  });

  // Use refs to store the latest functions without causing re-renders
  const updateBadgeCountRef = useRef<any>(null);
  const markCategoryAsReadRef = useRef<any>(null);
  const startReconnectionIntervalRef = useRef<any>(null);

  const { updateBadgeCount, useMarkCategoryAsRead, useGetBadgeCounts } =
    useNotificationHook();
  const { mutateAsync: markCategoryAsRead } = useMarkCategoryAsRead();

  // Store the latest functions in refs
  updateBadgeCountRef.current = updateBadgeCount;
  markCategoryAsReadRef.current = markCategoryAsRead;

  // Memoize stable values
  const userId = useMemo(() => user?.data?._id, [user?.data?._id]);
  const userToken = useMemo(() => user?.token, [user?.token]);

  // Fetch initial badge counts when user is available
  const { data: initialBadgeCounts, isLoading: isLoadingBadges } =
    useGetBadgeCounts(userId || '');

  console.log('Initial badge counts:', initialBadgeCounts);

  // Update badge counts when initial data is fetched
  useEffect(() => {
    if (initialBadgeCounts && !isLoadingBadges) {
      setBadgeCounts(initialBadgeCounts);
      console.log('Initial badge counts loaded:', initialBadgeCounts);
    }
  }, [initialBadgeCounts, isLoadingBadges]);

  // Event subscription functions
  const onNewMessage = useCallback(
    (callback: (message: MessageEvent) => void) => {
      eventCallbacksRef.current.onNewMessage.push(callback);
      return () => {
        eventCallbacksRef.current.onNewMessage =
          eventCallbacksRef.current.onNewMessage.filter(
            (cb) => cb !== callback,
          );
      };
    },
    [],
  );

  const onSystemMessage = useCallback(
    (callback: (message: MessageEvent) => void) => {
      eventCallbacksRef.current.onSystemMessage.push(callback);
      return () => {
        eventCallbacksRef.current.onSystemMessage =
          eventCallbacksRef.current.onSystemMessage.filter(
            (cb) => cb !== callback,
          );
      };
    },
    [],
  );

  const onMessageStatusUpdate = useCallback(
    (
      callback: (data: {
        messageId: string;
        status: string;
        readBy?: string;
      }) => void,
    ) => {
      eventCallbacksRef.current.onMessageStatusUpdate.push(callback);
      return () => {
        eventCallbacksRef.current.onMessageStatusUpdate =
          eventCallbacksRef.current.onMessageStatusUpdate.filter(
            (cb) => cb !== callback,
          );
      };
    },
    [],
  );

  const onNegotiationAccepted = useCallback(
    (callback: (data: NegotiationEvent) => void) => {
      eventCallbacksRef.current.onNegotiationAccepted.push(callback);
      return () => {
        eventCallbacksRef.current.onNegotiationAccepted =
          eventCallbacksRef.current.onNegotiationAccepted.filter(
            (cb) => cb !== callback,
          );
      };
    },
    [],
  );

  const onNegotiationRejected = useCallback(
    (callback: (data: NegotiationEvent) => void) => {
      eventCallbacksRef.current.onNegotiationRejected.push(callback);
      return () => {
        eventCallbacksRef.current.onNegotiationRejected =
          eventCallbacksRef.current.onNegotiationRejected.filter(
            (cb) => cb !== callback,
          );
      };
    },
    [],
  );

  const onNegotiationCancelled = useCallback(
    (callback: (data: NegotiationEvent) => void) => {
      eventCallbacksRef.current.onNegotiationCancelled.push(callback);
      return () => {
        eventCallbacksRef.current.onNegotiationCancelled =
          eventCallbacksRef.current.onNegotiationCancelled.filter(
            (cb) => cb !== callback,
          );
      };
    },
    [],
  );

  // Clear reconnection interval
  const clearReconnectInterval = useCallback(() => {
    if (reconnectIntervalRef.current) {
      clearInterval(reconnectIntervalRef.current);
      reconnectIntervalRef.current = null;
    }
    setIsReconnecting(false);
  }, []);

  // Setup socket event handlers (extracted to avoid duplication)
  const setupSocketEventHandlers = useCallback(
    (newSocket: Socket) => {
      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('Socket connected:', newSocket.id);
        setIsConnected(true);
        setIsReconnecting(false);
        reconnectAttemptsRef.current = 0;
        clearReconnectInterval();
      });

      newSocket.on('connect_error', (err) => {
        console.error('Socket connection error:', err.message);
        setIsConnected(false);
        setIsReconnecting(false);
      });

      newSocket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        setIsConnected(false);
        setJoinedRooms([]);
      });

      // Handle successful connection from backend
      newSocket.on('connection', (data: { message: string }) => {
        console.log('Backend connection confirmation:', data);
      });

      // Handle room joining confirmation
      newSocket.on('joinedRoom', (data: { roomId: string }) => {
        console.log('Joined room:', data.roomId);
        setJoinedRooms((prev) => {
          if (!prev.includes(data.roomId)) {
            return [...prev, data.roomId];
          }
          return prev;
        });
      });

      // Handle badge count notifications from backend
      newSocket.on(
        'notification',
        (data: {
          type: 'badge_update';
          category: keyof BadgeCounts;
          count: number;
          notification?: any;
        }) => {
          console.log('Received notification:', data);

          if (data.type === 'badge_update') {
            setBadgeCounts((prev) => ({
              ...prev,
              [data.category]: data.count,
            }));

            if (userId && updateBadgeCountRef.current) {
              updateBadgeCountRef.current(userId, data.category, data.count);
            }
          }
        },
      );

      // Handle legacy notification format
      newSocket.on(
        SOCKET_EVENTS.NOTIFICATION,
        (data: {
          type: string;
          negotiationId?: string;
          orderId?: string;
          count?: number;
        }) => {
          console.log('Received legacy notification:', data);

          const categoryMap: Record<string, keyof BadgeCounts> = {
            new_message: 'chat',
            read_message: 'chat',
            new_negotiation: 'chat',
            negotiation_accepted: 'chat',
            negotiation_cancelled: 'chat',
            new_order: 'product_order',
            order_status_updated: 'product_order',
            order_cancelled: 'product_order',
          };

          const category = categoryMap[data.type];
          if (category && data.count !== undefined) {
            setBadgeCounts((prev) => ({
              ...prev,
              [category]: data.count,
            }));

            if (userId && updateBadgeCountRef.current) {
              updateBadgeCountRef.current(userId, category, data.count);
            }
          }
        },
      );

      // New message events from MessageGateway
      newSocket.on('message_sent', (message: MessageEvent) => {
        console.log('Message sent:', message);
        eventCallbacksRef.current.onNewMessage.forEach((callback) =>
          callback(message),
        );
      });

      newSocket.on('system_message', (message: MessageEvent) => {
        console.log('System message:', message);
        eventCallbacksRef.current.onSystemMessage.forEach((callback) =>
          callback(message),
        );
      });

      newSocket.on(
        'message_status_updated',
        (data: { messageId: string; status: string; readBy?: string }) => {
          console.log('Message status updated:', data);
          eventCallbacksRef.current.onMessageStatusUpdate.forEach((callback) =>
            callback(data),
          );
        },
      );

      // Negotiation events from NegotiationGateway
      newSocket.on('negotiation_accepted', (data: NegotiationEvent) => {
        console.log('Negotiation accepted:', data);
        eventCallbacksRef.current.onNegotiationAccepted.forEach((callback) =>
          callback(data),
        );
      });

      newSocket.on('negotiation_rejected', (data: NegotiationEvent) => {
        console.log('Negotiation rejected:', data);
        eventCallbacksRef.current.onNegotiationRejected.forEach((callback) =>
          callback(data),
        );
      });

      newSocket.on('negotiation_cancelled', (data: NegotiationEvent) => {
        console.log('Negotiation cancelled:', data);
        eventCallbacksRef.current.onNegotiationCancelled.forEach((callback) =>
          callback(data),
        );
      });

      // Legacy message events (for backward compatibility)
      newSocket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, (message) => {
        console.log('Received message (legacy):', message);
        eventCallbacksRef.current.onNewMessage.forEach((callback) =>
          callback(message),
        );
      });

      newSocket.on(SOCKET_EVENTS.RECEIVE_NEGOTIATION, (negotiation) => {
        console.log('Received negotiation (legacy):', negotiation);
      });

      newSocket.on(SOCKET_EVENTS.RECEIVE_ORDER, (order) => {
        console.log('Received order:', order);
      });

      newSocket.on(SOCKET_EVENTS.UPDATE_ORDER, (order) => {
        console.log('Received order update:', order);
      });

      newSocket.on('updatedOrderStatus', (order) => {
        console.log('Order status updated:', order);
      });
    },
    // [userId, userToken, clearReconnectInterval],
    [userId, clearReconnectInterval],
  );

  // Rest of your socket connection logic...
  const emitWithLogging = useCallback(
    (event: string, ...args: any[]) => {
      if (socket && isConnected) {
        console.log('Emitting event:', { event, payload: args });
        socket.emit(event, ...args);
      } else {
        console.warn('Cannot emit event: socket not connected', {
          event,
          args,
          isConnected,
        });
      }
    },
    [socket, isConnected],
  );

  // Initialize socket connection
  useEffect(() => {
    if (!user || !userId || !userToken) {
      console.log('Socket connection skipped: user or token missing');
      clearReconnectInterval();
      return;
    }

    const socketUrl = process.env.NEXT_PUBLIC_API_BASE_URL!;
    if (!socketUrl) {
      console.error('NEXT_PUBLIC_API_BASE_URL is not defined');
      return;
    }

    console.log('Initializing Socket.IO connection for user:', userId);

    const newSocket = io(socketUrl, {
      auth: { token: userToken },
      transports: ['websocket'],
      reconnection: false,
      timeout: 10000,
    });

    setupSocketEventHandlers(newSocket);
    setSocket(newSocket);

    return () => {
      console.log('Cleaning up socket connection');
      clearReconnectInterval();
      newSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setJoinedRooms([]);
      reconnectAttemptsRef.current = 0;
    };
  }, [
    user,
    userId,
    userToken,
    setupSocketEventHandlers,
    clearReconnectInterval,
  ]);

  const sendMessage = useCallback(
    (payload: { negotiationId: string; receiverId: string; price: number }) => {
      if (socket && isConnected && user) {
        emitWithLogging(
          SOCKET_EVENTS.SEND_MESSAGE,
          { ...payload, content: `Counter-offer: ${payload.price}` },
          user,
        );
      }
    },
    [socket, isConnected, user, emitWithLogging],
  );

  const markMessageRead = useCallback(
    (messageId: string) => {
      if (socket && isConnected && user) {
        emitWithLogging(SOCKET_EVENTS.MESSAGE_READ, { messageId }, user);
      }
    },
    [socket, isConnected, user, emitWithLogging],
  );

  const handleMarkCategoryAsRead = useCallback(
    async (category: keyof BadgeCounts) => {
      if (!userId) return;

      try {
        if (markCategoryAsReadRef.current) {
          await markCategoryAsReadRef.current({ userId, category });
          setBadgeCounts((prev) => ({ ...prev, [category]: 0 }));
          console.log(`Marked ${category} notifications as read`);
        }
      } catch (error) {
        console.error('Error marking category as read:', error);
      }
    },
    [userId],
  );

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      socket,
      isConnected,
      badgeCounts,
      joinedRooms,
      sendMessage,
      markMessageRead,
      markCategoryAsRead: handleMarkCategoryAsRead,
      isReconnecting,
      onNewMessage,
      onSystemMessage,
      onMessageStatusUpdate,
      onNegotiationAccepted,
      onNegotiationRejected,
      onNegotiationCancelled,
    }),
    [
      socket,
      isConnected,
      badgeCounts,
      joinedRooms,
      sendMessage,
      markMessageRead,
      handleMarkCategoryAsRead,
      isReconnecting,
      onNewMessage,
      onSystemMessage,
      onMessageStatusUpdate,
      onNegotiationAccepted,
      onNegotiationRejected,
      onNegotiationCancelled,
    ],
  );

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};