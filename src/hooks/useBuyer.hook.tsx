import {
  fetchBuyerAnalyticsRequest,
  fetchBuyerScrollDataRequest,
} from '@/services/buyer.service';
import { useQuery } from '@tanstack/react-query';

const useBuyerHook = () => {
  const useFetchBuyerAnalytics = () =>
    useQuery({
      queryFn: async () => {
        return await fetchBuyerAnalyticsRequest();
      },
      queryKey: [`BUYER_ANALYTICS`],
    });

  const useFetchBuyerScrollData = () =>
    useQuery({
      queryFn: async () => {
        return await fetchBuyerScrollDataRequest();
      },
      queryKey: [`BUYER_SCROLL_DATA`],
    });

  return { useFetchBuyerAnalytics, useFetchBuyerScrollData };
};

export default useBuyerHook;
