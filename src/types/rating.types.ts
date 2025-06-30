export interface CreateRatingDto {
    rating: number;
    review?: string;
    truckOrderId?: string;
    orderId?: string;
    //   ratedUserId: string;
}

export interface RatingDto {
    _id: string;
    rating: number;
    review?: string;
    raterId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    ratedUserId: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    truckOrderId?: string;
    orderId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserRatingStats {
    averageRating: number;
    totalRatings: number;
    ratingBreakdown: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
    recentReviews: RatingDto[];
}

export interface RatingQueryParams {
    page?: number;
    limit?: number;
    userId?: string;
    orderType?: 'truck-order' | 'order';
}

export interface RatingResponse {
    data: RatingDto[];
    totalPages: number;
    currentPage: number;
    totalCount: number;
}
