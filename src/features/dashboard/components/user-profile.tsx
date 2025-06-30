import { Sora } from 'next/font/google';
import React, { useContext } from 'react';
import { Text } from '@/components/atoms/text';
import { Heading } from '@/components/atoms/heading';
import { AuthContext } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Roles } from '@/features/authentication/types/authentication.types';
import {
  SellerDto,
  TransporterDto,
} from '@/features/authentication/types/onboarding.types';
import useTransporterHook from '@/hooks/useTransporter.hook';
import useSellerHook from '@/hooks/useSeller.hook';
import { formatNumber } from '@/utils/formatNumber';
import CustomLoader from '@/components/atoms/custom-loader';
import { DepotHubDto } from '@/types/depot-hub.types';
import NumberHandler from '@/components/atoms/number-hander';

const sora = Sora({ subsets: ['latin'] });

const UserProfile = () => {
  const { user, profile } = useContext(AuthContext);
  const role: Roles | undefined = user?.data?.role;

  const { useFetchTransporterAnalytics } = useTransporterHook();
  const { useFetchSellerAnalytics } = useSellerHook();
  const { data: transporter, isLoading: loadingTransporter } =
    useFetchTransporterAnalytics();
  const { data: seller, isLoading: loadingSeller } = useFetchSellerAnalytics();

  // const productAbbreviations = (profile as SellerDto)?.products
  //   ?.map((product) => product.split(' ')[0])
  //   .join(', ');

  return (
    <div className="border border-light-gray-500 rounded-xl p-8 max-xl:px-4 h-full bg-white">
      <div className="flex items-start gap-6 max-xl:gap-3 mb-8">
        <Avatar className="border border-light-gray-700 rounded-[9px] bg-white h-[109px] w-[109px] max-xl:h-[51px] max-xl:w-[51px]">
          <AvatarImage
            src={(profile as SellerDto | TransporterDto)?.profilePicture}
            className="object-cover"
          />
          <AvatarFallback>
            {user?.data?.firstName.charAt(0)}
            {user?.data?.lastName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <Heading
            variant="h6"
            classNames="mb-3"
            fontFamily={sora.className}
            color="text-gold"
          >
            {role === 'seller' && (profile as SellerDto)?.businessName}
            {role === 'transporter' && (profile as TransporterDto)?.companyName}
          </Heading>
          <Text variant="ps" color="text-dark-gray-450" classNames="mb-3">
            {user?.data?.firstName} {user?.data?.lastName}
          </Text>
          <Text variant="pxs" color="text-dark-gray-450">
            {profile && 'phoneNumber' in profile && profile?.phoneNumber}
          </Text>
        </div>
      </div>
      <div className="bg-light-gray-250 px-3 py-5 rounded-lg mb-6">
        <div className="flex items-start mb-3 justify-between gap-3">
          <Text variant="ps" color="text-dark-gray-500" fontWeight="semibold">
            Depot
          </Text>
          <Text variant="ps" color="text-dark-gray-400" fontWeight="semibold">
            {role === 'seller' && (profile as SellerDto)?.depotName}
            {role === 'transporter' &&
              ((profile as TransporterDto)?.state as DepotHubDto)?.name}
          </Text>
        </div>
        <hr className="border-light-gray-700 mb-3" />
        <div className="flex items-start justify-between gap-3">
          <Text variant="ps" color="text-dark-gray-500" fontWeight="semibold">
            Location
          </Text>
          <Text variant="ps" color="text-dark-gray-50" classNames="text-right">
            {role === 'seller' && (profile as SellerDto)?.officeAddress}
            {role === 'transporter' &&
              (profile as TransporterDto)?.companyAddress}
          </Text>
        </div>
      </div>
      <div className="grid grid-cols-2 max-xl:grid-cols-1 gap-4 mb-6">
        {role === 'seller' && (
          <>
            <div className="p-3 rounded-lg border border-mid-gray-350">
              <Text variant="pxs" fontWeight="semibold" classNames="mb-1.5">
                Total Volume Uploaded
              </Text>
              {loadingSeller ? (
                <CustomLoader height="h-6" width="w-6" />
              ) : (
                <Text
                  variant="pm"
                  fontWeight="semibold"
                  fontFamily={sora.className}
                >
                  <NumberHandler number={seller?.data?.totalLitres} />
                </Text>
              )}
            </div>
            <div className="p-3 rounded-lg border border-mid-gray-350">
              <Text variant="pxs" fontWeight="semibold" classNames="mb-1.5">
                Worth
              </Text>
              {loadingSeller ? (
                <CustomLoader height="h-6" width="w-6" />
              ) : (
                <Text
                  variant="pm"
                  fontWeight="semibold"
                  fontFamily={sora.className}
                >
                  <NumberHandler
                    number={
                      seller?.data?.totalWorth * seller?.data?.totalLitres
                    }
                    prefix="₦"
                  />
                </Text>
              )}
            </div>
          </>
        )}

        {role === 'transporter' && (
          <>
            <div className="p-3 rounded-lg border border-mid-gray-350">
              <Text variant="pxs" fontWeight="semibold" classNames="mb-1.5">
                Total Trucks
              </Text>
              {loadingTransporter ? (
                <CustomLoader height="h-6" width="w-6" />
              ) : (
                <Text
                  variant="pm"
                  fontWeight="semibold"
                  fontFamily={sora.className}
                >
                  {formatNumber(transporter?.data?.totalTrucks)}
                </Text>
              )}
            </div>
            <div className="p-3 rounded-lg border border-mid-gray-350">
              <Text variant="pxs" fontWeight="semibold" classNames="mb-1.5">
                Trucks Locked
              </Text>
              {loadingTransporter ? (
                <CustomLoader height="h-6" width="w-6" />
              ) : (
                <Text
                  variant="pm"
                  fontWeight="semibold"
                  fontFamily={sora.className}
                >
                  {formatNumber(transporter?.data?.totalLockedTrucks)}
                </Text>
              )}
            </div>
          </>
        )}
      </div>
      {/* {role === 'seller' && (
        <>
          <Text variant="pl" fontWeight="semibold" classNames="mb-3">
            Services
          </Text>
          <Text variant="pxs" color="text-dark-gray-400">
            We sell quality products ranging from {productAbbreviations}.
          </Text>
        </>
      )} */}
    </div>
  );
};

export default UserProfile;
