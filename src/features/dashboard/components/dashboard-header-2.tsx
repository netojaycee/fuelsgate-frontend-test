'use client';
import React from 'react';
import { FGBack } from '@fg-icons';
import CustomButton from '@/components/atoms/custom-button';
import { useRouter } from 'next/navigation';
import { Text } from '@/components/atoms/text';

const DashboardHeader2 = () => {
  const router = useRouter();
  const goBack = () => router.back();

  return (
    <nav className="h-[99px] bg-[#121217]">
      <div className="container mx-auto h-full flex flex-wrap items-center justify-between">
        <CustomButton
          type="button"
          leftIcon={<FGBack color="white" height={24} width={24} />}
          label="Go back"
          classNames="p-0"
          variant="plain"
          width="w-fit"
          height="h-auto"
          fontWeight="semibold"
          fontSize="text-sm"
          color="text-white hover:text-white"
          onClick={goBack}
        />

        {/* <Text variant='ps' color='text-dark-gray-150' classNames='text-right'>
          Home &nbsp;/&nbsp; Product Details &nbsp;/&nbsp; <span className='text-white'>Orders</span>
        </Text> */}
      </div>
    </nav>
  );
};

export default DashboardHeader2;
