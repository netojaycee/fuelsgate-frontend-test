import { useQuery } from '@tanstack/react-query';
import { fetchTransporterOrderRequest, fetchUserTransporterOrderRequest } from '../services/truck-order.service';

const useTruckOrderHook = () => {
  const useFetchTransporterOrders = (query?: string) => {
    return useQuery({
      queryFn: async () => {
        return await fetchTransporterOrderRequest(query ?? '');
      },
      queryKey: ['TRANSPORTER_ORDERS'],
    });
  };;

  const useFetchUserTransporterOrders = (query?: string) => {
    return useQuery({
      queryFn: async () => {
        return await fetchUserTransporterOrderRequest(query ?? '');
      },
      queryKey: ['USER_TRANSPORTER_ORDERS'],
    });
  };
  return {
    useFetchTransporterOrders,
    useFetchUserTransporterOrders,
  };
};

export default useTruckOrderHook;
