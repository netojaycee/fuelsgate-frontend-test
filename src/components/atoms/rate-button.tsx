import React, { useState, useContext } from 'react';
import CustomButton from '@/components/atoms/custom-button';
import { Star } from 'lucide-react';
import RatingModal from '@/components/molecules/rating-modal';
import { AuthContext } from '@/contexts/AuthContext';

interface RateButtonProps {
  orderId?: string;
  truckOrderId?: string;
  orderType: 'order' | 'truck-order';
  orderStatus: string;
  ratedUser: {
    _id: string;
    firstName: string;
    lastName: string;
    email?: string;
    avatar?: string;
  };
  hasRated?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'outline';
}

const RateButton: React.FC<RateButtonProps> = ({
  orderId,
  truckOrderId,
  orderType,
  orderStatus,
  ratedUser,
  hasRated = false,
  size = 'sm',
  variant = 'outline',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useContext(AuthContext);

  // Only buyers can rate and only when order is completed
  const canRate =
    user?.data?.role === 'buyer' && orderStatus === 'completed' && !hasRated;

  if (!canRate) {
    return null;
  }

  const heightClass = size === 'sm' ? 'h-8' : size === 'md' ? 'h-10' : 'h-12';
  const fontSize =
    size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base';

  return (
    <>
      <CustomButton
        variant={variant}
        height={heightClass}
        fontSize={fontSize}
        fontWeight="medium"
        label="Rate"
        leftIcon={<Star className="h-4 w-4" />}
        onClick={() => setIsModalOpen(true)}
      />

      <RatingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ratedUser={ratedUser}
        orderId={orderId}
        truckOrderId={truckOrderId}
        orderType={orderType}
      />
    </>
  );
};

export default RateButton;
