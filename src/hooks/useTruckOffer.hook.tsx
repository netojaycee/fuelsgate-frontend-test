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
  acceptTruckMessageStatusRequest,
  fetchTruckMessagesRequest,
  fetchTruckOfferAnalyticsRequest,
  fetchTruckOffersRequest,
  getTruckMessageDetailsRequest,
  getTruckOfferDetailsRequest,
  rejectTruckMessageStatusRequest,
  saveTruckOffersRequest,
  sendNewTruckMessageRequest,
  updateTruckMessageStatusRequest,
  updateTruckOfferStatusRequest,
} from '@/services/truckOffer.service';
import {
  TruckOfferDto,
  TruckOfferFormDto,
  SendTruckMessageDto,
} from '@/types/truckOffer.types';
import io from 'socket.io-client';
import { TruckMessageDto } from '@/types/truckMessage.type';

const useTruckOfferHook = () => {
  const { showToast } = useToastConfig();
  const { handleClose } = useContext(ModalContext);

  const useFetchTruckOffers = (query?: string) => {
    return useInfiniteQuery({
      queryFn: async ({ pageParam = 1 }) => {
        return await fetchTruckOffersRequest(query ?? '', pageParam);
      },
      initialPageParam: 1,
      queryKey: ['TRUCK_OFFERS'],
      getNextPageParam: (lastPage) => {
        const currentPage = parseInt(lastPage?.data?.currentPage);
        const totalPage = lastPage?.data?.totalPages;
        return currentPage < totalPage ? currentPage + 1 : undefined;
      },
    });
  };

  const useFetchTruckOfferAnalytics = (query?: string) => {
    return useQuery({
      queryFn: async () => {
        return await fetchTruckOfferAnalyticsRequest(query ?? '');
      },
      queryKey: ['TRUCK_OFFER_ANALYTICS', query],
      refetchInterval: 10000,
    });
  };

  const useCreateNewTruckOffer = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: TruckOfferFormDto) => saveTruckOffersRequest(data),
      onSuccess: (response) => {
        showToast(response.message, 'success');
        queryClient.invalidateQueries({
          queryKey: ['TRUCK_OFFERS', 'TRUCKS'],
        });
        handleClose && handleClose();
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });
  };

  const useUpdateTruckOfferStatus = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: Omit<TruckOfferDto, 'receiverId' | 'truckId'>) =>
        updateTruckOfferStatusRequest(data, id),
      onSuccess: (response) => {
        showToast(response.message, 'success');
        queryClient.invalidateQueries({ queryKey: ['TRUCK_OFFERS'] });
        handleClose && handleClose();
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });
  };

  const useFetchTruckOfferDetails = (id: string, query?: string) =>
    useQuery({
      queryFn: async () => {
        return await getTruckOfferDetailsRequest(query ?? '', id);
      },
      queryKey: [`${id}_TRUCK_OFFER_DETAIL`, query, id],
    });

  const useFetchTruckMessages = (truckOfferId: string, query?: string) => {
    return useInfiniteQuery({
      queryFn: async ({ pageParam = 1 }) => {
        return await fetchTruckMessagesRequest(
          query ?? '',
          pageParam,
          truckOfferId,
        );
      },
      initialPageParam: 1,
      queryKey: [`TRUCK_MESSAGE_LIST_${truckOfferId}`, query, truckOfferId],
      getNextPageParam: (lastPage) => {
        const currentPage = parseInt(lastPage?.data?.currentPage);
        const totalPage = lastPage?.data?.totalPages;
        return currentPage < totalPage ? currentPage + 1 : undefined;
      },
    });
  };

  const useSendNewTruckMessage = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: SendTruckMessageDto) =>
        sendNewTruckMessageRequest(data),
      onSuccess: (response) => {
        showToast(response.message, 'success');
        const truckOfferId = response.truckOfferId;
        queryClient.invalidateQueries({
          queryKey: [`TRUCK_MESSAGE_LIST_${truckOfferId}`],
        });
        handleClose && handleClose();
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });
  };

  const useUpdateTruckMessageStatus = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: Omit<TruckMessageDto, 'offer'>) =>
        updateTruckMessageStatusRequest(data, id),
      onSuccess: (response) => {
        showToast(response.message, 'success');
        const truckOfferId = response.data.truckOfferId;
        queryClient.invalidateQueries({
          queryKey: [`TRUCK_MESSAGE_LIST_${truckOfferId}`],
        });
        handleClose && handleClose();
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });
  };

  const useRejectTruckMessageStatus = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: () =>
        rejectTruckMessageStatusRequest(id),
      onSuccess: (response) => {
        showToast(response.message, 'success');
        const truckOfferId = response.truckOfferId;
        queryClient.invalidateQueries({
          queryKey: [`TRUCK_MESSAGE_LIST_${truckOfferId}`],
        });
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });
  };

  const useAcceptTruckMessageStatus = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: () =>
        acceptTruckMessageStatusRequest(id),
      onSuccess: (response) => {
        showToast(response.message, 'success');
        const truckOfferId = response.truckOfferId;
        queryClient.invalidateQueries({
          queryKey: [`TRUCK_MESSAGE_LIST_${truckOfferId}`],
        });
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });
  };

  const useGetTruckMessageDetails = (id: string) =>
    useQuery({
      queryFn: async () => {
        return await getTruckMessageDetailsRequest(id);
      },
      queryKey: [`${id}_TRUCK_MESSAGE_DETAIL`, id],
    });

  const queryClient = useQueryClient();
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
      transports: ['websocket'],
      secure: true,
      path: '/truck',
    });
    socket.on('receiveTruckMessage', (message) => {
      const truckOfferId = message.truckOfferId;
      queryClient.invalidateQueries({
        queryKey: [`TRUCK_MESSAGE_LIST_${truckOfferId}`, 'TRUCK_OFFERS'],
      });
    });
  }, [queryClient]);

  return {
    useFetchTruckOfferDetails,
    useFetchTruckOffers,
    useCreateNewTruckOffer,
    useUpdateTruckOfferStatus,
    useFetchTruckMessages,
    useSendNewTruckMessage,
    useUpdateTruckMessageStatus,
    useGetTruckMessageDetails,
    useFetchTruckOfferAnalytics,
    useRejectTruckMessageStatus,
    useAcceptTruckMessageStatus,
  };
};

export default useTruckOfferHook;
