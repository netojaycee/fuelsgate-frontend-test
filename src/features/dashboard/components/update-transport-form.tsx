import { useForm } from 'react-hook-form';
import { renderErrors } from '@/utils/renderErrors';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { CustomSelectOption } from '@/components/atoms/custom-select';
import { TransporterDto } from '@/features/authentication/types/onboarding.types';
import { transporterSchema } from '@/features/authentication/validations/validations';
import { TransporterFormProps } from '@/features/authentication/components/transporter-form';
import CustomButton from '@/components/atoms/custom-button';
import TransporterFormFields from '@/components/organism/transporter-form-fields';
import useTransporterHook from '@/hooks/useTransporter.hook';
import { AuthContext } from '@/contexts/AuthContext';
import { DepotHubDto } from '@/types/depot-hub.types';
import { useRouter } from 'next/navigation';

const UpdateTransporterForm: React.FC<TransporterFormProps> = ({
  depots,
  loadingDepots,
}) => {
  const [depot, setDepot] = useState<CustomSelectOption | undefined>(undefined);
  const [mounted, setMounted] = useState(false);
  const { profile } = useContext(AuthContext);
  const router = useRouter();
  const { useUpdateTransporterProfile } = useTransporterHook();
  const { mutateAsync: updateTransporterProfile, isPending } =
    useUpdateTransporterProfile();

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    setError,
    register,
    setValue,
    getValues,
    formState: { errors },
    handleSubmit,
  } = useForm<Omit<TransporterDto, '_id' | 'userId'> & { state: string }>({
    resolver: yupResolver(transporterSchema),
    defaultValues: {
      companyName: (profile as TransporterDto)?.companyName,
      companyAddress: (profile as TransporterDto)?.companyAddress,
      companyEmail: (profile as TransporterDto)?.companyEmail,
      phoneNumber: (profile as TransporterDto)?.phoneNumber,
      state: (profile as TransporterDto)?.state as string,
    },
  });

  const onSubmit = async (data: TransporterDto) => {
    try {
      await updateTransporterProfile(data);
    } catch (error: any) {
      renderErrors(error?.errors, setError);
    }
  };

  useEffect(() => {
    if (getValues('state')) {
      const _state = getValues('state');
      setDepot({
        label: (_state as DepotHubDto)?.name,
        value: (_state as DepotHubDto)?._id,
      });
    }
  }, [getValues]);

  const handleDepotChange = useCallback((value: unknown) => {
    setDepot(value as CustomSelectOption);
  }, []);

  useEffect(() => {
    if (depot) {
      setValue('state', depot.value);
    }
  }, [depot, setValue]);

  return (
    mounted && (
      <form onSubmit={handleSubmit(onSubmit)}>
        <TransporterFormFields
          {...{
            register,
            errors,
            handleDepotChange,
            depot,
            depots,
            loadingDepots,
          }}
        />
        <div className="flex items-center justify-end mt-14 gap-3">
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
    )
  );
};

export default UpdateTransporterForm;
