import React, { useCallback, useState } from 'react';
import { Sora } from 'next/font/google';
import { Text } from '@/components/atoms/text';
import { RadioGroup } from '@/components/ui/radio-group';
import { RadioButtonField } from '@/components/atoms/radiobutton-field';
import { BuyerDto, BuyerValues } from '../types/onboarding.types';
import useOnboardingHooks from '../hooks/useOnboarding.hooks';
import { useForm } from 'react-hook-form';
import { buyerSchema } from '../validations/validations';
import { yupResolver } from '@hookform/resolvers/yup';
import { renderErrors } from '@/utils/renderErrors';
import SubmitOnboardingBtns from './submit-onboarding-btns';
import { Heading } from '@/components/atoms/heading';

const sora = Sora({ subsets: ['latin'] });

const BuyerForm = () => {
  const [type, setType] = useState<BuyerValues>('reseller');
  const { useBuyerOnboarding } = useOnboardingHooks();
  const { mutateAsync: onboardBuyer, isPending } = useBuyerOnboarding;

  const { setError, setValue, handleSubmit } = useForm<
    Omit<BuyerDto, '_id' | 'userId'>
  >({
    resolver: yupResolver(buyerSchema),
    defaultValues: {
      category: type,
    },
  });

  const onSubmit = async (data: BuyerDto) => {
    try {
      await onboardBuyer(data);
    } catch (error: any) {
      renderErrors(error?.errors, setError);
    }
  };
  const handleCategoryChange = useCallback(
    (value: BuyerValues) => {
      setType(value);
      setValue('category', value);
    },
    [setValue],
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading variant="h3" fontWeight="semibold" classNames="mb-12">
        Who are you buying as?
      </Heading>
      <Text
        variant="pm"
        color="text-blue-tone-200"
        fontWeight="semibold"
        fontFamily={sora.className}
        classNames="mb-5"
      >
        Buyer Category
      </Text>
      <RadioGroup defaultValue={type} onValueChange={handleCategoryChange}>
        <RadioButtonField
          value="reseller"
          name="reseller"
          label="Re-seller (I buy for clients)"
          className="mb-3"
        />
        <RadioButtonField
          value="basic-consumer"
          name="basic-consumer"
          label="Basic Consumer (I buy for myself)"
          className="mb-3"
        />
      </RadioGroup>

      <SubmitOnboardingBtns isPending={isPending} />
    </form>
  );
};

export default BuyerForm;
