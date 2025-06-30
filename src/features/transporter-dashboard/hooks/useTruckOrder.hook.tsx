import { useQuery } from '@tanstack/react-query';
import { fetchTransporterOrderRequest } from '../services/truck-order.service';

const useTruckOrderHook = () => {
  const useFetchTransporterOrders = (query?: string) => {
    return useQuery({
      queryFn: async () => {
        return await fetchTransporterOrderRequest(query ?? '');
      },
      queryKey: ['TRANSPORTER_ORDERS'],
    });
  };

  return {
    useFetchTransporterOrders,
  };
};

export default useTruckOrderHook;
