'use client';
import React, { useCallback } from 'react';
import CustomInput from '@/components/atoms/custom-input';
import CustomButton from '@/components/atoms/custom-button';
import { Text } from '@/components/atoms/text';
import Image from 'next/image';
import GoogleIcon from '@assets/images/Google.svg';
import useAuthenticationHook from '../hooks/useAuthentication.hooks';
import { registerSchema } from '../validations/validations';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { renderErrors } from '@/utils/renderErrors';
import {
  RegisterFormType,
  Roles,
} from '@/features/authentication/types/authentication.types';

export const SignUpForm = () => {
  const searchParams = useSearchParams();
  const { useRegister } = useAuthenticationHook();
  const { mutateAsync: signUp, isPending } = useRegister;

  const {
    register,
    setError,
    formState: { errors },
    handleSubmit,
  } = useForm<RegisterFormType>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      role: searchParams.get('role') as Roles,
    },
  });

  const onSubmit = async (data: RegisterFormType) => {
    try {
      await signUp(data);
    } catch (error: any) {
      renderErrors(error?.errors, setError);
    }
  };

  const handleOauth = useCallback(
    async (event: any) => {
      event.preventDefault();
      const roleParam = `?role=${searchParams.get('role') as Roles}`;
      window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/google/login${roleParam}`;
    },
    [searchParams],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <hr className="border-mid-gray-50 mb-4" />

      <div className="grid grid-cols-2 gap-3">
        <CustomInput
          register={register}
          label="First Name"
          type="text"
          error={errors.firstName?.message}
          name="firstName"
          classNames="mb-4"
        />
        <CustomInput
          register={register}
          label="Last Name"
          type="text"
          error={errors.lastName?.message}
          name="lastName"
          classNames="mb-4"
        />
      </div>

      <CustomInput
        label="Email Address"
        type="email"
        name="email"
        error={errors.email?.message}
        register={register}
        classNames="mb-4"
      />
      <CustomInput
        label="Password"
        type="password"
        name="password"
        error={errors.password?.message}
        register={register}
        classNames="mb-9"
      />

      <CustomButton
        variant="primary"
        label="Sign Up"
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
        label="Sign up with Google"
        onClick={handleOauth}
        leftIcon={
          <Image src={GoogleIcon} height={20} width={20} alt="Google Icon" />
        }
      />
    </form>
  );
};

export default SignUpForm;
