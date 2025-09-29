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

console.log(ratingsData, 'Ratings Data');
console.log(ratingStats, 'Rating Stats');

  // Handle the actual data structure from your API
  const actualStats = ratingStats?.data;
  const actualRatings = ratingsData?.data?.ratings;

  const displayName =
    user.businessName ||
    user.companyName ||
    `${user.firstName} ${user.lastName}`;
  const userType =
    user.role === 'seller'
      ? 'Seller'
      : user.role === 'transporter'
      ? 'Vendor'
      : 'Customer';

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
                {actualStats && actualStats.totalRatings > 0 && (
                  <div className="flex items-center gap-1">
                    <StarRating rating={actualStats.averageRating} size="sm" />
                    <Text variant="pxs" color="text-gray-500">
                      ({actualStats.totalRatings})
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
            {actualStats && actualStats.totalRatings > 0 ? (
              <div className="mb-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <Heading variant="h6" classNames="mb-4 text-blue-900">
                  ⭐ Rating Overview
                </Heading>

                <div className="flex items-center gap-6 mb-6">
                  <div className="text-center bg-white rounded-lg p-4 shadow-sm border">
                    <div className="text-3xl font-bold text-blue-600 mb-1">
                      {actualStats.averageRating.toFixed(1)}
                    </div>
                    <StarRating rating={actualStats.averageRating} size="md" />
                    <Text variant="pxs" color="text-gray-600" classNames="mt-1">
                      Based on {actualStats.totalRatings} review{actualStats.totalRatings !== 1 ? 's' : ''}
                    </Text>
                  </div>

                  <div className="flex-1">
                    {Object.entries(actualStats.ratingBreakdown)
                      .reverse()
                      .map(([star, count]) => (
                        <div
                          key={star}
                          className="flex items-center gap-3 mb-2"
                        >
                          <div className="flex items-center gap-1 w-12">
                            <Text variant="pxs" fontWeight="medium" classNames="text-gray-700">
                              {star}
                            </Text>
                            <span className="text-yellow-500 text-sm">★</span>
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full transition-all duration-300"
                              style={{
                                width: `${(Number(count) / actualStats.totalRatings) * 100}%`,
                              }}
                            />
                          </div>
                          <Text
                            variant="pxs"
                            color="text-gray-600"
                            classNames="w-8 text-right font-medium"
                          >
                            {Number(count)}
                          </Text>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="text-lg font-semibold text-green-600">
                      {Object.entries(actualStats.ratingBreakdown)
                        .filter(([star]) => parseInt(star) >= 4)
                        .reduce((acc, [, count]) => acc + Number(count), 0)}
                    </div>
                    <Text variant="pxs" color="text-gray-600">
                      Positive Reviews
                    </Text>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="text-lg font-semibold text-blue-600">
                      {Math.round((actualStats.averageRating / 5) * 100)}%
                    </div>
                    <Text variant="pxs" color="text-gray-600">
                      Satisfaction Rate
                    </Text>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6 p-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-center">
                <div className="text-4xl mb-2">⭐</div>
                <Heading variant="h6" classNames="mb-2 text-gray-600">
                  No ratings yet
                </Heading>
                <Text variant="pxs" color="text-gray-500">
                  This user hasn&apos;t received any ratings from transactions
                </Text>
              </div>
            )}

            {/* Reviews List */}
            <div>
              <Heading variant="h6" classNames="mb-4">
                Recent Reviews
              </Heading>

              {ratingsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                </div>
              ) : actualRatings && actualRatings.length > 0 ? (
                <div className="space-y-4">
                  {actualRatings.map((rating: any) => (
                    <div key={rating._id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                              {rating.raterId.firstName[0]}{rating.raterId.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Text variant="ps" fontWeight="medium" color="text-gray-800">
                              {rating.raterId.firstName} {rating.raterId.lastName}
                            </Text>
                            <div className="flex items-center gap-2 mt-1">
                              <StarRating rating={rating.rating} size="sm" />
                              <Badge variant="outline" className="text-xs">
                                {rating.orderType === 'truck' ? '🚛 Truck Order' : '🛢️ Product Order'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Text variant="pxs" color="text-gray-500">
                            {formatDateDashTime(rating.createdAt.toString())}
                          </Text>
                        </div>
                      </div>
                      
                      {rating.review && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg border-l-4 border-blue-200">
                          <Text variant="ps" color="text-gray-700" classNames="italic">
                            &quot;{rating.review}&quot;
                          </Text>
                        </div>
                      )}
                      
                      {/* Rating indicator */}
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            rating.rating >= 4 
                              ? 'bg-green-100 text-green-700' 
                              : rating.rating >= 3 
                              ? 'bg-yellow-100 text-yellow-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {rating.rating >= 4 ? '😊 Positive' : rating.rating >= 3 ? '😐 Neutral' : '😞 Negative'}
                          </span>
                        </div>
                        <Text variant="pxs" color="text-gray-400">
                          Order ID: {rating.orderId.slice(-8)}
                        </Text>
                      </div>
                    </div>
                  ))}

                  {(ratingsData?.totalPages || 1) > 1 && (
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
                        {currentPage} of {ratingsData?.totalPages || 1}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage((p) =>
                            Math.min(ratingsData?.totalPages || 1, p + 1),
                          )
                        }
                        disabled={currentPage === (ratingsData?.totalPages || 1)}
                        className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                  <div className="text-4xl mb-3">💬</div>
                  <Heading variant="h6" classNames="mb-2 text-gray-600">
                    No reviews yet
                  </Heading>
                  <Text variant="pxs" color="text-gray-500">
                    This user hasn&apos;t received any detailed reviews from past transactions
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
