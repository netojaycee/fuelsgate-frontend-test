import { useQuery } from '@tanstack/react-query';
import { fetchProductsRequest } from '@/services/product.service';

const useProductHook = (query?: string) => {
  const useFetchProducts = useQuery({
    queryFn: async () => {
      return await fetchProductsRequest(query ?? '');
    },
    queryKey: ['PRODUCTS', query],
  });

  return {
    useFetchProducts,
  };
};

export default useProductHook;
