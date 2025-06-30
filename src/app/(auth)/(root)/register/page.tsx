import Link from 'next/link';
import React, { Suspense } from 'react';
import { Text } from '@/components/atoms/text';
import SignUpForm from '@/features/authentication/components/sign-up-form';
import { Heading } from '@/components/atoms/heading';

const Register = () => {
  return (
    <div className="relative w-full max-w-[454px] m-auto">
      <Heading
        variant="h2"
        color="text-deep-gray-350"
        lineHeight="leading-[43px]"
        fontWeight="semibold"
        classNames="mb-1"
      >
        Welcome To Fuelsgate!
      </Heading>
      <Text
        variant="ps"
        color="text-deep-gray-100"
        lineHeight="leading-[20px]"
        classNames="mb-8"
      >
        Already have an account? &nbsp;
        <Link href="/login" className="text-gold font-semibold">
          Log In
        </Link>
      </Text>

      <Suspense>
        <SignUpForm />
      </Suspense>
    </div>
  );
};

export default Register;
