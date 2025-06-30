import { AuthContext } from '@/contexts/AuthContext';
import { Roles } from '@/features/authentication/types/authentication.types';
import { TransporterDto } from '@/features/authentication/types/onboarding.types';
import {
  fetchTransporterAnalyticsRequest,
  updateTransporterProfilePictureRequest,
  updateTransporterProfileRequest,
} from '@/services/transporter.service';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import useToastConfig from './useToastConfig.hook';
import { useRouter } from 'next/navigation';

const useTransporterHook = () => {
  const { user, storeProfile } = useContext(AuthContext);
  const role: Roles | undefined = user?.data?.role;
  const { showToast } = useToastConfig();
  const router = useRouter();

  const useFetchTransporterAnalytics = () =>
    useQuery({
      queryFn: async () => {
        return await fetchTransporterAnalyticsRequest();
      },
      queryKey: [`TRANSPORTER_ANALYTICS`, user?.data?._id],
      enabled: role === 'transporter',
    });

  const useUpdateTransporterProfile = () =>
    useMutation({
      mutationFn: async (data: TransporterDto) =>
        await updateTransporterProfileRequest(data),
      onSuccess: (response: any) => {
        showToast(response.message, 'success');
        storeProfile && storeProfile(response.data);
        router.back();
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });

  const useUpdateTransporterProfilePicture = () =>
    useMutation({
      mutationFn: async (data: Partial<TransporterDto>) =>
        await updateTransporterProfilePictureRequest(data),
      onSuccess: (response: any) => {
        showToast(response.message, 'success');
        storeProfile && storeProfile(response.data);
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });

  return {
    useFetchTransporterAnalytics,
    useUpdateTransporterProfile,
    useUpdateTransporterProfilePicture,
  };
};

export default useTransporterHook;
