import {
  fetchPublicStates,
  fetchPublicStateLGA,
} from '@/services/public/state.service';
import { useQuery } from '@tanstack/react-query';

/**
 * Public hook for fetching state and LGA data without authentication
 */
const usePublicState = () => {
  const useFetchPublicStates = useQuery({
    queryFn: async () => {
      return await fetchPublicStates();
    },
    queryKey: ['PUBLIC_STATES'],
  });

  const useFetchPublicStateLGA = (state: string | undefined) => {
    return useQuery({
      queryFn: async () => {
        return await fetchPublicStateLGA(state);
      },
      queryKey: ['PUBLIC_STATE_LGA', state],
      enabled: !!state,
    });
  };

  return {
    useFetchPublicStates,
    useFetchPublicStateLGA,
  };
};

export default usePublicState;
