import CustomButton from '@/components/atoms/custom-button';
import { useRouter } from 'next/navigation';
import React from 'react';

type SubmitOnboardingBtnsProps = {
  isPending?: boolean;
  label?: string;
};

const SubmitOnboardingBtns = ({
  isPending,
  label,
}: SubmitOnboardingBtnsProps) => {
  const router = useRouter();
  const handleBack = () => router.back();

  return (
    <div className="flex gap-4 items-center justify-end mt-12">
      <CustomButton
        type="button"
        onClick={handleBack}
        variant="white"
        border="border-2 border-dark-gray-400"
        fontWeight="semibold"
        label="Back"
        width="w-[162px]"
      />
      <CustomButton
        type="submit"
        variant="primary"
        loading={isPending}
        label={label || 'Finish'}
        fontWeight="semibold"
        width="w-[233px]"
      />
    </div>
  );
};

export default SubmitOnboardingBtns;
