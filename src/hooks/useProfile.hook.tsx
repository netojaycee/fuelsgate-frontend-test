import { useRouter } from 'next/navigation';
import useToastConfig from './useToastConfig.hook';
import { useMutation } from '@tanstack/react-query';
import { UpdatePasswordDto } from '@/types/user.types';
import { updateUserPasswordRequest } from '@/services/user.service';

const useProfileHook = () => {
  const router = useRouter();
  const { showToast } = useToastConfig();

  const useUpdatePassword = () =>
    useMutation({
      mutationFn: async (data: UpdatePasswordDto) =>
        await updateUserPasswordRequest(data),
      onSuccess: (response: any) => {
        showToast(response.message, 'success');
        router.back();
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });

  return {
    useUpdatePassword,
  };
};

export default useProfileHook;
