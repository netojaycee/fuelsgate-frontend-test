'use client';
import CustomButton from '@/components/atoms/custom-button';
import CustomInput from '@/components/atoms/custom-input';
import { Heading } from '@/components/atoms/heading';
import { Text } from '@/components/atoms/text';
import useProfileHook from '@/hooks/useProfile.hook';
import { UpdatePasswordDto } from '@/types/user.types';
import { renderErrors } from '@/utils/renderErrors';
import { updatePasswordSchema } from '@/validations/user.validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { Sora } from 'next/font/google';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';

const sora = Sora({ subsets: ['latin'] });

const UpdatePassword = () => {
  const { useUpdatePassword } = useProfileHook();
  const { mutateAsync: updatePassword, isPending } = useUpdatePassword();
  const router = useRouter();

  const {
    setError,
    register,
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm<UpdatePasswordDto & { confirmPassword: string }>({
    resolver: yupResolver(updatePasswordSchema),
  });

  const onSubmit = async (data: UpdatePasswordDto) => {
    try {
      await updatePassword(data);
    } catch (error: any) {
      renderErrors(error?.errors, setError);
    }
  };

  return (
    <div className="relative bg-white">
      <div className="container mx-auto py-20">
        <div className="relative max-w-[750px] mx-auto">
          <Heading
            variant="h3"
            fontWeight="semibold"
            fontFamily={sora.className}
            classNames="mb-1"
          >
            Update Password
          </Heading>
          <Text variant="pm" color="text-black_70" classNames="mb-10">
            Update your account security
          </Text>
          <div className="border w-full border-mid-gray-550 px-3 py-20 rounded-[10px]">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="max-w-[512px] mx-auto"
            >
              <CustomInput
                label="Old Password"
                type="password"
                name="currentPassword"
                register={register}
                error={errors.currentPassword?.message}
                classNames="mb-4"
              />
              <CustomInput
                label="New Password"
                type="password"
                name="password"
                register={register}
                error={errors.password?.message}
                classNames="mb-4"
              />
              <CustomInput
                label="Confirm Password"
                type="password"
                register={register}
                error={errors.confirmPassword?.message}
                name="confirmPassword"
                classNames="mb-12"
              />
              <div className="flex items-center justify-end gap-3">
                <CustomButton
                  label="Cancel"
                  variant="white"
                  bgColor="bg-light-gray-250"
                  fontWeight="semibold"
                  classNames="rounded-lg"
                  border="border-0"
                  height="h-11"
                  width="w-fit"
                  onClick={() => router.back()}
                  fontSize="text-sm"
                />
                <CustomButton
                  type="submit"
                  label="Save changes"
                  variant="primary"
                  classNames="rounded-lg"
                  height="h-11"
                  width="w-fit"
                  fontSize="text-sm"
                  loading={isPending}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
