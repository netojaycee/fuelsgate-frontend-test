import { fetchPublicProducts } from '@/services/public/product.service';
import { useQuery } from '@tanstack/react-query';

/**
 * Public hook for fetching product data without authentication
 */
const usePublicProduct = (query = '') => {
  const useFetchPublicProducts = useQuery({
    queryFn: async () => {
      return await fetchPublicProducts(query);
    },
    queryKey: ['PUBLIC_PRODUCTS', query],
  });

  return {
    useFetchPublicProducts,
  };
};

export default usePublicProduct;
