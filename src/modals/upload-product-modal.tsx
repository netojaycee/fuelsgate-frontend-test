import { cn } from '@/lib/utils';
import { Sora } from 'next/font/google';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ModalContext } from '@/contexts/ModalContext';
import CustomInput from '@/components/atoms/custom-input';
import CustomButton from '@/components/atoms/custom-button';
import {
  CustomSelect,
  CustomSelectOption,
} from '@/components/atoms/custom-select';
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CustomFileUpload } from '@/components/atoms/custom-fileupload';
import useProductHook from '@/hooks/useProduct.hook';
import useDepotHubHook from '@/hooks/useDepotHub.hook';
import { DepotHubDto } from '@/types/depot-hub.types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ProductUploadDto } from '@/types/product-upload.types';
import { renderErrors } from '@/utils/renderErrors';
import { productUploadSchema } from '@/validations/product-upload.validation';
import useProductUploadHook from '@/hooks/useProductUpload.hook';
import { getMaxExpiresIn } from '@/utils/getMaxExpiresIn';
import { getHoursDifference } from '@/utils/formatDate';
import {
  CustomProductOptionWrapper,
  CustomValueContainerWrapper,
} from '@/features/dashboard/components/product-select-components';
import { ProductDto } from '@/types/product.types';

const sora = Sora({ subsets: ['latin'] });
const UPLOAD_PRODUCT = 'upload-product';

const UploadProductModal = () => {
  const { handleClose, openModal } = useContext(ModalContext);
  const { useFetchDepotHubs } = useDepotHubHook();
  const { data: depotsRes, isLoading: loadingDepots } = useFetchDepotHubs;
  const { useFetchProducts } = useProductHook();
  const { data: productsRes, isLoading: loadingProducts } = useFetchProducts;
  const [depot, setDepot] = useState<CustomSelectOption | undefined>(undefined);
  const [city, setCity] = useState<CustomSelectOption | undefined>(undefined);
  const [productQuality, setProductQuality] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<
    CustomSelectOption | undefined
  >(undefined);
  const { useUploadProduct, useUpdateProductUpload } = useProductUploadHook();
  const { mutateAsync: saveProductUpload, isPending: isSavingData } =
    useUploadProduct();
  const { mutateAsync: updateProductUpload, isPending: isSavingUpdatedData } =
    useUpdateProductUpload(openModal?.data?.product?._id);

  const {
    setError,
    register,
    getValues,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<
    Omit<ProductUploadDto, '_id' | 'sellerId' | 'status'> & {
      productId: string;
      depotHubId: string;
    }
  >({
    resolver: yupResolver(productUploadSchema),
    defaultValues: {
      ...(openModal?.data?.product ? { ...openModal?.data?.product } : {}),
      expiresIn: openModal?.data?.product
        ? getHoursDifference(openModal.data.product.expiresIn)
        : undefined,
      productId: openModal?.data?.product?.productId?._id || '',
      depotHubId: openModal?.data?.product?.depotHubId?._id || '',
      depot: openModal?.data?.product?.depot || '',
    },
  });

  const onSubmit = async (
    data: Omit<ProductUploadDto, '_id' | 'sellerId' | 'status'>,
  ) => {
    try {
      if (openModal?.data.edit) {
        await updateProductUpload(data);
      } else {
        await saveProductUpload(data);
      }
    } catch (error: any) {
      renderErrors(error?.errors, setError);
    }
  };

  const depots = useMemo(() => {
    if (depotsRes) {
      return depotsRes?.data
        ?.sort((a: DepotHubDto, b: DepotHubDto) => a.name.localeCompare(b.name))
        ?.map((item: DepotHubDto) => ({
          label: item.name,
          value: item._id,
        }));
    }
  }, [depotsRes]);

  const cities = useMemo(() => {
    if (depot) {
      return depotsRes?.data
        ?.find((item: DepotHubDto) => item._id === depot.value)
        ?.depots?.sort((a: string, b: string) => a.localeCompare(b))
        ?.map((item: string) => ({
          label: item,
          value: item,
        }));
    }
  }, [depot, depotsRes]);

  const products = useMemo(() => {
    if (productsRes) {
      return productsRes?.data?.products.map((item: ProductDto) => ({
        color: item.color,
        slug: item.value,
        label: item.value.toLocaleUpperCase(),
        value: item._id,
      }));
    }
  }, [productsRes]);

  useEffect(() => {
    if (depot) {
      setValue('depotHubId', depot.value);
    }
  }, [depot, setValue]);

  const handleDepotChange = useCallback((value: unknown) => {
    setDepot(value as CustomSelectOption);
  }, []);

  const handleProductsChange = useCallback((value: unknown) => {
    setSelectedProduct(value as CustomSelectOption);
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setValue('productId', selectedProduct.value);
    }
  }, [selectedProduct, setValue]);

  useEffect(() => {
    if (city) {
      setValue('depot', city.value);
    }
  }, [city, setValue]);

  const handleProductQualityChange = useCallback((value: string) => {
    setProductQuality(value);
  }, []);

  const handleCityChange = useCallback((value: unknown) => {
    setCity(value as CustomSelectOption);
  }, []);

  useEffect(() => {
    if (productQuality) {
      setValue('productQuality', productQuality);
    }
  }, [productQuality, setValue]);

  useEffect(() => {
    if (getValues('productId') && products && products.length > 0) {
      const _selectedProduct = products?.find(
        (item: CustomSelectOption) => item.value === getValues('productId'),
      );
      if (_selectedProduct) setSelectedProduct(_selectedProduct);
    }

    if (getValues('depotHubId')) {
      const _selectedDepotHub = depots?.find(
        (item: CustomSelectOption) => item.value === getValues('depotHubId'),
      );
      if (_selectedDepotHub) setDepot(_selectedDepotHub);
    }

    if (getValues('productQuality')) {
      setProductQuality(getValues('productQuality') as string);
    }

    if (getValues('depot')) {
      const _selectedCity = cities?.find(
        (item: CustomSelectOption) => item.value === getValues('depot'),
      );
      if (_selectedCity) setCity(_selectedCity);
    }
  }, [cities, getValues, products, depots]);

  return (
    <>
      <DialogHeader>
        <DialogTitle
          className={cn(
            'leading-5 text-blue-tone-200 font-semibold text-2xl',
            sora.className,
          )}
        >
          Upload product
        </DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogDescription className="text-dark-gray-400 text-sm mb-10">
          Enter new product and pricing for the day.
        </DialogDescription>

        <div className="bg-light-gray-150 grid grid-cols-2 gap-3 py-[10px] px-4 rounded-[10px] mb-3">
          <CustomSelect
            name="productId"
            label="Select product"
            options={products}
            Option={CustomProductOptionWrapper}
            ValueContainer={CustomValueContainerWrapper}
            value={selectedProduct}
            onChange={handleProductsChange}
            error={errors.productId?.message}
            isDisabled={loadingProducts}
          />
          <CustomInput
            type="number"
            name="volume"
            label="Available volume"
            affix="Ltr"
            error={errors.volume?.message}
            register={register}
          />
        </div>

        <div className="bg-light-gray-150 grid grid-cols-2 gap-3 py-[10px] px-4 rounded-[10px] mb-3">
          <CustomSelect
            name="depotHubId"
            label="Depot hub"
            options={depots}
            value={depot}
            onChange={handleDepotChange}
            error={errors.depotHubId?.message}
            isDisabled={loadingDepots}
          />
          <CustomSelect
            name="depot"
            label="Depot"
            options={cities}
            value={city}
            onChange={handleCityChange}
            error={errors.depot?.message}
            isDisabled={loadingDepots}
          />
          <CustomInput
            type="number"
            name="price"
            label="Opening price"
            prefix="₦"
            error={errors.price?.message}
            register={register}
            prefixPadding="pl-9"
          />
          <CustomInput
            type="number"
            name="expiresIn"
            label="Price Duration"
            affix="hours"
            min={1}
            max={getMaxExpiresIn()}
            affixPadding="pr-16"
            error={errors.expiresIn?.message}
            register={register}
          />
        </div>

        <div className="bg-light-gray-150 py-[10px] px-4 rounded-[10px] mb-8">
          <CustomFileUpload
            fileType="pdf"
            name="productQuality"
            defaultValue={productQuality}
            onChange={handleProductQualityChange}
            error={errors.productQuality?.message}
          />
        </div>

        <div className="flex items-center gap-2">
          <CustomButton
            variant="white"
            label="Close"
            onClick={handleClose}
            border="border-black border"
          />
          <CustomButton
            type="submit"
            variant="primary"
            label="Confirm"
            loading={isSavingData || isSavingUpdatedData}
          />
        </div>
      </form>
    </>
  );
};

export { UploadProductModal, UPLOAD_PRODUCT };
