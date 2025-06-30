import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ratingService } from '@/services/rating.service';
import { CreateRatingDto, RatingQueryParams } from '@/types/rating.types';
import useToastConfig from './useToastConfig.hook';

export const useCreateRating = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastConfig();

  return useMutation({
    mutationFn: (data: CreateRatingDto) => ratingService.createRating(data),
    onSuccess: () => {
      showToast('Rating submitted successfully', 'success');
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['ratings'] });
      queryClient.invalidateQueries({ queryKey: ['userRatingStats'] });
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || 'Something went wrong',
        'error',
      );
    },
  });
};

export const useUserRatings = (
  userId: string,
  params?: RatingQueryParams,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['ratings', 'user', userId, params],
    queryFn: () => ratingService.getUserRatings(userId, params),
    enabled: enabled && !!userId,
  });
};

export const useUserRatingStats = (userId: string, enabled = true) => {
  return useQuery({
    queryKey: ['userRatingStats', userId],
    queryFn: () => ratingService.getUserRatingStats(userId),
    enabled: enabled && !!userId,
  });
};

export const useMyRatings = (params?: RatingQueryParams) => {
  return useQuery({
    queryKey: ['ratings', 'my-ratings', params],
    queryFn: () => ratingService.getMyRatings(params),
  });
};

export const useDeleteRating = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToastConfig();

  return useMutation({
    mutationFn: (ratingId: string) => ratingService.deleteRating(ratingId),
    onSuccess: () => {
      showToast('Rating deleted successfully', 'success');
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['ratings'] });
      queryClient.invalidateQueries({ queryKey: ['userRatingStats'] });
    },
    onError: (error: any) => {
      showToast(
        error.response?.data?.message || 'Something went wrong',
        'error',
      );
    },
  });
};
