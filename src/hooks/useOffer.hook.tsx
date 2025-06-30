import { useContext, useEffect } from 'react';
import useToastConfig from './useToastConfig.hook';
import { ModalContext } from '@/contexts/ModalContext';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  fetchMessagesRequest,
  fetchOfferAnalyticsRequest,
  fetchOffersRequest,
  getMessageDetailsRequest,
  getOfferDetailsRequest,
  saveOffersRequest,
  sendNewMessageRequest,
  updateMessageStatusRequest,
  updateOfferStatusRequest,
} from '@/services/offer.service';
import { OfferDto, OfferFormDto, SendMessageDto } from '@/types/offer.types';
import io from 'socket.io-client';
import { MessageDto } from '@/types/message.type';

const useOfferHook = () => {
  const { showToast } = useToastConfig();
  const { handleClose } = useContext(ModalContext);

  const useFetchOffers = (query?: string) => {
    return useInfiniteQuery({
      queryFn: async ({ pageParam = 1 }) => {
        return await fetchOffersRequest(query ?? '', pageParam);
      },
      initialPageParam: 1,
      queryKey: ['OFFERS'],
      getNextPageParam: (lastPage) => {
        const currentPage = parseInt(lastPage.data.currentPage);
        const totalPage = lastPage.data.totalPages;
        return currentPage < totalPage ? currentPage + 1 : undefined;
      },
    });
  };

  const useFetchOfferAnalytics = (query?: string) => {
    return useQuery({
      queryFn: async () => {
        return await fetchOfferAnalyticsRequest(query ?? '');
      },
      queryKey: ['OFFER_ANALYTICS', query],
      refetchInterval: 10000,
    });
  };

  const useCreateNewOffer = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: OfferFormDto) => saveOffersRequest(data),
      onSuccess: (response) => {
        showToast(response.message, 'success');
        queryClient.invalidateQueries({
          queryKey: ['OFFERS', 'PRODUCT_UPLOADS'],
        });
        handleClose && handleClose();
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });
  };

  const useUpdateOfferStatus = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: Omit<OfferDto, 'receiverId' | 'productUploadId'>) =>
        updateOfferStatusRequest(data, id),
      onSuccess: (response) => {
        showToast(response.message, 'success');
        queryClient.invalidateQueries({ queryKey: ['OFFERS'] });
        handleClose && handleClose();
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });
  };

  const useFetchOfferDetails = (id: string, query?: string) =>
    useQuery({
      queryFn: async () => {
        return await getOfferDetailsRequest(query ?? '', id);
      },
      queryKey: [`${id}_OFFER_DETAIL`, query, id],
    });

  const useFetchMessages = (offerId: string, query?: string) => {
    return useInfiniteQuery({
      queryFn: async ({ pageParam = 1 }) => {
        return await fetchMessagesRequest(query ?? '', pageParam, offerId);
      },
      initialPageParam: 1,
      queryKey: [`MESSAGE_LIST_${offerId}`, query, offerId],
      getNextPageParam: (lastPage) => {
        const currentPage = parseInt(lastPage.data.currentPage);
        const totalPage = lastPage.data.totalPages;
        return currentPage < totalPage ? currentPage + 1 : undefined;
      },
    });
  };

  const useSendNewMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: SendMessageDto) => sendNewMessageRequest(data),
      onSuccess: (response) => {
        showToast(response.message, 'success');
        const offerId = response.data.offerId;
        queryClient.invalidateQueries({
          queryKey: [`MESSAGE_LIST_${offerId}`],
        });
        handleClose && handleClose();
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });
  };

  const useUpdateMessageStatus = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: Omit<MessageDto, 'offer'>) =>
        updateMessageStatusRequest(data, id),
      onSuccess: (response) => {
        showToast(response.message, 'success');
        const offerId = response.data.offerId;
        queryClient.invalidateQueries({
          queryKey: [`MESSAGE_LIST_${offerId}`],
        });
        handleClose && handleClose();
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });
  };

  const useGetMessageDetails = (id: string) =>
    useQuery({
      queryFn: async () => {
        return await getMessageDetailsRequest(id);
      },
      queryKey: [`${id}_OFFER_DETAIL`, id],
    });

  const queryClient = useQueryClient();
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
      transports: ['websocket'],
      secure: true,
    });
    socket.on('receiveMessage', (message) => {
      const offerId = message.offerId;
      queryClient.invalidateQueries({
        queryKey: [`MESSAGE_LIST_${offerId}`, 'OFFERS'],
      });
    });
  }, [queryClient]);

  return {
    useFetchOfferDetails,
    useFetchOffers,
    useCreateNewOffer,
    useUpdateOfferStatus,
    useFetchMessages,
    useSendNewMessage,
    useUpdateMessageStatus,
    useGetMessageDetails,
    useFetchOfferAnalytics,
  };
};

export default useOfferHook;
