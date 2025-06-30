import React from 'react';
import { Text } from '../text';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Poppins, Sora } from 'next/font/google';
import {
  SellerDto,
  TransporterDto,
} from '@/features/authentication/types/onboarding.types';
import { formatNumber } from '@/utils/formatNumber';
import { UserType } from '@/types/user.types';

const sora = Sora({ subsets: ['latin'] });
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

// TODO: document this component using storybook
// TODO: extend the props and define the props
const TransporterRoot = ({ classNames, children }: any) => {
  return (
    <div
      className={cn(
        'border border-mid-gray-550 bg-light-gray-100 rounded-[10px] px-5 max-sm:px-3 pt-7 pb-5',
        classNames,
      )}
    >
      {children}
    </div>
  );
};

const TransporterCard = ({
  data,
  truckSize,
}: {
  data: SellerDto | TransporterDto;
  truckSize: string;
}) => {
  const getBusinessName = (): string => {
    if ('category' in data) return data.businessName;
    if ('companyName' in data) return data.companyName;
    return '';
  };

  const getName = (): string => {
    const firstName = (data.userId as UserType)?.firstName;
    const lastName = (data.userId as UserType)?.lastName;
    return firstName + ' ' + lastName;
  };

  const getInitials = (): string => {
    const firstName = (data?.userId as UserType)?.firstName;
    const lastName = (data?.userId as UserType)?.lastName;
    return firstName?.substring(0, 1) + lastName?.substring(0, 1);
  };

  const getAddress = (): string => {
    if ('category' in data) return data?.officeAddress || '';
    if ('companyAddress' in data) return data?.companyAddress;
    return '';
  };

  const getPhoneNumber = (): string => {
    return data.phoneNumber || 'N/A';
  };

  return (
    <div className="bg-light-gray-250 px-4 pt-7 pb-4 rounded-[10px]">
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Avatar className="h-[66px] w-[66px] border border-gold rounded-lg">
          <AvatarImage src="" className="object-cover" />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>

        <div>
          <Text variant="pl" fontFamily={sora.className}>
            {getBusinessName()}
          </Text>
          <Text variant="ps" color="text-dark-gray-50">
            {getName()}
          </Text>
          <Text
            variant="ps"
            color="text-dark-gray-400"
            fontFamily={poppins.className}
            fontWeight="medium"
          >
            {getAddress()}
          </Text>
        </div>
      </div>

      <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-4">
        <div className="bg-light-gray-400 border border-light-gray-600 px-3 py-2 rounded-[4px]">
          <Text variant="ps" color="text-dark-gray-50">
            Truck Capacity
          </Text>
          <Text
            variant="pl"
            color="text-deep-gray-300"
            fontWeight="semibold"
            fontFamily={sora.className}
          >
            {formatNumber(truckSize)}
          </Text>
        </div>
        <div className="bg-light-gray-400 border border-light-gray-600 px-3 py-2 rounded-[4px]">
          <Text variant="ps" color="text-dark-gray-50">
            Contact
          </Text>
          <Text
            variant="pl"
            color="text-deep-gray-300"
            fontWeight="semibold"
            fontFamily={sora.className}
          >
            {getPhoneNumber()}
          </Text>
        </div>
      </div>
    </div>
  );
};

export { TransporterCard, TransporterRoot };
