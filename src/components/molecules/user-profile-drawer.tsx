import React, { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heading } from '@/components/atoms/heading';
import { Text } from '@/components/atoms/text';
import StarRating from '@/components/atoms/star-rating';
import { useUserRatingStats, useUserRatings } from '@/hooks/useRating.hook';
import { Badge } from '@/components/ui/badge';
import { formatDateDashTime } from '@/utils/formatDate';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

interface UserProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    avatar?: string;
    role?: string;
    businessName?: string;
    companyName?: string;
  };
}

const UserProfileDrawer: React.FC<UserProfileDrawerProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const {
    data: ratingStats,
    isLoading: statsLoading,
    error: statsError,
  } = useUserRatingStats(user._id, isOpen);

  const {
    data: ratingsData,
    isLoading: ratingsLoading,
    error: ratingsError,
  } = useUserRatings(user._id, { page: currentPage, limit }, isOpen);

  // console.log(user, 'User Data');

// console.log(ratingsData, 'Ratings Data');
  const displayName =
    user.businessName ||
    user.companyName ||
    `${user.firstName} ${user.lastName}`;
  const userType =
    user.role === 'seller'
      ? 'Seller'
      : user.role === 'transporter'
      ? 'Transporter'
      : 'Buyer';

  if (statsError || ratingsError) {
    return (
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="w-full sm:max-w-md">
          <div className="flex items-center justify-center h-full">
            <Text variant="pxs" color="text-red-500">
              Failed to load user profile
            </Text>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="text-lg">
                {user.firstName[0] }
                {user.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <SheetTitle className="text-left text-lg">
                {displayName}
              </SheetTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">{userType}</Badge>
                {ratingStats && ratingStats.totalRatings > 0 && (
                  <div className="flex items-center gap-1">
                    <StarRating rating={ratingStats.averageRating} size="sm" />
                    <Text variant="pxs" color="text-gray-500">
                      ({ratingStats.totalRatings})
                    </Text>
                  </div>
                )}
              </div>
            </div>
          </div>
        </SheetHeader>

        {statsLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            {/* Rating Stats */}
            {ratingStats && ratingStats.totalRatings > 0 ? (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <Heading variant="h6" classNames="mb-4">
                  Rating Overview
                </Heading>

                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center">
                    <Text variant="ps" fontWeight="bold" color="text-gray-800">
                      {ratingStats.averageRating.toFixed(1)}
                    </Text>
                    <StarRating rating={ratingStats.averageRating} size="sm" />
                    <Text variant="pxs" color="text-gray-500">
                      {ratingStats.totalRatings} reviews
                    </Text>
                  </div>

                  <div className="flex-1">
                    {Object.entries(ratingStats.ratingBreakdown)
                      .reverse()
                      .map(([star, count]) => (
                        <div
                          key={star}
                          className="flex items-center gap-2 mb-1"
                        >
                          <Text variant="pxs" classNames="w-4">
                            {star}★
                          </Text>
                          <Progress
                            value={(count / ratingStats.totalRatings) * 100}
                            className="flex-1 h-2"
                          />
                          <Text
                            variant="pxs"
                            color="text-gray-500"
                            classNames="w-8"
                          >
                            {count}
                          </Text>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
                <Text variant="pxs" color="text-gray-500">
                  No ratings yet
                </Text>
              </div>
            )}

            {/* Reviews List */}
            <div>
              <Heading variant="h6" classNames="mb-4">
                Recent Reviews
              </Heading>

              {ratingsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : ratingsData && ratingsData.data.length > 0 ? (
                <div className="space-y-4">
                  {ratingsData.data.map((rating) => (
                    <div key={rating._id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Text variant="ps" fontWeight="medium">
                            {rating.raterId.firstName} {rating.raterId.lastName}
                          </Text>
                          <StarRating rating={rating.rating} size="sm" />
                        </div>
                        <Text variant="pxs" color="text-gray-500">
                          {formatDateDashTime(rating.createdAt.toString())}
                        </Text>
                      </div>
                      {rating.review && (
                        <Text variant="ps" color="text-gray-700">
                          {rating.review}
                        </Text>
                      )}
                    </div>
                  ))}

                  {ratingsData.totalPages > 1 && (
                    <div className="flex justify-center gap-2 mt-4">
                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.max(1, p - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <span className="px-3 py-1 text-sm">
                        {currentPage} of {ratingsData.totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage((p) =>
                            Math.min(ratingsData.totalPages, p + 1),
                          )
                        }
                        disabled={currentPage === ratingsData.totalPages}
                        className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Text variant="pxs" color="text-gray-500">
                    No reviews yet
                  </Text>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default UserProfileDrawer;
