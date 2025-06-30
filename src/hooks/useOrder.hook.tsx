import {
  fetchOrderAnalyticsRequest,
  fetchOrdersRequest,
  getOrderDetailsRequest,
  saveOrdersRequest,
  updateOrderPriceRequest,
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
import { AuthContext } from '@/contexts/AuthContext';
import { Roles } from '@/features/authentication/types/authentication.types';

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

  const useGetOrderDetails = (id: string) =>
    useQuery({
      queryFn: async () => {
        return await getOrderDetailsRequest(id);
      },
      queryKey: [`${id}_ORDER_DETAIL`, id],
    });

  return {
    useFetchOffers,
    useCreateOrder,
    useUpdateOrderStatus,
    useUpdateOrderPrice,
    useGetOrderDetails,
    useFetchOrderAnalytics,
  };
};

export default useOrderHook;
