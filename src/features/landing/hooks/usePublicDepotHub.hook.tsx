import { fetchPublicDepots } from '@/services/public/depot.service';
import { useQuery } from '@tanstack/react-query';

/**
 * Public hook for fetching depot data without authentication
 */
const usePublicDepotHub = (query = '') => {
  const useFetchPublicDepotHubs = useQuery({
    queryFn: async () => {
      return await fetchPublicDepots(query);
    },
    queryKey: ['PUBLIC_DEPOTS', query],
  });

  return {
    useFetchPublicDepotHubs,
  };
};

export default usePublicDepotHub;
