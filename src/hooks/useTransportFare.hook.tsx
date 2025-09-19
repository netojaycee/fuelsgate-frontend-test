import {
  calculateTransportFareRequest,
  fetchLoadPointsRequest,
  FareCalculationRequest,
} from '@/services/transportFare.service';
import { useMutation, useQuery } from '@tanstack/react-query';
import useToastConfig from './useToastConfig.hook';

const useTransportFareHook = () => {
  const { showToast } = useToastConfig();

  const useFetchLoadPoints = () =>
    useQuery({
      queryFn: async () => {
        return await fetchLoadPointsRequest();
      },
    queryKey: [`LOAD_POINTS`],
  });

  const useCalculateFare = () =>
    useMutation({
      mutationFn: async (data: FareCalculationRequest) =>
        await calculateTransportFareRequest(data),
      onSuccess: (response: any) => {
        showToast(response.message || 'Fare calculated successfully', 'success');
      },
      onError: (response: any) => {
        showToast(response.message || 'Failed to calculate fare', 'error');
      },
    });

  return {
    useFetchLoadPoints,
    useCalculateFare,
  };
};

export default useTransportFareHook;
