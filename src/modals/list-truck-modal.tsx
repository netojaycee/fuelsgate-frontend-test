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
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  CustomSelect,
  CustomSelectOption,
} from '@/components/atoms/custom-select';
import { LitreValueContainerWrapper } from './truck-capacity-value';
import useDepotHubHook from '@/hooks/useDepotHub.hook';
import useTruckHook from '@/features/transporter-dashboard/hooks/useTruck.hook';
import { useForm } from 'react-hook-form';
import { TruckDto } from '@/features/transporter-dashboard/types/truck.type';
import { yupResolver } from '@hookform/resolvers/yup';
import { truckSchema } from '@/features/transporter-dashboard/validations/truck.validation';
import { renderErrors } from '@/utils/renderErrors';
import { DepotHubDto } from '@/types/depot-hub.types';
import { TRUCK_SIZES } from '@/data/truck-sizes';
import useProductHook from '@/hooks/useProduct.hook';
import { ProductDto } from '@/types/product.types';
import useStateHook from '@/hooks/useState.hook';
import {
  CustomProductOptionWrapper,
  CustomValueContainerWrapper,
} from '@/features/dashboard/components/product-select-components';

const sora = Sora({ subsets: ['latin'] });
const LIST_TRUCK = 'list_truck';

const ListTruckModal = () => {
  const { handleClose, openModal } = useContext(ModalContext);
  const { useFetchDepotHubs } = useDepotHubHook();
  const { data: depotHubsRes, isLoading: loadingDepotHubs } = useFetchDepotHubs;
  const [depotHub, setDepotHub] = useState<CustomSelectOption | undefined>(
    undefined,
  );
  const [selectedState, setSelectedState] = useState<
    CustomSelectOption | undefined
  >(undefined);
  const [selectedLGA, setSelectedLGA] = useState<
    CustomSelectOption | undefined
  >(undefined);
  const { useFetchProducts } = useProductHook();
  const { data: productsRes, isLoading: loadingProducts } = useFetchProducts;
  const [product, setProduct] = useState<CustomSelectOption | undefined>(
    undefined,
  );
  const [depot, setDepot] = useState<CustomSelectOption | undefined>(undefined);
  const [capacity, setCapacity] = useState<CustomSelectOption | undefined>(
    undefined,
  );
  const [customCapacity, setCustomCapacity] = useState<string>('');
  const [showCustomCapacity, setShowCustomCapacity] = useState<boolean>(false);
  const { useSaveTruck, useUpdateTruck } = useTruckHook();
  const { mutateAsync: saveTruck, isPending: isSavingData } = useSaveTruck();
  const { mutateAsync: updateTruck, isPending: isSavingUpdatedData } =
    useUpdateTruck(openModal?.data?.truck?._id);
  const { useFetchStates, useFetchStateLGA } = useStateHook();
  const { data: stateRes, isLoading: loadingState } = useFetchStates;
  const { data: lgaRes, isLoading: loadingLGA } = useFetchStateLGA(
    selectedState?.value,
  );
  const {
    setError,
    register,
    getValues,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<
    Omit<TruckDto, '_id' | 'profileId' | 'status'> & {
      depotHubId: string;
      productId: string;
    }
  >({
    resolver: yupResolver(truckSchema),
    defaultValues: {
      ...(openModal?.data?.truck ? { ...openModal?.data?.truck } : {}),
      depotHubId: openModal?.data?.truck?.depotHubId?._id || '',
      productId: openModal?.data?.truck?.productId?._id || '',
      profileId: openModal?.data?.truck?.profileId?._id || '',
      currentState: openModal?.data?.truck?.currentState || '',
      currentCity: openModal?.data?.truck?.currentCity || '',
    },
  });
  const onSubmit = async (
    data: Omit<TruckDto, '_id' | 'profileId' | 'status'>,
  ) => {
    try {
      // Validate custom capacity if "others" is selected
      if (showCustomCapacity) {
        if (
          !customCapacity ||
          isNaN(parseInt(customCapacity)) ||
          parseInt(customCapacity) <= 0
        ) {
          setError('capacity', {
            type: 'manual',
            message: 'Please enter a valid custom capacity value',
          });
          return;
        }
        data.capacity = customCapacity;
      }

      if (openModal?.data.edit) {
        await updateTruck(data);
      } else {
        await saveTruck(data);
      }
    } catch (error: any) {
      renderErrors(error?.errors, setError);
    }
  };

  const handleStateChange = useCallback((value: unknown) => {
    setSelectedState(value as CustomSelectOption);
  }, []);

  const handleLGAChange = useCallback((value: unknown) => {
    setSelectedLGA(value as CustomSelectOption);
  }, []);

  const depotHubs = useMemo(() => {
    if (depotHubsRes) {
      return depotHubsRes?.data?.map((item: DepotHubDto) => ({
        label: item.name,
        value: item._id,
      }));
    }
  }, [depotHubsRes]);

  const handleDepotHubChange = useCallback((value: unknown) => {
    setDepotHub(value as CustomSelectOption);
  }, []);

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

  const handleProductChange = useCallback((value: unknown) => {
    setProduct(value as CustomSelectOption);
  }, []);

  const handleDepotChange = useCallback((value: unknown) => {
    setDepot(value as CustomSelectOption);
  }, []);

  useEffect(() => {
    if (depotHub) {
      setValue('depotHubId', depotHub.value);
    }
  }, [depotHub, setValue]);

  useEffect(() => {
    if (depot) {
      setValue('depot', depot.value);
    }
  }, [depot, setValue]);

  useEffect(() => {
    if (product) {
      setValue('productId', product.value);
    }
  }, [product, setValue]);

  useEffect(() => {
    if (depotHub) {
      setValue('depotHubId', depotHub.value);
    }
  }, [depotHub, setValue]);

  const depots = useMemo(() => {
    if (depotHub) {
      return depotHubsRes?.data
        .find((item: DepotHubDto) => item._id === depotHub?.value)
        .depots?.sort((a: string, b: string) => a.localeCompare(b))
        ?.map((item: string) => ({
          label: item,
          value: item,
        }));
    }
    return [];
  }, [depotHub, depotHubsRes]);

  const states = useMemo(() => {
    if (stateRes) {
      return stateRes?.map((item: string[]) => ({
        label: item,
        value: item,
      }));
    }
  }, [stateRes]);

  const lgas = useMemo(() => {
    if (lgaRes) {
      return lgaRes?.map((item: string[]) => ({
        label: item,
        value: item,
      }));
    }
  }, [lgaRes]);
  const handleCapacityChange = useCallback(
    (value: unknown) => {
      const selectedCapacity = value as CustomSelectOption;
      setCapacity(selectedCapacity);

      if (selectedCapacity?.value === 'others') {
        setShowCustomCapacity(true);
        setCustomCapacity('');
      } else {
        setShowCustomCapacity(false);
        setCustomCapacity('');
        setValue('capacity', selectedCapacity?.value);
      }
    },
    [setValue],
  );
  useEffect(() => {
    if (capacity && capacity.value !== 'others') {
      setValue('capacity', capacity.value);
    }
  }, [capacity, setValue]);

  useEffect(() => {
    if (customCapacity) {
      setValue('capacity', customCapacity);
    }
  }, [customCapacity, setValue]);

  useEffect(() => {
    if (selectedState) {
      setValue('currentState', selectedState.value);
    }
  }, [selectedState, lgas, getValues, setValue]);

  useEffect(() => {
    if (selectedLGA) {
      setValue('currentCity', selectedLGA.value);
    }
  }, [selectedLGA, setValue]);

  useEffect(() => {
    if (getValues('depotHubId')) {
      const _selectedDepotHub = depotHubs?.find(
        (item: CustomSelectOption) => item.value === getValues('depotHubId'),
      );
      if (_selectedDepotHub) setDepotHub(_selectedDepotHub);
    }

    if (getValues('depot')) {
      const _selectedDepot = depots?.find(
        (item: CustomSelectOption) => item.value === getValues('depot'),
      );
      if (_selectedDepot) setDepot(_selectedDepot);
    }

    if (getValues('productId')) {
      const _selectedProduct = products?.find(
        (item: CustomSelectOption) => item.value === getValues('productId'),
      );
      if (_selectedProduct) setProduct(_selectedProduct);
    }
    if (getValues('capacity')) {
      const capacityValue = getValues('capacity').toString();
      const _selectedCapacity = TRUCK_SIZES?.find(
        (item: CustomSelectOption) => item.value === capacityValue,
      );

      if (_selectedCapacity) {
        setCapacity(_selectedCapacity);
        if (_selectedCapacity.value === 'others') {
          setShowCustomCapacity(false); // Will be set by handleCapacityChange if needed
        }
      } else {
        // If the capacity value doesn't match any predefined size, it's a custom value
        setCapacity(TRUCK_SIZES.find((item) => item.value === 'others'));
        setShowCustomCapacity(true);
        setCustomCapacity(capacityValue);
      }
    }

    if (getValues('currentState')) {
      const _selectedState = states?.find(
        (item: CustomSelectOption) =>
          item.value === getValues('currentState')?.toString(),
      );
      if (_selectedState) setSelectedState(_selectedState);
    }

    if (getValues('currentCity')) {
      const _selectedCity = lgas?.find(
        (item: CustomSelectOption) =>
          item.value === getValues('currentCity')?.toString(),
      );
      if (_selectedCity) setSelectedLGA(_selectedCity);
    }
  }, [depotHubs, depots, products, states, lgas, getValues]);

  return (
    <>
      <DialogHeader>
        <DialogTitle
          className={cn(
            'leading-5 text-blue-tone-200 font-semibold text-2xl',
            sora.className,
          )}
        >
          List a truck
        </DialogTitle>
      </DialogHeader>
      <div>
        <DialogDescription className="text-dark-gray-400 text-sm mb-10">
          Enter available truck details
        </DialogDescription>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-light-gray-150 grid grid-cols-2 max-sm:grid-cols-1 gap-3 py-[10px] px-4 rounded-[10px] mb-3">
            <CustomSelect
              name="productId"
              label="Product"
              options={products}
              Option={CustomProductOptionWrapper}
              ValueContainer={CustomValueContainerWrapper}
              value={product}
              onChange={handleProductChange}
              isDisabled={loadingProducts}
              error={errors.productId?.message}
              classNames="col-span-full"
            />
            <CustomInput
              type="type"
              name="truckNumber"
              label="Truck number"
              register={register}
              error={errors.truckNumber?.message}
            />{' '}
            <CustomSelect
              name="size"
              label="Capacity"
              options={TRUCK_SIZES}
              value={capacity}
              onChange={handleCapacityChange}
              error={errors.capacity?.message}
              ValueContainer={LitreValueContainerWrapper}
            />
            {showCustomCapacity && (
              <CustomInput
                type="number"
                name="customCapacity"
                label="Enter Custom Capacity"
                placeholder="Enter capacity in litres"
                value={customCapacity}
                onChange={(e) => setCustomCapacity(e.target.value)}
                prefix="Ltr"
                prefixPadding="pl-12"
                min="1"
                error={errors.capacity?.message}
                classNames="col-span-full"
              />
            )}
          </div>

          <div className="bg-light-gray-150 grid grid-cols-2 max-sm:grid-cols-1 gap-3 py-[10px] px-4 rounded-[10px] mb-3">
            <CustomSelect
              name="depotHubId"
              label="Hub"
              options={depotHubs}
              value={depotHub}
              onChange={handleDepotHubChange}
              isDisabled={loadingDepotHubs}
              error={errors.depotHubId?.message}
            />
            <CustomSelect
              name="depot"
              label="Depot"
              options={depots}
              value={depot}
              onChange={handleDepotChange}
              error={errors.depot?.message}
            />
          </div>

          <div className="bg-light-gray-150 grid grid-cols-2 max-sm:grid-cols-1 gap-3 py-[10px] px-4 rounded-[10px] mb-8">
            <CustomSelect
              label="Current State"
              name="state"
              options={states}
              value={selectedState}
              isDisabled={loadingState}
              onChange={handleStateChange}
              error={errors.currentState?.message}
            />
            <CustomSelect
              label="Current City"
              name="lga"
              options={lgas}
              isDisabled={loadingLGA}
              value={selectedLGA}
              onChange={handleLGAChange}
              error={errors.currentCity?.message}
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
      </div>
    </>
  );
};

export { ListTruckModal, LIST_TRUCK };
