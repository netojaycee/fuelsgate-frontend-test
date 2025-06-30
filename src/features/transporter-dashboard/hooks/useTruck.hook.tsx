import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useContext } from 'react';
import {
  fetchTrucksRequest,
  saveTrucksRequest,
  updateTrucksRequest,
  deleteTruckRequest,
  fetchUserTrucksRequest,
} from '../services/truck.service';
import { TruckDto } from '../types/truck.type';
import { ModalContext } from '@/contexts/ModalContext';
import useToastConfig from '@/hooks/useToastConfig.hook';
import { AuthContext } from '@/contexts/AuthContext';

const useTruckHook = () => {
  const { showToast } = useToastConfig();
  const { handleClose } = useContext(ModalContext);
  const { user } = useContext(AuthContext);
  const role = user?.data?.role;

  const useFetchTrucks = (query?: string, queryKey?: string) => {
    return useInfiniteQuery({
      queryFn: async ({ pageParam = 1 }) => {
        return await fetchTrucksRequest(query ?? '', pageParam);
      },
      initialPageParam: 1,
      queryKey: [queryKey ?? 'TRUCKS'],
      getNextPageParam: (lastPage) => {
        const currentPage = parseInt(lastPage.data.currentPage);
        const totalPage = lastPage.data.totalPages;
        return currentPage < totalPage ? currentPage + 1 : undefined;
      },
      enabled: role === 'buyer' ? false : true,
    });
  };

  const useFetchUserTrucks = (query?: string, queryKey?: string) => {
    return useInfiniteQuery({
      queryFn: async ({ pageParam = 1 }) => {
        return await fetchUserTrucksRequest(query ?? '', pageParam);
      },
      initialPageParam: 1,
      queryKey: [queryKey ?? 'USER_TRUCKS'],
      getNextPageParam: (lastPage) => {
        const currentPage = parseInt(lastPage.data.currentPage);
        const totalPage = lastPage.data.totalPages;
        return currentPage < totalPage ? currentPage + 1 : undefined;
      },
      enabled: role === 'buyer' ? false : true,
    });
  };
  const useSaveTruck = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: Omit<TruckDto, '_id' | 'profileId' | 'status'>) =>
        saveTrucksRequest(data),
      onSuccess: (response) => {
        showToast(response.message, 'success');
        // Invalidate all truck-related queries
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey[0] as string;
            return (
              queryKey?.includes('TRUCK') ||
              queryKey === 'TRUCKS' ||
              queryKey === 'USER_TRUCKS' ||
              queryKey === 'LOCKED_USER_TRUCKS'
            );
          },
        });
        handleClose && handleClose();
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });
  };

  const useUpdateTruck = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: Omit<TruckDto, '_id' | 'profileId' | 'status'>) =>
        updateTrucksRequest(data, id),
      onSuccess: (response) => {
        showToast(response.message, 'success');
        // Invalidate all truck-related queries
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey[0] as string;
            return (
              queryKey?.includes('TRUCK') ||
              queryKey === 'TRUCKS' ||
              queryKey === 'USER_TRUCKS' ||
              queryKey === 'LOCKED_USER_TRUCKS'
            );
          },
        });
        handleClose && handleClose();
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });
  };

  const useDeleteTruck = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => deleteTruckRequest(id),
      onSuccess: (response) => {
        showToast(response.message, 'success');
        // Invalidate all truck-related queries
        queryClient.invalidateQueries({
          predicate: (query) => {
            const queryKey = query.queryKey[0] as string;
            return (
              queryKey?.includes('TRUCK') ||
              queryKey === 'TRUCKS' ||
              queryKey === 'USER_TRUCKS' ||
              queryKey === 'LOCKED_USER_TRUCKS'
            );
          },
        });
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });
  };

  return {
    useFetchTrucks,
    useFetchUserTrucks,
    useSaveTruck,
    useUpdateTruck,
    useDeleteTruck,
  };
};

export default useTruckHook;
