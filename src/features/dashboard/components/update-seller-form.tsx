import SellerFormFields from '@/components/organism/seller-form-fields';
import { useForm } from 'react-hook-form';
import { renderErrors } from '@/utils/renderErrors';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { CustomSelectOption } from '@/components/atoms/custom-select';
import {
  SellerDto,
  SellerValues,
} from '@/features/authentication/types/onboarding.types';
import { sellerSchema } from '@/features/authentication/validations/validations';
import { SellerFormProps } from '@/features/authentication/components/seller-form';
import CustomButton from '@/components/atoms/custom-button';
import useSellerHook from '@/hooks/useSeller.hook';
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const UpdateSellerForm: React.FC<SellerFormProps> = ({
  depots,
  products,
  loadingDepots,
  loadingProducts,
}) => {
  const [type, setType] = useState<SellerValues>('trader');
  const [depot, setDepot] = useState<CustomSelectOption | undefined>(undefined);
  const [selectedProducts, setSelectedProducts] = useState<
    CustomSelectOption[] | undefined
  >(undefined);
  const router = useRouter();
  const { profile } = useContext(AuthContext);
  const { useUpdateSellerProfile } = useSellerHook();
  const { mutateAsync: updateSellerProfile, isPending } =
    useUpdateSellerProfile();

  const [mounted, setMounted] = useState(false);
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
  } = useForm<Omit<SellerDto, '_id' | 'userId'>>({
    resolver: yupResolver(sellerSchema),
    defaultValues: {
      category: type,
      depotName: (profile as SellerDto)?.depotName,
      businessName: (profile as SellerDto)?.businessName,
      products: (profile as SellerDto)?.products,
      phoneNumber: (profile as SellerDto)?.phoneNumber,
      officeAddress: (profile as SellerDto)?.officeAddress,
      depotAddress: (profile as SellerDto)?.depotAddress,
      depotHub: (profile as SellerDto)?.depotHub,
    },
  });

  const onSubmit = async (data: SellerDto) => {
    try {
      await updateSellerProfile(data);
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
      setValue('depotHub', depot.label);
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

  useEffect(() => {
    if (getValues('depotHub') && depots) {
      const _depotHub = getValues('depotHub');
      const _selectedHub = depots?.find((item) => item.label === _depotHub);
      setDepot(_selectedHub);
    }

    if (getValues('products') && products) {
      const _products = getValues('products');
      const _selectedProducts = products?.filter((item) =>
        _products.includes(item.value),
      );
      setSelectedProducts(_selectedProducts);
    }
  }, [getValues, depots, products]);

  return (
    mounted && (
      <form onSubmit={handleSubmit(onSubmit)}>
        <SellerFormFields
          {...{
            type,
            handleCategoryChange,
            register,
            errors,
            handleProductsChange,
            products,
            selectedProducts,
            loadingProducts,
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

export default UpdateSellerForm;
