import { useQuery } from '@tanstack/react-query';
import { fetchSellerOrderRequest } from '../services/seller-order.service';

const useSellerOrderHook = () => {
  const useFetchSellerOrders = (query?: string) => {
    return useQuery({
      queryFn: async () => {
        return await fetchSellerOrderRequest(query ?? '');
      },
      queryKey: ['ORDERS', query],
    });
  };

  return {
    useFetchSellerOrders,
  };
};

export default useSellerOrderHook;
