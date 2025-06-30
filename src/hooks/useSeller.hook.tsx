import { AuthContext } from '@/contexts/AuthContext';
import { Roles } from '@/features/authentication/types/authentication.types';
import { SellerDto } from '@/features/authentication/types/onboarding.types';
import {
  fetchSellerAnalyticsRequest,
  updateSellerProfilePictureRequest,
  updateSellerProfileRequest,
} from '@/services/seller.service';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import useToastConfig from './useToastConfig.hook';
import { useRouter } from 'next/navigation';

const useSellerHook = () => {
  const { user, storeProfile } = useContext(AuthContext);
  const role: Roles | undefined = user?.data?.role;
  const { showToast } = useToastConfig();
  const router = useRouter();

  const useFetchSellerAnalytics = () =>
    useQuery({
      queryFn: async () => await fetchSellerAnalyticsRequest(),
      queryKey: [`SELLER_ANALYTICS`, user?.data?._id],
      enabled: role === 'seller',
    });

  const useUpdateSellerProfile = () =>
    useMutation({
      mutationFn: async (data: SellerDto) =>
        await updateSellerProfileRequest(data),
      onSuccess: (response: any) => {
        showToast(response.message, 'success');
        storeProfile && storeProfile(response.data);
        router.back();
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });

  const useUpdateSellerProfilePicture = () =>
    useMutation({
      mutationFn: async (data: Partial<SellerDto>) =>
        await updateSellerProfilePictureRequest(data),
      onSuccess: (response: any) => {
        showToast(response.message, 'success');
        storeProfile && storeProfile(response.data);
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });

  return {
    useFetchSellerAnalytics,
    useUpdateSellerProfile,
    useUpdateSellerProfilePicture,
  };
};

export default useSellerHook;
