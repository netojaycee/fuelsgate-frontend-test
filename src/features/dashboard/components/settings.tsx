import CustomButton from '@/components/atoms/custom-button';
import CustomTextarea from '@/components/atoms/custom-textarea';
import { Heading } from '@/components/atoms/heading';
import { Text } from '@/components/atoms/text';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AuthContext } from '@/contexts/AuthContext';
import { Roles } from '@/features/authentication/types/authentication.types';
import {
  SellerDto,
  TransporterDto,
} from '@/features/authentication/types/onboarding.types';
import { DepotHubDto } from '@/types/depot-hub.types';
import { ArrowUpRight, Camera, Key } from 'lucide-react';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react';
import ProfilePictureModal from './profile-picture-modal';

const inter = Inter({ subsets: ['latin'] });

const Settings = () => {
  const { user, profile } = useContext(AuthContext);
  const role: Roles | undefined = user?.data?.role;
  const router = useRouter();

  const handleGotoUpdatePassword = () =>
    router.push('/dashboard/update-password');

  const handleGotoUpdateProfile = () =>
    router.push('/dashboard/update-profile');

  return (
    <div className="py-4">
      <Text
        variant="pl"
        color="text-dark-gray-500"
        fontWeight="medium"
        classNames="mb-6"
      >
        Account Settings
      </Text>
      <div>
        <div className="flex items-start gap-6 max-xl:gap-3 mb-8 px-5 max-xl:px-0">
          <div className="relative h-fit w-fit">
            <Avatar className="border border-gold rounded-[9px] bg-white h-[102px] w-[102px] max-xl:h-[51px] max-xl:w-[51px]">
              <AvatarImage
                src={(profile as SellerDto | TransporterDto)?.profilePicture}
                className="object-cover"
              />
              <AvatarFallback>
                {user?.data?.firstName.charAt(0)}
                {user?.data?.lastName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <ProfilePictureModal
              profilePicture={
                (profile as SellerDto | TransporterDto)?.profilePicture
              }
            />
          </div>
          <div className="self-center">
            <Heading
              variant="h5"
              classNames="mb-2"
              fontFamily={inter.className}
              color="text-dark-500"
            >
              {role === 'seller' && (profile as SellerDto)?.businessName}
              {role === 'transporter' &&
                (profile as TransporterDto)?.companyName}
            </Heading>
            <Text variant="pm" color="text-dark-gray-300" classNames="mb-1">
              {user?.data?.firstName} {user?.data?.lastName}
            </Text>
            <div className="bg-green-tone-100 text-green-tone-800 text-xs text-[26px] rounded-[4px] p-[7px] w-[91px]">
              Depot Owner
            </div>
          </div>
          <CustomButton
            type="button"
            variant="white"
            label="Edit Profile"
            height="h-10"
            width="w-[105px]"
            fontSize="text-sm"
            classNames="rounded-lg ml-auto"
            onClick={handleGotoUpdateProfile}
          />
        </div>
        <hr />
        <div className="grid grid-cols-2 max-md:grid-cols-1 gap-10 mt-8">
          <div>
            <Text
              variant="ps"
              color="text-dark-500"
              fontWeight="medium"
              lineHeight="leading-[20px]"
              classNames="mb-2"
            >
              Profile details
            </Text>
            <div className="bg-light-gray-800 rounded-lg p-4 border border-green-tone-300">
              <Text
                variant="ps"
                color="text-dark-gray-300"
                fontWeight="medium"
                lineHeight="leading-[20px]"
                classNames="mb-2"
              >
                Depot Hub
              </Text>
              <Text
                variant="pm"
                color="text-blue-tone-150"
                fontWeight="medium"
                lineHeight="leading-[24px]"
                classNames="mb-5"
              >
                {role === 'seller' && (profile as SellerDto)?.depotName}
                {role === 'transporter' &&
                  ((profile as TransporterDto)?.state as DepotHubDto)?.name}
              </Text>
              <Text
                variant="ps"
                color="text-dark-gray-300"
                fontWeight="medium"
                lineHeight="leading-[20px]"
                classNames="mb-2"
              >
                Office Address
              </Text>
              <Text
                variant="pm"
                color="text-blue-tone-150"
                fontWeight="medium"
                lineHeight="leading-[24px]"
                classNames="mb-5"
              >
                {role === 'seller' && (profile as SellerDto)?.officeAddress}
                {role === 'transporter' &&
                  (profile as TransporterDto)?.companyAddress}
              </Text>
              {role === 'seller' && (
                <>
                  <Text
                    variant="ps"
                    color="text-dark-gray-300"
                    fontWeight="medium"
                    lineHeight="leading-[20px]"
                    classNames="mb-2"
                  >
                    Products You Store/Trade
                  </Text>
                  <Text
                    variant="pm"
                    color="text-blue-tone-150"
                    fontWeight="medium"
                    lineHeight="leading-[24px]"
                    classNames="mb-5"
                  >
                    {(profile as SellerDto)?.products.map((item, index) => (
                      <span key={item}>
                        {item.substring(0, 3).toUpperCase()}
                        {index < (profile as SellerDto)?.products.length - 1
                          ? ', '
                          : '.'}
                      </span>
                    ))}
                  </Text>
                </>
              )}
              <Text
                variant="ps"
                color="text-dark-gray-300"
                fontWeight="medium"
                lineHeight="leading-[20px]"
                classNames="mb-2"
              >
                Phone Number
              </Text>
              <Text
                variant="pm"
                color="text-blue-tone-150"
                fontWeight="medium"
                lineHeight="leading-[24px]"
                classNames="mb-5"
              >
                {(profile as SellerDto | TransporterDto)?.phoneNumber}
              </Text>
              {role === 'transporter' && (
                <>
                  <Text
                    variant="ps"
                    color="text-dark-gray-300"
                    fontWeight="medium"
                    lineHeight="leading-[20px]"
                    classNames="mb-2"
                  >
                    Email
                  </Text>
                  <Link
                    href={`mailto:${(profile as TransporterDto)?.companyEmail}`}
                  >
                    <Text
                      variant="pm"
                      color="text-blue-tone-450"
                      fontWeight="medium"
                      lineHeight="leading-[24px]"
                      classNames="flex items-center gap-1"
                    >
                      {(profile as TransporterDto)?.companyEmail}
                      <ArrowUpRight />
                    </Text>
                  </Link>
                </>
              )}
            </div>
          </div>
          <div>
            {/* <Text
              variant="ps"
              color="text-blue-tone-450"
              fontWeight="medium"
              lineHeight="leading-[24px]"
              classNames="float-right cursor-pointer"
            >
              Edit
            </Text>
            <CustomTextarea
              label="About Service"
              name="bio"
              classNames="mb-4"
              readOnly={true}
              placeholder="Brief description of services i.e We sell quality products ranging from PMS, AGO, LPG and CNG."
            /> */}

            <CustomButton
              type="button"
              variant="white"
              label="Update Password"
              height="h-10"
              color="text-dark-gray-300"
              width="w-fit"
              fontSize="text-base"
              leftIcon={<Key color="#667085" />}
              classNames="rounded-lg gap-1 ml-auto mt-10"
              onClick={handleGotoUpdatePassword}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
