'use client';
import Image from 'next/image';
import React, { useContext } from 'react';
import Pattern from '@assets/images/Pattern.svg';
import { Poppins, Sora } from 'next/font/google';
import RfqSlip from '@/features/ticket/component/rfq-slip';
import { Heading } from '@/components/atoms/heading';
import { Timer } from '@/components/atoms/timer';
import { Text } from '@/components/atoms/text';
import {
  TransporterCard,
  TransporterRoot,
} from '@/components/atoms/transporter-card';
import { Button } from '@/components/ui/button';
import { ChevronRight, Phone } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FGInfoFill, FGTruck } from '@fg-icons';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CustomButton from '@/components/atoms/custom-button';
import { useParams, useRouter } from 'next/navigation';
import useOrderHook from '@/hooks/useOrder.hook';
import CustomLoader from '@/components/atoms/custom-loader';
import { getMinutesDifference } from '@/utils/formatDate';
import { AuthContext } from '@/contexts/AuthContext';
import { Roles } from '@/features/authentication/types/authentication.types';
import useTruckOrderHook from '@/hooks/useTruckOrder.hook';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const sora = Sora({ subsets: ['latin'] });

const TruckOrderDetails = () => {
  const params = useParams();
  const router = useRouter();
  const { user } = useContext(AuthContext);
  const role: Roles = user?.data?.role as Roles;
  const { useGetTruckOrderDetails } = useTruckOrderHook();
  const { data, isLoading } = useGetTruckOrderDetails(
    params.truckOrderId as string,
  );
  const handleContactClick = () => {
    const phoneNumber =
      role === 'buyer'
        ? (data?.data.profileId as any)?.phoneNumber // Transporter's phone
        : ((data?.data.buyerId as any)?.userId as any)?.phoneNumber; // Buyer's phone

    const a = document.createElement('a');
    a.href = `tel:${phoneNumber}`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="relative bg-white">
      <div className="container mx-auto py-8">
        {isLoading ? (
          <CustomLoader height="h-[500px]" />
        ) : (
          <div className="relative max-w-[1064px] mx-auto border border-mid-gray-550 rounded-[10px]">
            <Image
              src={Pattern}
              alt="pattern"
              className="absolute top-0 left-0 z-0"
              height={440}
              width={1140}
            />

            <div className="relative pt-12 px-8 max-md:px-4 max-sm:px-3 grid grid-cols-12 gap-12 max-lg:gap-6">
              {' '}
              <div className="col-span-5 max-lg:col-span-6 max-md:col-span-12">
                <RfqSlip truckOrder={data.data} />

                {(role === 'buyer' || role === 'transporter') && (
                  <Alert className="rounded-xl bg-blue-tone-50 border-none my-8">
                    <FGInfoFill
                      height={15}
                      width={15}
                      color="#375DFB"
                      className="mt-1"
                    />
                    <AlertTitle className="text-sm font-medium">
                      Important notice
                    </AlertTitle>
                    <AlertDescription className="text-sm text-dark-gray-350">
                      {role === 'transporter'
                        ? 'Platform service charge (3% of transport cost) is payable to maintain service quality and security.'
                        : 'Transport invoice includes platform service charge (4.5% of transport cost) for secure transactions.'}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <div className="col-span-7 max-lg:col-span-6 max-md:col-span-12 py-1">
                <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
                  {' '}
                  <Heading
                    variant="h5"
                    color="text-dark-500"
                    fontWeight="semibold"
                  >
                    Transport RFQ Ticket
                  </Heading>
                  {data?.data.expiresIn && (
                    <Timer
                      time={getMinutesDifference(data?.data.expiresIn)}
                      format="hh:mm"
                    />
                  )}
                </div>

                <TransporterRoot classNames="mb-5">
                  {' '}
                  <div className="flex flex-wrap gap-2 items-center justify-between mb-3.5">
                    <Text
                      variant="pm"
                      color="text-dark-gray-400"
                      fontWeight="medium"
                      classNames="capitalize"
                    >
                      {role === 'buyer' ? 'Transporter' : 'Buyer'} Details
                    </Text>
                    {role === 'buyer' && (
                      <Button
                        type="button"
                        className="flex bg-green-tone-400 text-green-tone-600 hover:bg-green-tone-800 hover:text-white border border-green-tone-800 h-10 rounded-full p-1 gap-1.5 pr-4"
                        onClick={handleContactClick}
                      >
                        <span className="h-[33px] w-[33px] bg-green-tone-800 rounded-full inline-flex items-center justify-center">
                          <Phone height={15} width={15} color="white" />
                        </span>
                        {(data?.data.profileId as any)?.phoneNumber}
                      </Button>
                    )}
                  </div>{' '}
                  <div className="bg-light-gray-250 flex flex-wrap items-start gap-3 px-4 pt-7 pb-4 rounded-[10px] mb-3">
                    {role === 'buyer' ? (
                      <>
                        <Avatar className="h-[38px] w-[38px]">
                          <AvatarImage
                            src={(data?.data.profileId as any)?.profilePicture}
                            className="object-cover"
                          />
                          <AvatarFallback className="bg-light-gray-650">
                            {(
                              data?.data.profileId as any
                            )?.companyName?.substring(0, 1) || 'T'}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <Text
                            variant="pl"
                            fontFamily={sora.className}
                            classNames="mb-1"
                          >
                            {(data?.data.profileId as any)?.companyName}
                          </Text>
                          <Text
                            variant="ps"
                            color="text-dark-gray-50"
                            classNames="mb-2"
                          >
                            {(data?.data.profileId as any)?.companyEmail}
                          </Text>
                          <Text
                            variant="ps"
                            color="text-dark-gray-400"
                            fontFamily={poppins.className}
                            fontWeight="medium"
                          >
                            {(data?.data.profileId as any)?.companyAddress}
                          </Text>
                        </div>
                      </>
                    ) : (
                      <div>
                        <Text
                          variant="pl"
                          fontFamily={sora.className}
                          classNames="mb-1"
                        >
                          {
                            ((data?.data.buyerId as any)?.userId as any)
                              ?.firstName
                          }{' '}
                          {
                            ((data?.data.buyerId as any)?.userId as any)
                              ?.lastName
                          }
                        </Text>
                        <Text
                          variant="ps"
                          color="text-dark-gray-50"
                          classNames="mb-2"
                        >
                          {((data?.data.buyerId as any)?.userId as any)?.email}
                        </Text>
                        <Text
                          variant="ps"
                          color="text-dark-gray-400"
                          fontFamily={poppins.className}
                          fontWeight="medium"
                        >
                          {(data?.data.buyerId as any)?.category} -{' '}
                          {((data?.data.buyerId as any)?.userId as any)?.status}
                        </Text>
                      </div>
                    )}
                  </div>
                  {/* {role === 'buyer' && (
                    <Button
                      type="button"
                      onClick={() => router.push('/dashboard')}
                      className="whitespace-pre-wrap h-auto w-full items-center bg-light-yellow hover:bg-yellow-500 rounded-[10px] py-3 px-4 gap-2"
                    >
                      <FGTruck />
                      <Text color="text-black" variant="pm">
                        Request for transportation quote
                      </Text>
                      <ChevronRight className="ml-auto shrink-0 text-black" />
                    </Button>
                  )} */}
                </TransporterRoot>
              </div>
            </div>

            {/* <div className="flex flex-wrap items-center justify-end gap-3 border-t border-light-gray-700 mt-32 py-6 px-10">
              <CustomButton
                variant="white"
                label="Continue Shopping"
                width="w-[182px]"
                height="h-[55px]"
              />
              <CustomButton
                variant="primary"
                label="Close Offer"
                width="w-[182px]"
                height="h-[55px]"
              />
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default TruckOrderDetails;
