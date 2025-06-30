import React, { useState } from 'react';
import { Text } from '@/components/atoms/text';
import { cn } from '@/lib/utils';
import UserProfileDrawer from '@/components/molecules/user-profile-drawer';

interface ClickableUserNameProps {
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
  variant?: 'ps' | 'pm' | 'pl';
  color?: string;
  className?: string;
  fontWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
}

const ClickableUserName: React.FC<ClickableUserNameProps> = ({
  user,
  variant = 'ps',
  color = 'text-blue-600',
  className,
  fontWeight = 'regular',
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const displayName = `${user.firstName} ${user.lastName}`;

  return (
    <>
      <span
        className={cn(
          'cursor-pointer hover:underline transition-colors duration-200 inline-block',
          className,
        )}
        onClick={() => setIsDrawerOpen(true)}
      >
        <Text variant={variant} color={color} fontWeight={fontWeight as any}>
          {displayName}
        </Text>
      </span>

      <UserProfileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        user={user}
      />
    </>
  );
};

export default ClickableUserName;
