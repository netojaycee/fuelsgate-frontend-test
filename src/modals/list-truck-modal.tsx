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
// import useStateHook from '@/hooks/useState.hook';
import { useForm } from 'react-hook-form';
import { TruckDto } from '@/features/transporter-dashboard/types/truck.type';
import { yupResolver } from '@hookform/resolvers/yup';
import { truckFormSchema } from '@/features/transporter-dashboard/validations/truck.validation';
import { renderErrors } from '@/utils/renderErrors';
import { DepotHubDto } from '@/types/depot-hub.types';
import { NON_TANKER_SIZES, TRUCK_SIZES } from '@/data/truck-sizes';
import useProductHook from '@/hooks/useProduct.hook';
import { ProductDto } from '@/types/product.types';
import {
  CustomProductOptionWrapper,
  CustomValueContainerWrapper,
} from '@/features/dashboard/components/product-select-components';
import { TRUCK_CATEGORY_OPTIONS } from '@/features/dashboard/components/BuyerCalculator';

const sora = Sora({ subsets: ['latin'] });
const LIST_TRUCK = 'list_truck';

// Truck type options
const TRUCK_TYPES = [
  { label: 'Tanker', value: 'tanker' },
  { label: 'Flatbed', value: 'flatbed' },
  { label: 'SideWall', value: 'sidewall' },
  { label: 'Lowbed', value: 'lowbed' },
];

const TRUCK_FUEL_TYPES = [
  { label: 'CNG Powered', value: 'cng' },
  { label: 'Diesel Powered', value: 'diesel' },
];
// Delivery type options
const DELIVERY_TYPES = [
  { label: 'Bridging', value: 'bridging' },
  { label: 'Local', value: 'local' },
];

// Flatbed delivery options
const FLATBED_DELIVERY_TYPES = [
  { label: 'In Country', value: 'in_country' },
  { label: 'Up Country', value: 'up_country' },
];

// Load status options
export const LOAD_STATUS_OPTIONS = [
  { label: 'Loaded', value: 'loaded' },
  { label: 'Unloaded', value: 'unloaded' },
];



const ListTruckModal = () => {
  const { handleClose, openModal } = useContext(ModalContext);
  const { useFetchDepotHubs } = useDepotHubHook();
  const { data: depotHubsRes, isLoading: loadingDepotHubs } = useFetchDepotHubs;

  // Truck type state
  const [truckType, setTruckType] = useState<CustomSelectOption | undefined>(
    undefined,
  );
  // Merged truck fuel type and category
  const [truckFuelType, setTruckFuelType] = useState<
    CustomSelectOption | undefined
  >(undefined);
  const [truckCategory, setTruckCategory] = useState<
    CustomSelectOption | undefined
  >(undefined);

  const [depotHub, setDepotHub] = useState<CustomSelectOption | undefined>(
    undefined,
  );
  const [loadStatus, setLoadStatus] = useState<CustomSelectOption>(
    LOAD_STATUS_OPTIONS[1],
  ); // Default to Unloaded
  const { useFetchProducts } = useProductHook();
  const { data: productsRes, isLoading: loadingProducts } = useFetchProducts;
  const [product, setProduct] = useState<CustomSelectOption | undefined>(
    undefined,
  );
  const [depot, setDepot] = useState<CustomSelectOption | undefined>(undefined);
  const [capacity, setCapacity] = useState<CustomSelectOption | undefined>(
    undefined,
  );
  const [deliveryType, setDeliveryType] = useState<
    CustomSelectOption | undefined
  >(undefined);
  const { useSaveTruck, useUpdateTruck } = useTruckHook();
  const { mutateAsync: saveTruck, isPending: isSavingData } = useSaveTruck();
  const { mutateAsync: updateTruck, isPending: isSavingUpdatedData } =
    useUpdateTruck(openModal?.data?.truck?._id);

  console.log(openModal?.data?.truck);
  const {
    setError,
    register,
    getValues,
    setValue,
    formState: { errors },
    handleSubmit,
  } = useForm<
    Omit<TruckDto, '_id' | 'profileId' | 'status'> & {
      depotHubId?: string;
      productId?: string;
      deliveryType?: string;
      truckType: string;
      truckFuelType?: string;
      truckCategory?: string;
    }
  >({
    resolver: yupResolver(truckFormSchema) as any,
    defaultValues: {
      ...(openModal?.data?.truck ? { ...openModal?.data?.truck } : {}),
      depotHubId: openModal?.data?.truck?.depotHubId?._id || '',
      productId: openModal?.data?.truck?.productId?._id || '',
      profileId: openModal?.data?.truck?._id || '',
      deliveryType: '',

      truckType: openModal?.data?.truck?.truckType || '',
      truckFuelType: openModal?.data?.truck?.truckFuelType || '',
      truckCategory: openModal?.data?.truck?.truckCategory || '',
      loadStatus: 'unloaded',
    },
  });
  const onSubmit = async (
    data: Omit<TruckDto, '_id' | 'profileId' | 'status'> & {
      deliveryType?: string;
      truckType: string;
      truckFuelType?: string;
      truckCategory?: string;
    },
  ) => {
    try {
      // Validate truck type
      if (!data.truckType) {
        setError('truckType', {
          type: 'manual',
          message: 'Truck type is required',
        });
        return;
      }

      // Only validate tanker-specific fields for tanker trucks
      if (data.truckType === 'tanker') {
        // Validate delivery type for tanker
        if (!data.deliveryType) {
          setError('deliveryType', {
            type: 'manual',
            message: 'Delivery type is required',
          });
          return;
        }
      }

      // Normalize truck number prefix for all truck types so deliveryType is encoded
      if (data.deliveryType && data.truckNumber) {
        const rawTruckNumber = data.truckNumber
          .toString()
          .replace(/^B\/L-/, '') // Remove existing B/L- prefix
          .replace(/^B-L-/, '')
          .replace(/^L-/, ''); // Remove existing L- prefix

        // bridging and up_country should have B/L- prefix
        if (
          data.deliveryType === 'bridging' ||
          data.deliveryType === 'up_country'
        ) {
          data.truckNumber = `B/L-${rawTruckNumber}`;
        } else {
          // local and in_country use L-
          data.truckNumber = `L-${rawTruckNumber}`;
        }
      }

      // Remove deliveryType and truckType from data before sending to API
      const { deliveryType, truckType, profileType, ...rest } = data;

      // Build truck data based on truck type
      let truckData;
      if (truckType !== 'tanker') {
        // For non-tanker trucks, only exclude productId and loadStatus
        const { productId, loadStatus, ...flatbedData } = rest;

        truckData = {
          ...flatbedData,
          truckType,
          ...(profileType ? { profileType: profileType.toLowerCase() } : {}),
        };
      } else {
        // For tanker trucks, include all fields
        truckData = {
          ...rest,
          truckType,
          ...(profileType ? { profileType: profileType.toLowerCase() } : {}),
        };
      }

      if (openModal?.data.edit) {
        await updateTruck(truckData);
      } else {
        await saveTruck(truckData);
        // console.log(truckData);
      }
    } catch (error: any) {
      renderErrors(error?.errors, setError);
    }
  };

  // const handleTruckFuelTypeChange = useCallback((value: unknown) => {
  //   setTruckFuelType(value as CustomSelectOption);
  // }, []);

  // const handleTruckCategoryChange = useCallback((value: unknown) => {
  //   setTruckCategory(value as CustomSelectOption);
  // }, []);

  const handleTruckTypeChange = useCallback((value: unknown) => {
    console.log('Truck type changed:', value);
    setTruckType(value as CustomSelectOption);
    // Reset relevant fields when truck type changes
    if ((value as CustomSelectOption)?.value !== 'tanker') {
      // Reset tanker-specific fields
      setProduct(undefined);
      setCapacity(undefined);
      setDeliveryType(undefined);
      setLoadStatus(LOAD_STATUS_OPTIONS[1]); // Reset to default
    }
  }, []);

  // Filter hubs by truck type
  const depotHubs = useMemo(() => {
    if (!depotHubsRes) return [];
    if (truckType?.value === 'tanker') {
      return depotHubsRes?.data
        ?.filter((item: DepotHubDto) => item.type === 'tanker')
        .map((item: DepotHubDto) => ({
          label: item.name,
          value: item._id,
        }));
    } else if (truckType) {
      return depotHubsRes?.data
        ?.filter((item: DepotHubDto) => item.type === 'others')
        .map((item: DepotHubDto) => ({
          label: item.name,
          value: item._id,
        }));
    }
    return [];
  }, [depotHubsRes, truckType]);

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

  const handleDeliveryTypeChange = useCallback((value: unknown) => {
    setDeliveryType(value as CustomSelectOption);
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
        ?.depots?.sort((a: string, b: string) => a.localeCompare(b))
        ?.map((item: string) => ({
          label: item,
          value: item,
        }));
    }
    return [];
  }, [depotHub, depotHubsRes]);

  const handleCapacityChange = useCallback((value: unknown) => {
    const selectedCapacity = value as CustomSelectOption;
    setCapacity(selectedCapacity);
  }, []);

  useEffect(() => {
    if (truckType)
      setValue(
        'truckType',
        truckType.value as 'tanker' | 'flatbed' | 'sidewall' | 'lowbed',
      );
    if (truckFuelType)
      setValue('truckFuelType', truckFuelType.value as 'diesel' | 'cng');
    if (truckCategory)
      setValue('truckCategory', truckCategory.value as 'A++' | 'A' | 'B' | 'C');
  }, [truckType, truckFuelType, truckCategory, setValue]);

  useEffect(() => {
    if (capacity && capacity.value !== 'others') {
      setValue('capacity', capacity.value);
    }
  }, [capacity, setValue]);

  useEffect(() => {
    if (deliveryType) {
      setValue('deliveryType', deliveryType.value);
    }
  }, [deliveryType, setValue]);

  useEffect(() => {
    if (loadStatus) {
      setValue('loadStatus', loadStatus.value as 'loaded' | 'unloaded');
    }
  }, [loadStatus, setValue]);

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
      const capacityRaw = getValues('capacity');
      const capacityValue =
        capacityRaw !== undefined && capacityRaw !== null
          ? capacityRaw.toString()
          : '';
      const _selectedCapacity = TRUCK_SIZES?.find(
        (item: CustomSelectOption) => item.value === capacityValue,
      );

      if (_selectedCapacity) {
        setCapacity(_selectedCapacity);
      } else {
        // If the capacity value doesn't match any predefined size, it's a custom value
        setCapacity(TRUCK_SIZES.find((item) => item.value === 'others'));
      }
    }

    // Initialize truck type
    if (getValues('truckType')) {
      const _selectedTruckType = TRUCK_TYPES.find(
        (item: CustomSelectOption) => item.value === getValues('truckType'),
      );
      if (_selectedTruckType) setTruckType(_selectedTruckType);
    }

    // Initialize delivery type based on truck number format
    if (getValues('truckNumber')) {
      const truckNumberRaw = getValues('truckNumber');
      const truckNumber = truckNumberRaw ? truckNumberRaw.toString() : '';
      let _selectedDeliveryType;

      // determine which option set to prefer based on truckType value (if available)
      const currentTruckType = getValues('truckType') || truckType?.value;
      const preferFlatbed = currentTruckType !== 'tanker';

      if (truckNumber.startsWith('B/L-') || truckNumber.startsWith('B-L-')) {
        // prefer flatbed up_country when editing a flatbed, otherwise tanker bridging
        _selectedDeliveryType = preferFlatbed
          ? FLATBED_DELIVERY_TYPES.find((i) => i.value === 'up_country')
          : DELIVERY_TYPES.find((i) => i.value === 'bridging');
      } else if (truckNumber.startsWith('L-')) {
        // prefer flatbed in_country when editing a flatbed, otherwise tanker local
        _selectedDeliveryType = preferFlatbed
          ? FLATBED_DELIVERY_TYPES.find((i) => i.value === 'in_country')
          : DELIVERY_TYPES.find((i) => i.value === 'local');
      }

      if (_selectedDeliveryType) {
        setDeliveryType(_selectedDeliveryType);
        setValue('deliveryType', _selectedDeliveryType.value);
      }
    }
  }, [depotHubs, depots, products, getValues, setValue, truckType]);

  // If we're editing, load truck values into local state (so selects display correctly)
  useEffect(() => {
    const editingTruck = openModal?.data?.truck;
    if (openModal?.data?.edit && editingTruck) {
      // truck type
      const _selectedTruckType = TRUCK_TYPES.find(
        (item: CustomSelectOption) => item.value === editingTruck.truckType,
      );
      if (_selectedTruckType) setTruckType(_selectedTruckType);

      // truck fuel type
      const _selectedTruckFuelType = TRUCK_FUEL_TYPES.find(
        (item: CustomSelectOption) => item.value === editingTruck.truckFuelType,
      );

      if (_selectedTruckFuelType) setTruckFuelType(_selectedTruckFuelType);

      // truck category
      const _selectedTruckCategory = TRUCK_CATEGORY_OPTIONS.find(
        (item: CustomSelectOption) => item.value === editingTruck.truckCategory,
      );
      if (_selectedTruckCategory) setTruckCategory(_selectedTruckCategory);

      // infer or use deliveryType - prefer explicit truckNumber prefix if present
      let inferredDeliveryType: string | undefined = editingTruck.deliveryType;

      // if (editingTruck.truckNumber) {
      //   const tn = editingTruck.truckNumber.toString();
      //   if (tn.startsWith('B/L-') || tn.startsWith('B-L-')) {
      //     inferredDeliveryType =
      //       editingTruck.truckType !== 'tanker' ? 'up_country' : 'bridging';
      //   } else if (tn.startsWith('L-')) {
      //     inferredDeliveryType =
      //       editingTruck.truckType !== 'tanker' ? 'in_country' : 'local';
      //   }
      // }

      if (!inferredDeliveryType) {
        if (editingTruck.currentState || editingTruck.currentCity) {
          inferredDeliveryType = 'in_country';
        } else if (editingTruck.country) {
          inferredDeliveryType = 'up_country';
        }
      }

      if (inferredDeliveryType) {
        const opt = (
          editingTruck.truckType !== 'tanker'
            ? FLATBED_DELIVERY_TYPES
            : DELIVERY_TYPES
        ).find((d) => d.value === inferredDeliveryType);
        if (opt) {
          setDeliveryType(opt);
          setValue('deliveryType', opt.value);
        }
      }

      // ensure truckNumber is prefixed to carry deliveryType info (B/L- or L-)
      if (editingTruck.truckNumber) {
        const raw = editingTruck.truckNumber
          .toString()
          .replace(/^B\/L-/, '')
          .replace(/^L-/, '');
        const prefix =
          inferredDeliveryType === 'bridging' ||
          inferredDeliveryType === 'up_country'
            ? 'B/L-'
            : 'L-';
        setValue('truckNumber', `${prefix}${raw}`);
      }
    }
  }, [openModal, setValue]);

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
      <div className="relative overflow-visible">
        <DialogDescription className="text-dark-gray-400 text-sm mb-10">
          Enter available truck details
        </DialogDescription>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="relative overflow-visible"
          style={{ pointerEvents: 'auto' }}
        >
          <div
            className="bg-light-gray-150 grid grid-cols-2 max-sm:grid-cols-1 gap-3 py-[10px] px-4 rounded-[10px] mb-3 relative"
            style={{ pointerEvents: 'auto' }}
          >
            <div
              className="col-span-full relative z-50"
              style={{ pointerEvents: 'auto' }}
            >
              {/* Original CustomSelect - commented for debugging */}
              <CustomSelect
                name="truckType"
                label="Truck Type"
                options={TRUCK_TYPES}
                value={truckType}
                onChange={handleTruckTypeChange}
                error={errors.truckType?.message}
                classNames="relative z-50"
                placeholder="Truck type"
              />
            </div>

            {/* Product only for tanker */}
            {truckType?.value === 'tanker' && (
              <div className="col-span-full relative z-40">
                <CustomSelect
                  name="productId"
                  label="Product"
                  options={products}
                  Option={CustomProductOptionWrapper}
                  ValueContainer={CustomValueContainerWrapper}
                  value={product}
                  onChange={handleProductChange}
                  isDisabled={loadingProducts}
                  error={errors.productId?.message as any}
                  classNames="relative z-40"
                />
              </div>
            )}

            <div className="relative z-30">
              <CustomInput
                type="type"
                name="truckNumber"
                label="Truck number"
                register={register}
                error={errors.truckNumber?.message}
              />
            </div>

            <div className="relative z-35">
              <CustomSelect
                name="deliveryType"
                label="Delivery Type"
                options={
                  truckType?.value !== 'tanker'
                    ? FLATBED_DELIVERY_TYPES
                    : DELIVERY_TYPES
                }
                value={deliveryType}
                onChange={handleDeliveryTypeChange}
                error={errors.deliveryType?.message}
                classNames="relative z-35"
                placeholder="Delivery type"
              />
            </div>

            <div className="relative z-30">
              <CustomSelect
                name="truckFuelType"
                label="Truck Fuel Type"
                options={TRUCK_FUEL_TYPES}
                value={truckFuelType}
                onChange={(value) => {
                  setTruckFuelType(value as CustomSelectOption);
                  // Reset truck category when fuel type changes
                  setTruckCategory(undefined);
                }}
                error={errors.truckFuelType?.message}
                classNames="relative z-30 mt-2"
                placeholder="Fuel type"
              />
            </div>
            <div className="relative z-30">
              <CustomSelect
                label="Truck Category"
                name="truckCategory"
                options={
                  truckFuelType?.value === 'cng'
                    ? TRUCK_CATEGORY_OPTIONS.filter(
                        (opt) => opt.value === 'A++',
                      ).map((opt) => ({
                        label: `${opt.label} — ${opt.description} (${opt.ageRange})`,
                        value: opt.value,
                      }))
                    : TRUCK_CATEGORY_OPTIONS.filter(
                        (opt) => opt.value !== 'A++',
                      ).map((opt) => ({
                        label: `${opt.label} — ${opt.description} (${opt.ageRange})`,
                        value: opt.value,
                      }))
                }
                value={truckCategory}
                onChange={(value) =>
                  setTruckCategory(value as CustomSelectOption)
                }
                placeholder="Truck category"
                classNames="border-gray-300 mt-2 relative z-30"
                isDisabled={!truckFuelType}
              />
              <div className="text-xs text-gray-500 mt-1">
                Note: Older trucks tend to consume more fuel.
              </div>
            </div>
            {/* Capacity and Load Status layout */}
            {truckType?.value === 'tanker' ? (
              <div className="col-span-full flex gap-3 relative z-25">
                <div className="flex-1">
                  <CustomSelect
                    name="capacity"
                    label="Capacity"
                    options={TRUCK_SIZES}
                    value={capacity}
                    onChange={handleCapacityChange}
                    error={errors.capacity?.message}
                    ValueContainer={LitreValueContainerWrapper}
                    classNames="relative z-25"
                    unit="Ltr"
                    placeholder="Capacity"
                  />
                </div>
                <div className="flex-1">
                  <CustomSelect
                    name="loadStatus"
                    label="Load Status"
                    options={LOAD_STATUS_OPTIONS}
                    value={loadStatus}
                    onChange={(value: unknown) =>
                      setLoadStatus(value as CustomSelectOption)
                    }
                    error={errors.loadStatus?.message}
                    classNames="relative z-25"
                  />
                </div>
              </div>
            ) : (
              <div className="col-span-full relative z-25">
                <CustomSelect
                  name="capacity"
                  label="Capacity"
                  options={NON_TANKER_SIZES}
                  value={capacity}
                  onChange={handleCapacityChange}
                  error={errors.capacity?.message}
                  ValueContainer={LitreValueContainerWrapper}
                  classNames="relative z-25"
                  unit="Tons"
                  placeholder="Capacity"
                />
              </div>
            )}
          </div>

          {/* Hub and Depot for all trucks */}
          {truckType && (
            <div className="bg-light-gray-150 grid grid-cols-2 max-sm:grid-cols-1 gap-3 py-[10px] px-4 rounded-[10px] mb-3 relative">
              <div className="relative z-20">
                <CustomSelect
                  name="depotHubId"
                  label="Hub"
                  options={depotHubs}
                  value={depotHub}
                  onChange={handleDepotHubChange}
                  isDisabled={loadingDepotHubs}
                  error={errors.depotHubId?.message}
                  classNames="relative z-20"
                />
              </div>
              <div className="relative z-20">
                <CustomSelect
                  name="depot"
                  label="Depot"
                  options={depots}
                  value={depot}
                  onChange={handleDepotChange}
                  error={errors.depot?.message}
                  classNames="relative z-20"
                />
              </div>
            </div>
          )}

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
