import { fetchDepotRequest } from '@/services/depot-hub.service';
import { useQuery } from '@tanstack/react-query';

const useDepotHubHook = (query?: string) => {
  const useFetchDepotHubs = useQuery({
    queryFn: async () => {
      return await fetchDepotRequest(query ?? '');
    },
    queryKey: ['DEPOTS', query],
  });

  return {
    useFetchDepotHubs,
  };
};

export default useDepotHubHook;
