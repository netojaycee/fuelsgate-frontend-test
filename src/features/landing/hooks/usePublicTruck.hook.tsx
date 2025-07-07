import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPublicTrucksRequest } from '../services/public-truck.service';

const usePublicTruck = () => {
  const useFetchPublicTrucks = (query?: string, queryKey?: string) => {
    return useInfiniteQuery({
      queryFn: async ({ pageParam = 1 }) => {
        return await fetchPublicTrucksRequest(query ?? '', pageParam);
      },
      initialPageParam: 1,
      queryKey: [queryKey ?? 'PUBLIC_TRUCKS'],
      getNextPageParam: (lastPage) => {
        const currentPage = parseInt(lastPage.data.currentPage);
        const totalPage = lastPage.data.totalPages;
        return currentPage < totalPage ? currentPage + 1 : undefined;
      },
    });
  };

  return {
    useFetchPublicTrucks,
  };
};

export default usePublicTruck;
