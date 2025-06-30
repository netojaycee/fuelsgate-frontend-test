import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import useToastConfig from './useToastConfig.hook';
import { ModalContext } from '@/contexts/ModalContext';
import { useContext } from 'react';
import {
  fetchTruckOrderAnalyticsRequest,
  fetchTruckOrdersRequest,
  getTruckOrderDetailsRequest,
  saveTruckOrdersRequest,
  updateTruckOrderPriceRequest,
  updateTruckOrderRFQStatusRequest,
  updateTruckOrderStatusRequest,
} from '@/services/truck-order.service';
import { TruckOrderDto } from '@/types/truck-order.types';

const useTruckOrderHook = () => {
  const { handleClose } = useContext(ModalContext);
  const { showToast } = useToastConfig();
  const queryClient = useQueryClient();

  const useFetchTruckOrders = (query?: string) => {
    return useInfiniteQuery({
      queryFn: async ({ pageParam = 1 }) => {
        return await fetchTruckOrdersRequest(query ?? '', pageParam);
      },
      initialPageParam: 1,
      queryKey: ['TRUCK_ORDERS', query],
      getNextPageParam: (lastPage) => {
        const currentPage = parseInt(lastPage.data.currentPage);
        const totalPage = lastPage.data.totalPages;
        return currentPage < totalPage ? currentPage + 1 : undefined;
      },
    });
  };

  const useFetchTruckOrderAnalytics = (query?: string) => {
    return useQuery({
      queryFn: async () => {
        return await fetchTruckOrderAnalyticsRequest(query ?? '');
      },
      queryKey: ['TRUCK_ORDER_ANALYTICS', query],
      refetchInterval: 10000,
    });
  };

  const useCreateTruckOrder = () => {
    return useMutation({
      mutationFn: (data: unknown) => saveTruckOrdersRequest(data),
      onSuccess: (response) => {
        showToast(response.message, 'success');
        queryClient.invalidateQueries({
          queryKey: ['TRUCK_ORDERS'],
        });
        handleClose && handleClose();
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });
  };

  const useUpdateTruckOrderStatus = (id: string) => {
    return useMutation({
      mutationFn: (data: Pick<TruckOrderDto, 'status'>) =>
        updateTruckOrderStatusRequest(data, id),
      onSuccess: (response) => {
        showToast(response.message, 'success');
        queryClient.invalidateQueries({ queryKey: ['TRUCK_ORDERS'] });
        handleClose && handleClose();
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });
  };

  const useUpdateTruckOrderRFQStatus = (id: string) => {
    return useMutation({
      mutationFn: (data: Pick<TruckOrderDto, 'rfqStatus'>) =>
        updateTruckOrderRFQStatusRequest(data, id),
      onSuccess: (response) => {
        showToast(response.message, 'success');
        queryClient.invalidateQueries({
          queryKey: ['TRUCK_ORDERS', `${id}_TRUCK_ORDER_DETAIL`],
        });
        handleClose && handleClose();
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });
  };

  const useUpdateTruckOrderPrice = (id: string) => {
    return useMutation({
      mutationFn: (data: Pick<TruckOrderDto, 'price'>) =>
        updateTruckOrderPriceRequest(data, id),
      onSuccess: (response) => {
        showToast(response.message, 'success');
        queryClient.invalidateQueries({
          queryKey: ['TRUCK_ORDERS', `${id}_TRUCK_ORDER_DETAIL`],
        });
        handleClose && handleClose();
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });
  };

  const useGetTruckOrderDetails = (id: string) =>
    useQuery({
      queryFn: async () => {
        return await getTruckOrderDetailsRequest(id);
      },
      queryKey: [`${id}_TRUCK_ORDER_DETAIL`, id],
    });

  return {
    useFetchTruckOrders,
    useCreateTruckOrder,
    useUpdateTruckOrderStatus,
    useUpdateTruckOrderRFQStatus,
    useUpdateTruckOrderPrice,
    useGetTruckOrderDetails,
    useFetchTruckOrderAnalytics,
  };
};

export default useTruckOrderHook;
