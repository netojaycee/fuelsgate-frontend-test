import { requestHandler } from '@/utils/requestHandler';
import {
    CreateRatingDto,
    RatingDto,
    RatingResponse,
    UserRatingStats,
    RatingQueryParams,
} from '@/types/rating.types';

export const ratingService = {
    // Create a new rating
    createRating: async (data: CreateRatingDto): Promise<RatingDto> => {
        const url = '/ratings';
        return await requestHandler('post', url, data);
    },

    // Get ratings for a specific user
    getUserRatings: async (
        userId: string,
        params?: RatingQueryParams,
    ): Promise<RatingResponse> => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.orderType) queryParams.append('orderType', params.orderType);

        const url = `/ratings/user/${userId}?${queryParams.toString()}`;
        return await requestHandler('get', url);
    },

    // Get rating statistics for a user
    getUserRatingStats: async (userId: string): Promise<UserRatingStats> => {
        const url = `/ratings/user/${userId}/stats`;
        return await requestHandler('get', url);
    },

    // Get my ratings (ratings I've given)
    getMyRatings: async (params?: RatingQueryParams): Promise<RatingResponse> => {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page.toString());
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.orderType) queryParams.append('orderType', params.orderType);

        const url = `/ratings/my-ratings?${queryParams.toString()}`;
        return await requestHandler('get', url);
    },

    // Delete a rating
    deleteRating: async (ratingId: string): Promise<void> => {
        const url = `/ratings/${ratingId}`;
        return await requestHandler('delete', url);
    },
};
