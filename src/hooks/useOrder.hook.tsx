import {
  acceptNegotiationRequest,
  fetchNegotiationsRequest,
  fetchOrderAnalyticsRequest,
  fetchOrdersRequest,
  getNegotiationDetailsRequest,
  getOrderDetailsRequest,
  saveOrdersRequest,
  updateOrderPriceRequest,
  updateOrderRequest,
  updateOrderStatusRequest,
} from '@/services/order.service';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import useToastConfig from './useToastConfig.hook';
import { ModalContext } from '@/contexts/ModalContext';
import { useContext } from 'react';
import { OrderDto, OrderFormDto } from '@/types/order.types';

const useOrderHook = () => {
  const { showToast } = useToastConfig();
  const { handleClose } = useContext(ModalContext);
  const queryClient = useQueryClient();

  const useFetchOffers = (query?: string) => {
    return useInfiniteQuery({
      queryFn: async ({ pageParam = 1 }) => {
        return await fetchOrdersRequest(query ?? '', pageParam);
      },
      initialPageParam: 1,
      queryKey: ['ORDERS', query],
      getNextPageParam: (lastPage) => {
        const currentPage = parseInt(lastPage.data.currentPage);
        const totalPage = lastPage.data.totalPages;
        return currentPage < totalPage ? currentPage + 1 : undefined;
      },
    });
  };

  const useFetchOrderAnalytics = (query?: string) => {
    return useQuery({
      queryFn: async () => {
        return await fetchOrderAnalyticsRequest(query ?? '');
      },
      queryKey: ['ORDER_ANALYTICS', query],
      refetchInterval: 10000,
    });
  };

  const useUpdateOrderStatus = (id: string) => {
    return useMutation({
      mutationFn: (data: Pick<OrderDto, 'status' | 'expiresIn'>) =>
        updateOrderStatusRequest(data, id),
      onSuccess: (response) => {
        showToast(response.message, 'success');
        queryClient.invalidateQueries({ queryKey: ['ORDERS'] });
        handleClose && handleClose();
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });
  };

  const useUpdateOrderPrice = (id: string) => {
    return useMutation({
      mutationFn: (data: Pick<OrderDto, 'price'>) =>
        updateOrderPriceRequest(data, id),
      onSuccess: (response) => {
        showToast(response.message, 'success');
        queryClient.invalidateQueries({ queryKey: ['ORDERS'] });
        handleClose && handleClose();
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });
  };

  // start here

  const useFetchAllOrders = (query?: string) => {
    return useInfiniteQuery({
      queryFn: async ({ pageParam = 1 }) => {
        console.log(query, 'query in useFetchAllOrders');
        return await fetchOrdersRequest(query ?? '', pageParam);
      },
      initialPageParam: 1,
      queryKey: ['ORDERS'],
      getNextPageParam: (lastPage) => {
        const currentPage = parseInt(lastPage.data.currentPage);
        const totalPage = lastPage.data.totalPages;
        return currentPage < totalPage ? currentPage + 1 : undefined;
      },
    });
  };

  const useCreateOrder = () => {
    return useMutation({
      mutationFn: (data: OrderFormDto) => saveOrdersRequest(data),
      onSuccess: (response) => {
        showToast(response.message, 'success');
        queryClient.invalidateQueries({
          queryKey: ['ORDERS'],
        });
        handleClose && handleClose();
      },
      onError: (response) => {
        showToast(response?.message, 'error');
      },
    });
  };

  const useUpdateOrder = (id: string) => {
    return useMutation({
      mutationFn: (data: any) => updateOrderRequest(data, id),
      onSuccess: (response) => {
        // Invalidate both the order detail and the orders list
        showToast(response.message, 'success');
        queryClient.invalidateQueries({
          queryKey: [`${id}_ORDER_DETAIL`, id],
          exact: true,
        });
        queryClient.invalidateQueries({
          queryKey: ['ORDERS'],
          exact: false,
        });
        handleClose && handleClose();
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });
  };

  const useGetOrderDetails = (id: string) =>
    useQuery({
      queryFn: async () => {
        return await getOrderDetailsRequest(id);
      },
      queryKey: [`${id}_ORDER_DETAIL`, id],
    });

  const useFetchAllNegotiations = (query?: string) => {
    return useInfiniteQuery({
      queryFn: async ({ pageParam = 1 }) => {
        console.log(query, 'query in useFetchAllNegotiations');
        return await fetchNegotiationsRequest(query ?? '', pageParam);
      },
      initialPageParam: 1,
      queryKey: ['NEGOTIATIONS'],
      getNextPageParam: (lastPage) => {
        const currentPage = parseInt(lastPage.data.currentPage);
        const totalPage = lastPage.data.totalPages;
        return currentPage < totalPage ? currentPage + 1 : undefined;
      },
    });
  };

  const useGetNegotiationDetails = (id: string) =>
    useQuery({
      queryFn: async () => {
        return await getNegotiationDetailsRequest(id);
      },
      queryKey: [`${id}_NEGOTIATION_DETAIL`, id],
    });
    
    const useAcceptNegotiation = (id: string) => {
    return useMutation({
      mutationFn: (data: any) => acceptNegotiationRequest(data, id),
      onSuccess: (response) => {
        // Invalidate both the negotiation detail and the negotiations list
        showToast(response.message, 'success');
        queryClient.invalidateQueries({
          queryKey: [`${id}_NEGOTIATION_DETAIL`, id],
          exact: true,
        });
        queryClient.invalidateQueries({
          queryKey: ['NEGOTIATIONS'],
          exact: false,
        });
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });
  }

  return {
    useFetchOffers,
    useUpdateOrderStatus,
    useUpdateOrderPrice,
    useFetchOrderAnalytics,

    // start
    useFetchAllOrders,
    useUpdateOrder,
    useCreateOrder,
    useGetOrderDetails,
    useFetchAllNegotiations,
    useGetNegotiationDetails,
    useAcceptNegotiation,
  };
};

export default useOrderHook;
