import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchPublicTrucksRequest } from '../services/public-truck.service';

const usePublicTruck = () => {
  const useFetchPublicTrucks = (query?: string, queryKey?: string) => {
    return useInfiniteQuery({
      queryFn: async ({ pageParam = 1 }) => {
        if (!query) {
          return Promise.resolve({ data: { trucks: [] }, totalPages: 0 });
        }
        return await fetchPublicTrucksRequest(query, pageParam);
      },
      queryKey: [queryKey ?? 'PUBLIC_TRUCKS'],
      getNextPageParam: (lastPage) => {
        if (!query) return undefined;

        const currentPage = parseInt(lastPage.data.currentPage);
        const totalPage = lastPage.data.totalPages;
        return currentPage < totalPage ? currentPage + 1 : undefined;
      },
      initialPageParam: 1,
      enabled: !!query,
    });
  };

  return {
    useFetchPublicTrucks,
  };
};

export default usePublicTruck;
