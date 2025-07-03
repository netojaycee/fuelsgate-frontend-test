import { AuthContext } from '@/contexts/AuthContext';
import { ModalContext } from '@/contexts/ModalContext';
import useTruckHook from './useTruck.hook';
import { useContext, useEffect, useState } from 'react';
import { LIST_TRUCK } from '@/modals/list-truck-modal';
import useTruckOrderHook from './useTruckOrder.hook';
import { useQueryClient } from '@tanstack/react-query';
import io from 'socket.io-client';

const useTruckRequestHook = () => {
  const { handleToggle } = useContext(ModalContext);
  const { profile, user } = useContext(AuthContext);
  const role = user?.data?.role;
  const [page, setPage] = useState(1);
  const { useFetchTrucks, useFetchUserTrucks } = useTruckHook();
  const {
    data: trucks,
    isFetching: isLoadingTrucks,
    fetchNextPage: fetchNextTruckPage,
    hasNextPage: truckHasNextPage,
    isFetchingNextPage: loadingFetchNextTruckPage,
  } = useFetchTrucks(`?profileId=${profile?._id}&limit=15&page=`);

  const {
    data: userTrucks,
    isFetching: isLoadingUserTrucks,
    fetchNextPage: fetchNextUserTruckPage,
    hasNextPage: userTruckHasNextPage,
    isFetchingNextPage: loadingFetchNextUserTruckPage,
  } = useFetchUserTrucks(`?status=available,pending&limit=15&page=`, 'USER_TRUCKS');

  const { useFetchTransporterOrders } = useTruckOrderHook();
  const {
    data: truckOrders,
    isLoading: isLoadingOrders,
    error: fetchingTruckError,
    refetch: refetchOrders,
  } = useFetchTransporterOrders(
    `?profileId=${profile?._id}&profileType=${role}&limit=${20}&page=${page}`,
  );

  

  const queryClient = useQueryClient();
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
      transports: ['websocket'],
      secure: true,
    });
    socket.on('updatedTruckOrderPrice', (res) => {
      queryClient.invalidateQueries({
        queryKey: ['TRUCK_ORDERS', `${res._id}_TRUCK_ORDER_DETAIL`],
      });
      refetchOrders();
    });
    socket.on('updatedTruckOrderStatus', (res) => {
      queryClient.invalidateQueries({
        queryKey: ['TRUCK_ORDERS', `${res._id}_TRUCK_ORDER_DETAIL`],
      });
      refetchOrders();
    });
  }, [queryClient, truckOrders, refetchOrders]);

  const openUploadProductModal = () =>
    handleToggle && handleToggle({ name: LIST_TRUCK, data: {}, state: true });

  return {
    trucks,
    isLoadingTrucks,
    truckHasNextPage,
    fetchingTruckError,
    fetchNextTruckPage,
    setPage,
    truckOrders,
    isLoadingOrders,
    openUploadProductModal,
    loadingFetchNextTruckPage,
    userTrucks,
    isLoadingUserTrucks,
    fetchNextUserTruckPage,
    userTruckHasNextPage,
  };
};

export default useTruckRequestHook;
