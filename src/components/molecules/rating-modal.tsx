import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Heading } from '@/components/atoms/heading';
import { Text } from '@/components/atoms/text';
import CustomButton from '@/components/atoms/custom-button';
import StarRating from '@/components/atoms/star-rating';
import { Textarea } from '@/components/ui/textarea';
import { useCreateRating } from '@/hooks/useRating.hook';
import { CreateRatingDto } from '@/types/rating.types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ratedUser: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    avatar?: string;
  };
  orderId?: string;
  truckOrderId?: string;
  orderType: 'order' | 'truck-order';
}

const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  ratedUser,
  orderId,
  truckOrderId,
  orderType,
}) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  const { mutate: createRating, isPending } = useCreateRating();

  const handleSubmit = () => {
    if (rating === 0) return;

    const ratingData: CreateRatingDto = {
      rating,
      review: review.trim() || undefined,
      ...(orderType === 'order' ? { orderId } : { truckOrderId }),
    };

    createRating(ratingData, {
      onSuccess: () => {
        setRating(0);
        setReview('');
        onClose();
      },
    });
  };

  const handleClose = () => {
    setRating(0);
    setReview('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Rate Your Experience</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <Avatar className="h-12 w-12">
              <AvatarImage src={ratedUser.avatar} />
              <AvatarFallback>
                {ratedUser.firstName[0]}
                {ratedUser.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <Text variant="pm" fontWeight="semibold">
                {ratedUser.firstName} {ratedUser.lastName}
              </Text>
              <Text variant="ps" color="text-gray-500">
                {orderType === 'order' ? 'Seller' : 'Transporter'}
              </Text>
            </div>
          </div>

          {/* Rating Stars */}
          <div>
            <Text variant="pm" fontWeight="medium" classNames="mb-3">
              How would you rate this{' '}
              {orderType === 'order' ? 'seller' : 'transporter'}?
            </Text>
            <StarRating
              rating={rating}
              interactive
              size="lg"
              onRatingChange={setRating}
              className="justify-center"
            />
            {rating > 0 && (
              <Text
                variant="ps"
                color="text-gray-500"
                classNames="text-center mt-2"
              >
                {rating} out of 5 stars
              </Text>
            )}
          </div>

          {/* Review Text */}
          <div>
            <Text variant="pm" fontWeight="medium" classNames="mb-3">
              Write a review (optional)
            </Text>
            <Textarea
              placeholder="Share your experience..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="min-h-[100px]"
              maxLength={500}
            />
            <Text variant="pxs" color="text-gray-400" classNames="mt-1">
              {review.length}/500 characters
            </Text>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <CustomButton
              variant="secondary"
              label="Cancel"
              onClick={handleClose}
              disabled={isPending}
            />
            <CustomButton
              variant="primary"
              label="Submit Rating"
              onClick={handleSubmit}
              loading={isPending}
              disabled={rating === 0}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RatingModal;
