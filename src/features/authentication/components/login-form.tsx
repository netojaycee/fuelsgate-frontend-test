'use client';
import Image from 'next/image';
import React, { useCallback } from 'react';
import GoogleIcon from '@assets/images/Google.svg';
import { Text } from '@/components/atoms/text';
import Link from 'next/link';
import useAuthenticationHook from '../hooks/useAuthentication.hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../validations/validations';
import { renderErrors } from '@/utils/renderErrors';
import { useForm } from 'react-hook-form';
import { LoginDto } from '../types/authentication.types';
import CustomInput from '@/components/atoms/custom-input';
import CustomCheckbox from '@/components/atoms/custom-checkbox';
import CustomButton from '@/components/atoms/custom-button';

const LoginForm = () => {
  const { useLogin } = useAuthenticationHook();
  const { mutateAsync: login, isPending } = useLogin;

  const {
    register,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginDto>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginDto) => {
    try {
      await login(data);
    } catch (error: any) {
      renderErrors(error?.errors, setError);
    }
  };

  const handleOauth = useCallback(async (event: any) => {
    event.preventDefault();
    window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/google/login`;
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CustomInput
        label="Email Address"
        type="email"
        name="email"
        register={register}
        classNames="mb-4"
        error={errors.email?.message}
      />
      <CustomInput
        label="Password"
        type="password"
        name="password"
        register={register}
        classNames="mb-4"
        error={errors.password?.message}
      />

      <div className="flex items-center justify-between gap-3 mb-6">
        <CustomCheckbox name="remember_me" label="Remember me" />
        <Link href="/forgot-password" className="text-gold text-sm font-medium">
          Forgot Password?
        </Link>
      </div>

      <CustomButton
        variant="primary"
        label="Login"
        type="submit"
        loading={isPending}
      />

      <div className="relative my-10">
        <Text
          variant="ps"
          color="text-dark-gray-300"
          lineHeight="leading-[20px]"
          classNames="absolute bottom-[-12px] left-[50%] translate-x-[-50%] text-center inline-block bg-white p-1"
        >
          Or
        </Text>
        <hr className="border-mid-gray-50" />
      </div>

      <CustomButton
        variant="white"
        label="Continue with Google"
        onClick={handleOauth}
        leftIcon={
          <Image src={GoogleIcon} height={20} width={20} alt="Google Icon" />
        }
      />
    </form>
  );
};

export default LoginForm;
