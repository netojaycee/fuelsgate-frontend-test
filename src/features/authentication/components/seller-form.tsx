import { useForm } from 'react-hook-form';
import { renderErrors } from '@/utils/renderErrors';
import { Heading } from '@/components/atoms/heading';
import { yupResolver } from '@hookform/resolvers/yup';
import { RadioGroup } from '@/components/ui/radio-group';
import { sellerSchema } from '../validations/validations';
import CustomInput from '@/components/atoms/custom-input';
import SubmitOnboardingBtns from './submit-onboarding-btns';
import useOnboardingHooks from '../hooks/useOnboarding.hooks';
import React, { useCallback, useEffect, useState } from 'react';
import { SellerDto, SellerValues } from '../types/onboarding.types';
import { CustomRadioButton } from '@/components/atoms/custom-radiobutton';
import {
  CustomSelect,
  CustomSelectOption,
} from '@/components/atoms/custom-select';
import { CustomProductOptionWrapper } from '@/features/dashboard/components/product-select-components';

export type SellerFormProps = {
  depots: CustomSelectOption[];
  products: CustomSelectOption[];
  loadingDepots: boolean;
  loadingProducts: boolean;
};

const SellerForm = ({
  depots,
  products,
  loadingDepots,
  loadingProducts,
}: SellerFormProps) => {
  const [type, setType] = useState<SellerValues>('trader');
  const [depot, setDepot] = useState<CustomSelectOption | undefined>(undefined);
  const [selectedProducts, setSelectedProducts] = useState<
    CustomSelectOption[] | undefined
  >(undefined);
  const { useSellerOnboarding } = useOnboardingHooks();
  const { mutateAsync: onboardSeller, isPending } = useSellerOnboarding;

  const {
    setError,
    register,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<Omit<SellerDto, '_id' | 'userId'>>({
    resolver: yupResolver(sellerSchema),
    defaultValues: {
      category: type,
    },
  });

  const onSubmit = async (data: SellerDto) => {
    try {
      await onboardSeller(data);
    } catch (error: any) {
      renderErrors(error?.errors, setError);
    }
  };

  const handleCategoryChange = useCallback(
    (value: SellerValues) => {
      setType(value);
      setValue('category', value);
    },
    [setValue],
  );

  const handleDepotChange = useCallback((value: unknown) => {
    setDepot(value as CustomSelectOption);
  }, []);

  useEffect(() => {
    if (depot) {
      setValue('depotHub', depot.value);
    }
  }, [depot, setValue]);

  const handleProductsChange = useCallback((value: unknown) => {
    setSelectedProducts(value as CustomSelectOption[]);
  }, []);

  useEffect(() => {
    if (selectedProducts) {
      setValue(
        'products',
        selectedProducts.map((item) => item.value),
      );
    }
  }, [selectedProducts, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading variant="h3" fontWeight="semibold" classNames="mb-12">
        Business Information
      </Heading>
      <div className="grid grid-cols-1 gap-4">
        <RadioGroup
          defaultValue={type}
          onValueChange={handleCategoryChange}
          className="flex items-center gap-10 mb-2"
        >
          <CustomRadioButton
            label="Depot Owner/Trader"
            name="depot-owner"
            value="depot-owner"
          />
          <CustomRadioButton label="Trader" name="trader" value="trader" />
        </RadioGroup>

        <hr className="mb-4" />

        {type === 'trader' && (
          <CustomInput
            type="text"
            label="Business Name"
            register={register}
            error={errors.businessName?.message}
            name="businessName"
          />
        )}

        {type === 'depot-owner' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                type="text"
                label="Depot Name"
                name="depotName"
                register={register}
                error={errors.depotName?.message}
              />
              <CustomInput
                type="text"
                label="Trading Name"
                name="businessName"
                register={register}
                error={errors.businessName?.message}
              />
            </div>
          </>
        )}
        <CustomSelect
          label={`What Products Do You ${
            type === 'depot-owner' ? 'Store/' : ''
          }Trade?`}
          onChange={handleProductsChange}
          multiple={true}
          error={errors.products?.message}
          name="products"
          Option={CustomProductOptionWrapper}
          options={products}
          isDisabled={loadingProducts}
        />
        <CustomInput
          type="tel"
          label="Phone Number"
          name="phoneNumber"
          register={register}
          error={errors.phoneNumber?.message}
        />
        <CustomInput
          type="text"
          label="Head Office Address"
          name="officeAddress"
          placeholder="Street, City"
          register={register}
          error={errors.officeAddress?.message}
          optional={true}
        />
        {type === 'depot-owner' && (
          <CustomInput
            type="text"
            label="Depot Address"
            name="depotAddress"
            register={register}
            error={errors.depotAddress?.message}
            placeholder="Street, City"
          />
        )}
        <CustomSelect
          label="State/Depot Hub"
          name="depotHub"
          onChange={handleDepotChange}
          value={depot}
          options={depots}
          isDisabled={loadingDepots}
          error={errors.depotHub?.message}
        />
      </div>

      <SubmitOnboardingBtns isPending={isPending} />
    </form>
  );
};

export default SellerForm;
