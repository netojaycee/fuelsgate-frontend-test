import React, { useCallback, useEffect, useState } from 'react';
import SubmitOnboardingBtns from './submit-onboarding-btns';
import useOnboardingHooks from '../hooks/useOnboarding.hooks';
import { useForm } from 'react-hook-form';
import { TransporterDto } from '../types/onboarding.types';
import { yupResolver } from '@hookform/resolvers/yup';
import { renderErrors } from '@/utils/renderErrors';
import { transporterSchema } from '../validations/validations';
import CustomInput from '@/components/atoms/custom-input';
import {
  CustomSelect,
  CustomSelectOption,
} from '@/components/atoms/custom-select';
import { Heading } from '@/components/atoms/heading';

export type TransporterFormProps = {
  depots: CustomSelectOption[];
  loadingDepots: boolean;
};

const TransporterForm = ({ depots, loadingDepots }: TransporterFormProps) => {
  const [depot, setDepot] = useState<CustomSelectOption | undefined>(undefined);
  const { useTransporterOnboarding } = useOnboardingHooks();
  const { mutateAsync: onboardTransporter, isPending } =
    useTransporterOnboarding;

  const {
    setError,
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<Omit<TransporterDto, '_id' | 'userId'> & { state: string }>({
    resolver: yupResolver(transporterSchema),
  });

  const onSubmit = async (data: TransporterDto) => {
    try {
      await onboardTransporter(data);
    } catch (error: any) {
      renderErrors(error?.errors, setError);
    }
  };

  const handleDepotChange = useCallback((value: unknown) => {
    setDepot(value as CustomSelectOption);
  }, []);

  useEffect(() => {
    if (depot) {
      setValue('state', depot.value);
    }
  }, [depot, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading variant="h3" fontWeight="semibold" classNames="mb-12">
        Company Information
      </Heading>
      <div className="grid grid-cols-2 gap-4">
        <CustomInput
          type="text"
          label="Company name"
          register={register}
          error={errors.companyName?.message}
          name="companyName"
          classNames="col-span-full"
        />
        <CustomInput
          type="email"
          label="Company Email"
          register={register}
          error={errors.companyEmail?.message}
          name="companyEmail"
        />
        <CustomInput
          type="text"
          label="Company Address"
          register={register}
          error={errors.companyAddress?.message}
          name="companyAddress"
        />
        <CustomSelect
          label="State"
          name="state"
          onChange={handleDepotChange}
          value={depot}
          error={errors.state?.message}
          classNames="col-span-full"
          options={depots}
          isDisabled={loadingDepots}
        />
        <CustomInput
          type="tel"
          label="Phone Number"
          register={register}
          error={errors.phoneNumber?.message}
          name="phoneNumber"
          classNames="col-span-full"
        />
      </div>

      <SubmitOnboardingBtns isPending={isPending} />
    </form>
  );
};

export default TransporterForm;
