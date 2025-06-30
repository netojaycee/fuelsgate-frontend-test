import React from 'react';
import { Text } from '@/components/atoms/text';
import Link from 'next/link';
import LoginForm from '@/features/authentication/components/login-form';
import { Heading } from '@/components/atoms/heading';

const Login = () => {
  return (
    <div className="relative w-full max-w-[454px] m-auto">
      <Heading
        variant="h2"
        color="text-deep-gray-350"
        lineHeight="leading-[43px]"
        fontWeight="semibold"
        classNames="mb-1"
      >
        Welcome Back!
      </Heading>
      <Text
        variant="ps"
        color="text-deep-gray-100"
        lineHeight="leading-[20px]"
        classNames="mb-8"
      >
        Don&apos;t have an account?{' '}
        <Link href="/role-select" className="text-gold font-semibold">
          Sign Up
        </Link>
      </Text>

      <LoginForm />
    </div>
  );
};

export default Login;
