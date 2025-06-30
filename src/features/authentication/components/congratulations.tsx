'use client';
import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import chartImage from '@assets/images/chart.svg';
import { Heading } from '@/components/atoms/heading';
import CustomButton from '@/components/atoms/custom-button';
import { MoveRight } from 'lucide-react';
import { Work_Sans } from 'next/font/google';
import { AuthContext } from '@/contexts/AuthContext';
import { Roles } from '../types/authentication.types';
import { useRouter } from 'next/navigation';

const work_Sans = Work_Sans({ subsets: ['latin'] });

const Congratulations = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { user } = useContext(AuthContext);
  const role: Roles | undefined = user?.data?.role;
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleGoToDashboard = () => router.push('/dashboard');

  return (
    isMounted && (
      <div className="text-center my-20 mx-auto">
        <Image
          src={chartImage}
          alt="Onboarding"
          className="mx-auto"
          width={240}
          height={200}
        />
        <Heading
          variant="h1"
          color="text-deep-gray-300"
          fontWeight="semibold"
          lineHeight="leading-[48px]"
          fontFamily={work_Sans.className}
          classNames="mt-6 mb-4"
        >
          Congratulations &quot;
          <span className="text-gold">{user?.data?.firstName}</span>&quot;
        </Heading>

        <Heading
          variant="h3"
          color="text-deep-gray-300"
          fontWeight="regular"
          lineHeight="leading-[38px]"
          classNames="mb-10 tracking-[-3%]"
        >
          Your dashboard is set.{' '}
          {role === 'seller'
            ? 'We have sent you an email to click start our corporate onboarding process.'
            : ''}
        </Heading>

        <CustomButton
          classNames="mx-auto"
          variant="primary"
          label={
            role === 'seller'
              ? 'Post Your Product and Prices For Today'
              : role === 'transporter'
                ? 'Post Your Trucks for Today'
                : ''
          }
          rightIcon={<MoveRight />}
          fontWeight="semibold"
          width="w-fit"
          onClick={handleGoToDashboard}
        />
      </div>
    )
  );
};

export default Congratulations;
