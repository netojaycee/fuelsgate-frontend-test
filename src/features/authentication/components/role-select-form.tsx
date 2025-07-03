'use client';
import React, { useCallback, useState } from 'react';
import { Heading } from '@/components/atoms/heading';
import { Text } from '@/components/atoms/text';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/atoms/label';
import SubmitOnboardingBtns from './submit-onboarding-btns';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface RoleSelectFormProps {
  roles: {
    id: string;
    name: string;
    description: string;
  }[];
}

const RoleSelectForm = ({ roles }: RoleSelectFormProps) => {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const router = useRouter();

  const handleRoleChange = useCallback((value: string) => {
    setSelectedRole(value);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      router.push(`/register?role=${selectedRole}`);
    },
    [selectedRole, router],
  );

  return (
    <div className="max-w-[570px] mx-auto">
      <Heading
        variant="h3"
        fontWeight="semibold"
        color="text-deep-gray-350"
        classNames="mb-2"
      >
        Welcome to Fuelsgate Search.
      </Heading>

      <Text
        variant="ps"
        color="text-deep-gray-100"
        lineHeight="leading-[20px]"
        classNames="mb-10"
      >
        Already have an account? &nbsp;
        <Link href="/login" className="text-gold font-semibold">
          Log In
        </Link>
      </Text>

      <div className="flex items-center flex-wrap gap-4 justify-center">
        {roles.map((role) => (
          <Link
            href={`/register?role=${role.id}`}
            key={role.id}
            className="block w-full max-w-[179px] cursor-pointer"
          >
            <span className="w-full  h-[151px] bg-white rounded-[10px] flex flex-col border border-mid-gray-550 p-3">
              <Text
                variant="ps"
                fontWeight="semibold"
                color="text-dark-500"
                classNames="mt-auto mr-auto mb-1.5"
              >
                {role.name}
              </Text>
              <Text variant="pxs" fontWeight="medium" color="text-deep-gray-50">
                {role.description}
              </Text>
            </span>
          </Link>
        ))}
      </div>
      {/* <form onSubmit={handleSubmit}>

        <SubmitOnboardingBtns label="Continue" />
      </form> */}
    </div>
  );
};

export default RoleSelectForm;
