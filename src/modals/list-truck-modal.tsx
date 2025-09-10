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
import useStateHook from '@/hooks/useState.hook';
import { useForm } from 'react-hook-form';
import { TruckDto } from '@/features/transporter-dashboard/types/truck.type';
import { yupResolver } from '@hookform/resolvers/yup';
import { truckFormSchema } from '@/features/transporter-dashboard/validations/truck.validation';
import { renderErrors } from '@/utils/renderErrors';
import { DepotHubDto } from '@/types/depot-hub.types';
import { TRUCK_SIZES } from '@/data/truck-sizes';
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
  { label: 'Step Deck', value: 'stepdeck' },
  { label: 'Drop Deck', value: 'dropdeck' },
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

// Flatbed specific options
const FLATBED_SUBTYPES = [
  { label: "Standard (48-53')", value: 'standard' },
  { label: 'Step-deck', value: 'step-deck' },
  { label: 'Double-drop', value: 'double-drop' },
  { label: 'Extendable', value: 'extendable' },
  { label: 'Conestoga', value: 'conestoga' },
  { label: 'Side-kit', value: 'side-kit' },
];

const EQUIPMENT_OPTIONS = [
  { label: 'Tarps', value: 'tarps' },
  { label: 'Chains', value: 'chains' },
  { label: 'Straps', value: 'straps' },
  { label: 'Binders', value: 'binders' },
  { label: 'Winches', value: 'winches' },
];

const CARGO_TYPES = [
  { label: 'Lumber', value: 'lumber' },
  { label: 'Steel', value: 'steel' },
  { label: 'Machinery', value: 'machinery' },
  { label: 'Pipes', value: 'pipes' },
  { label: 'Building materials', value: 'building_materials' },
];

// Minimal country list (expand via backend endpoint later)
const COUNTRY_OPTIONS = [
  { label: 'Nigeria', value: 'Nigeria' },
  { label: 'Ghana', value: 'Ghana' },
  { label: 'Kenya', value: 'Kenya' },
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
  const { useFetchStates, useFetchStateLGA } = useStateHook();
  const { data: stateRes, isLoading: loadingState } = useFetchStates;

  // Truck type state
  const [truckType, setTruckType] = useState<CustomSelectOption | undefined>(
    undefined,
  );
  const [truckFuelType, setTruckFuelType] = useState<
    CustomSelectOption | undefined
  >(undefined);
  // Truck age state
  const [truckCategory, setTruckCategory] = useState<
    CustomSelectOption | undefined
  >();

  // Flatbed specific state
  const [flatbedSubtype, setFlatbedSubtype] = useState<
    CustomSelectOption | undefined
  >(undefined);
  const [deckLengthFt, setDeckLengthFt] = useState<string>('');
  const [deckWidthFt, setDeckWidthFt] = useState<string>('8.5');
  const [maxPayloadKg, setMaxPayloadKg] = useState<string>('');
  const [equipment, setEquipment] = useState<CustomSelectOption[] | undefined>(
    undefined,
  );
  const [preferredCargoTypes, setPreferredCargoTypes] = useState<
    CustomSelectOption[] | undefined
  >(undefined);
  const [permitRequired, setPermitRequired] = useState<
    CustomSelectOption | undefined
  >(undefined);
  const [notes, setNotes] = useState<string>('');
  const [country, setCountry] = useState<CustomSelectOption | undefined>(
    COUNTRY_OPTIONS[0],
  );
  const [city, setCity] = useState<CustomSelectOption | undefined>(undefined);
  const [address, setAddress] = useState<string>('');
  const [selectedState, setSelectedState] = useState<
    CustomSelectOption | undefined
  >(undefined);
  const [selectedLGA, setSelectedLGA] = useState<
    CustomSelectOption | undefined
  >(undefined);

  const { data: lgaRes, isLoading: loadingLGA } = useFetchStateLGA(
    selectedState?.value,
  );

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
  const [customCapacity, setCustomCapacity] = useState<string>('');
  const [showCustomCapacity, setShowCustomCapacity] = useState<boolean>(false);
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
      currentState?: string;
      currentCity?: string;
      // flatbed fields
      flatbedSubtype?: string;
      deckLengthFt?: string;
      deckWidthFt?: string;
      maxPayloadKg?: string;
      equipment?: string[];
      preferredCargoTypes?: string[];
      permitRequired?: string;
      baseRateType?: string;
      baseRate?: string;
      notes?: string;
      country?: string;
      city?: string;
      address?: string;
    }
  >({
    resolver: yupResolver(truckFormSchema) as any,
    defaultValues: {
      ...(openModal?.data?.truck ? { ...openModal?.data?.truck } : {}),
      depotHubId: openModal?.data?.truck?.depotHubId?._id || '',
      productId: openModal?.data?.truck?.productId?._id || '',
      profileId: openModal?.data?.truck?._id || '',
      currentState: openModal?.data?.truck?.currentState || '',
      currentCity: openModal?.data?.truck?.currentCity || '',
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

        // (tanker-specific validation completed here)
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
        // For flatbed trucks, exclude tanker-specific fields
        const {
          productId,
          // truckNumber,
          capacity,
          loadStatus,
          depotHubId,
          depot,
          ...flatbedData
        } = rest;

        truckData = {
          ...flatbedData,
          truckType,
          // explicit flatbed fields (if present in form data)
          flatbedSubtype: rest.flatbedSubtype || undefined,
          deckLengthFt: rest.deckLengthFt || undefined,
          deckWidthFt: rest.deckWidthFt || undefined,
          maxPayloadKg: rest.maxPayloadKg || undefined,
          equipment: rest.equipment || undefined,
          preferredCargoTypes: rest.preferredCargoTypes || undefined,
          // permitRequired: rest.permitRequired || undefined,
          notes: rest.notes || undefined,
          country: rest.country || undefined,
          city: rest.city || undefined,
          address: rest.address || undefined,
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
        // console.log(truckData)
      }
    } catch (error: any) {
      renderErrors(error?.errors, setError);
    }
  };

  const handleTruckFuelTypeChange = useCallback((value: unknown) => {
    setTruckFuelType(value as CustomSelectOption);
  }, []);

  const handleTruckCategoryChange = useCallback((value: unknown) => {
    setTruckCategory(value as CustomSelectOption);
  }, []);

  const handleTruckTypeChange = useCallback((value: unknown) => {
    console.log('Truck type changed:', value);
    setTruckType(value as CustomSelectOption);
    // Reset relevant fields when truck type changes
    if ((value as CustomSelectOption)?.value !== 'tanker') {
      // Reset tanker-specific fields
      setDepotHub(undefined);
      setDepot(undefined);
      setProduct(undefined);
      setCapacity(undefined);
      setDeliveryType(undefined);
      setLoadStatus(LOAD_STATUS_OPTIONS[1]); // Reset to default
      setShowCustomCapacity(false);
      setCustomCapacity('');
      // initialize flatbed defaults
      setFlatbedSubtype(undefined);
      setDeckLengthFt('');
      setDeckWidthFt('8.5');
      setMaxPayloadKg('');
      setEquipment(undefined);
      setPreferredCargoTypes(undefined);
      setPermitRequired(undefined);
      setNotes('');
      setCountry(COUNTRY_OPTIONS[0]);
      setCity(undefined);
      setAddress('');
    } else {
      // Reset flatbed-specific fields
      setSelectedState(undefined);
      setSelectedLGA(undefined);
    }
  }, []);

  // Flatbed handlers
  const handleFlatbedSubtypeChange = useCallback((value: unknown) => {
    setFlatbedSubtype(value as CustomSelectOption);
  }, []);

  const handleEquipmentChange = useCallback((value: unknown) => {
    setEquipment(value as CustomSelectOption[]);
  }, []);

  const handlePreferredCargoChange = useCallback((value: unknown) => {
    setPreferredCargoTypes(value as CustomSelectOption[]);
  }, []);

  const handleCountryChange = useCallback((value: unknown) => {
    setCountry(value as CustomSelectOption);
    setCity(undefined);
  }, []);

  const handleCityChange = useCallback((value: unknown) => {
    setCity(value as CustomSelectOption);
  }, []);

  const handleStateChange = useCallback((value: unknown) => {
    setSelectedState(value as CustomSelectOption);
    setSelectedLGA(undefined); // Reset LGA when state changes
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
        .depots?.sort((a: string, b: string) => a.localeCompare(b))
        ?.map((item: string) => ({
          label: item,
          value: item,
        }));
    }
    return [];
  }, [depotHub, depotHubsRes]);

  // const states = useMemo(() => {
  //   if (stateRes) {
  //     return stateRes?.map((item: string) => ({
  //       label: item,
  //       value: item,
  //     }));
  //   }
  //   return [];
  // }, [stateRes]);

  // lagos only
  const states = useMemo(() => {
    // Only return Lagos as the state option
    return [
      {
        label: 'Lagos',
        value: 'Lagos',
      },
    ];
  }, []);

  const lgas = useMemo(() => {
    if (lgaRes) {
      return lgaRes?.map((item: string) => ({
        label: item,
        value: item,
      }));
    }
    return [];
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
    if (truckType)
      setValue(
        'truckType',
        truckType.value as 'tanker' | 'flatbed' | 'stepdeck' | 'dropdeck',
      );

    if (truckFuelType)
      setValue('truckFuelType', truckFuelType.value as 'diesel' | 'cng');
    if (truckCategory)
      setValue('truckCategory', truckCategory.value as 'A++' | 'A' | 'B' | 'C');
  }, [truckType, truckFuelType, truckCategory, setValue]);

  // bind flatbed fields to form values
  useEffect(() => {
    if (flatbedSubtype) setValue('flatbedSubtype', flatbedSubtype.value);
    if (deckLengthFt !== undefined) setValue('deckLengthFt', deckLengthFt);
    if (deckWidthFt !== undefined) setValue('deckWidthFt', deckWidthFt);
    if (maxPayloadKg !== undefined) setValue('maxPayloadKg', maxPayloadKg);
    if (equipment)
      setValue(
        'equipment',
        equipment.map((e) => e.value),
      );
    if (preferredCargoTypes)
      setValue(
        'preferredCargoTypes',
        preferredCargoTypes.map((c) => c.value),
      );
    if (permitRequired) setValue('permitRequired', permitRequired.value);
    if (notes !== undefined) setValue('notes', notes);
    if (country) setValue('country', country.value);
    if (city) setValue('city', city?.value || '');
    if (address !== undefined) setValue('address', address);
  }, [
    flatbedSubtype,
    deckLengthFt,
    deckWidthFt,
    maxPayloadKg,
    equipment,
    preferredCargoTypes,
    permitRequired,
    notes,
    country,
    city,
    address,
    setValue,
  ]);

  useEffect(() => {
    if (selectedState) {
      setValue('currentState', selectedState.value);
    }
  }, [selectedState, setValue]);

  useEffect(() => {
    if (selectedLGA) {
      setValue('currentCity', selectedLGA.value);
    }
  }, [selectedLGA, setValue]);

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
    if (deliveryType) {
      setValue('deliveryType', deliveryType.value);
    }
  }, [deliveryType, setValue]);

  useEffect(() => {
    if (loadStatus) {
      setValue('loadStatus', loadStatus.value as 'loaded' | 'unloaded');
    }
  }, [loadStatus, setValue]);

  // useEffect(() => {
  //   if (selectedState) {
  //     setValue('currentState', selectedState.value);
  //   }
  // }, [selectedState, lgas, getValues, setValue]);

  // useEffect(() => {
  //   if (selectedLGA) {
  //     setValue('currentCity', selectedLGA.value);
  //   }
  // }, [selectedLGA, setValue]);

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

    // Initialize truck type
    if (getValues('truckType')) {
      const _selectedTruckType = TRUCK_TYPES.find(
        (item: CustomSelectOption) => item.value === getValues('truckType'),
      );
      if (_selectedTruckType) setTruckType(_selectedTruckType);
    }

    // Initialize state and LGA for flatbed trucks
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
  }, [
    depotHubs,
    depots,
    products,
    states,
    lgas,
    getValues,
    setValue,
    truckType,
  ]);

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

      if (editingTruck.truckNumber) {
        const tn = editingTruck.truckNumber.toString();
        if (tn.startsWith('B/L-') || tn.startsWith('B-L-')) {
          inferredDeliveryType =
            editingTruck.truckType !== 'tanker' ? 'up_country' : 'bridging';
        } else if (tn.startsWith('L-')) {
          inferredDeliveryType =
            editingTruck.truckType !== 'tanker' ? 'in_country' : 'local';
        }
      }

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

      // state / city
      if (editingTruck.currentState) {
        const sOpt = {
          label: editingTruck.currentState,
          value: editingTruck.currentState,
        } as CustomSelectOption;
        setSelectedState(sOpt);
        setValue('currentState', editingTruck.currentState);
      }

      if (editingTruck.currentCity) {
        const cOpt = {
          label: editingTruck.currentCity,
          value: editingTruck.currentCity,
        } as CustomSelectOption;
        setSelectedLGA(cOpt);
        setValue('currentCity', editingTruck.currentCity);
      }

      // country / address / notes
      if (editingTruck.country) {
        const countryOpt = COUNTRY_OPTIONS.find(
          (c) => c.value === editingTruck.country,
        ) || { label: editingTruck.country, value: editingTruck.country };
        setCountry(countryOpt as CustomSelectOption);
        setValue('country', editingTruck.country);
      }
      if (editingTruck.address) {
        setAddress(editingTruck.address);
        setValue('address', editingTruck.address);
      }
      if (editingTruck.notes) {
        setNotes(editingTruck.notes);
        setValue('notes', editingTruck.notes);
      }

      // flatbed-specific
      if (editingTruck.flatbedSubtype) {
        const fOpt = FLATBED_SUBTYPES.find(
          (f) => f.value === editingTruck.flatbedSubtype,
        );
        if (fOpt) {
          setFlatbedSubtype(fOpt as CustomSelectOption);
          setValue('flatbedSubtype', editingTruck.flatbedSubtype);
        }
      }
      if (editingTruck.deckLengthFt !== undefined) {
        setDeckLengthFt(editingTruck.deckLengthFt?.toString() || '');
        setValue('deckLengthFt', editingTruck.deckLengthFt?.toString() || '');
      }
      if (editingTruck.deckWidthFt !== undefined) {
        setDeckWidthFt(editingTruck.deckWidthFt?.toString() || '');
        setValue('deckWidthFt', editingTruck.deckWidthFt?.toString() || '');
      }
      if (editingTruck.maxPayloadKg !== undefined) {
        setMaxPayloadKg(editingTruck.maxPayloadKg?.toString() || '');
        setValue('maxPayloadKg', editingTruck.maxPayloadKg?.toString() || '');
      }
      if (editingTruck.equipment) {
        const eq = editingTruck.equipment.map((e: string) => ({
          label: e,
          value: e,
        }));
        setEquipment(eq as CustomSelectOption[]);
        setValue('equipment', editingTruck.equipment);
      }
      if (editingTruck.preferredCargoTypes) {
        const pc = editingTruck.preferredCargoTypes.map((c: string) => ({
          label: c,
          value: c,
        }));
        setPreferredCargoTypes(pc as CustomSelectOption[]);
        setValue('preferredCargoTypes', editingTruck.preferredCargoTypes);
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
              {/* Temporary native select for debugging */}
              {/* <label htmlFor="truckType-native" className="block text-sm font-medium text-gray-700 mb-1">
                Truck Type (Native Test)
              </label>
              <select
                id="truckType-native"
                value={truckType?.value || ''}
                onChange={(e) => {
                  console.log('Native select changed:', e.target.value);
                  const selectedType = TRUCK_TYPES.find(type => type.value === e.target.value);
                  if (selectedType) {
                    handleTruckTypeChange(selectedType);
                  }
                }}
                className="w-full p-2 border rounded bg-white"
              >
                <option value="">Select truck type</option>
                {TRUCK_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select> */}

              {/* Original CustomSelect - commented for debugging */}
              <CustomSelect
                name="truckType"
                label="Truck Type"
                options={TRUCK_TYPES}
                value={truckType}
                onChange={handleTruckTypeChange}
                error={errors.truckType?.message}
                classNames="relative z-50"
                placeholder="truck type"
              />
            </div>

            {/* Only show these fields for tanker trucks */}
            {truckType?.value === 'tanker' && (
              <>
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
                    // ts-ignore-next-line eslint-disable-next-line
                    error={errors.productId?.message as any}
                    classNames="relative z-40"
                  />
                </div>
              </>
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
                placeholder="delivery type"
              />
            </div>

            <div className="relative z-30">
              <CustomSelect
                name="truckFuelType"
                label="Truck Fuel Type"
                options={TRUCK_FUEL_TYPES}
                value={truckFuelType}
                onChange={handleTruckFuelTypeChange}
                error={errors.truckFuelType?.message}
                classNames="relative z-30 mt-2"
                placeholder="fuel type"
              />
            </div>
            <div className="relative z-30">
              {/* <CustomInput
                type="number"
                name="truckCategory"
                label="Truck Category"
                value={truckCategory}
                onChange={handleTruckCategoryChange}
                error={errors.truckCategory?.message}
                min="0"
                placeholder="Enter truck category"
                classNames="mt-2"
              /> */}
              <CustomSelect
                label="Truck Category"
                name="truckCategory"
                options={TRUCK_CATEGORY_OPTIONS.map((opt) => ({
                  label: `${opt.label} — ${opt.description} (${opt.ageRange})`,
                  value: opt.value,
                }))}
                value={truckCategory}
                onChange={(value) =>
                  setTruckCategory(value as CustomSelectOption)
                }
                placeholder="Truck category"
                classNames="border-gray-300 mt-2 relative z-30"
              />
              <div className="text-xs text-gray-500 mt-1">
                Note: Older trucks tend to consume more fuel.
              </div>
            </div>
            {truckType?.value === 'tanker' && (
              <>
                <div className="relative z-25">
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
                <div className="relative z-25">
                  <CustomSelect
                    name="size"
                    label="Capacity"
                    options={TRUCK_SIZES}
                    value={capacity}
                    onChange={handleCapacityChange}
                    error={errors.capacity?.message}
                    ValueContainer={LitreValueContainerWrapper}
                    classNames="relative z-25"
                  />
                </div>
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
              </>
            )}
          </div>

          {/* Conditional location section based on truck type */}
          {truckType && (
            <div className="bg-light-gray-150 grid grid-cols-2 max-sm:grid-cols-1 gap-3 py-[10px] px-4 rounded-[10px] mb-3 relative">
              {truckType.value === 'tanker' ? (
                <>
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
                </>
              ) : (
                <>
                  {truckType?.value !== 'tanker' ? (
                    <>
                      <div className="relative z-25">
                        <CustomSelect
                          label="Flatbed Subtype"
                          name="flatbedSubtype"
                          options={FLATBED_SUBTYPES}
                          value={flatbedSubtype}
                          onChange={handleFlatbedSubtypeChange}
                          error={errors.flatbedSubtype?.message}
                          classNames="relative z-25"
                        />
                      </div>

                      <div className="relative z-20">
                        <CustomInput
                          type="number"
                          name="deckLengthFt"
                          label="Deck length (ft)"
                          value={deckLengthFt}
                          onChange={(e) => setDeckLengthFt(e.target.value)}
                          error={errors.deckLengthFt?.message}
                        />
                      </div>

                      <div className="relative z-20">
                        <CustomInput
                          type="number"
                          name="deckWidthFt"
                          label="Deck width (ft)"
                          value={deckWidthFt}
                          onChange={(e) => setDeckWidthFt(e.target.value)}
                          error={errors.deckWidthFt?.message}
                        />
                      </div>

                      <div className="relative z-20">
                        <CustomInput
                          type="number"
                          name="maxPayloadKg"
                          label="Max payload (kg)"
                          value={maxPayloadKg}
                          onChange={(e) => setMaxPayloadKg(e.target.value)}
                          error={errors.maxPayloadKg?.message}
                        />
                      </div>

                      <div className="relative z-30">
                        <CustomSelect
                          label="Equipment"
                          name="equipment"
                          options={EQUIPMENT_OPTIONS}
                          multiple
                          value={equipment}
                          onChange={handleEquipmentChange}
                          error={errors.equipment?.message}
                          classNames="relative z-30"
                        />
                      </div>

                      <div className="relative z-25">
                        <CustomSelect
                          label="Preferred Cargo Types"
                          name="preferredCargoTypes"
                          options={CARGO_TYPES}
                          multiple
                          value={preferredCargoTypes}
                          onChange={handlePreferredCargoChange}
                          error={errors.preferredCargoTypes?.message}
                          classNames="relative z-25"
                        />
                      </div>

                      {/* delivery type uses the shared select above (shows in-country/up-country for flatbed) */}

                      {deliveryType?.value === 'in_country' && (
                        <>
                          <div className="relative z-25">
                            <CustomSelect
                              label="State"
                              name="state"
                              options={
                                stateRes?.map((s: string) => ({
                                  label: s,
                                  value: s,
                                })) || []
                              }
                              value={selectedState}
                              onChange={handleStateChange}
                              error={errors.currentState?.message}
                              classNames="relative z-25"
                            />
                          </div>
                          <div className="relative z-25">
                            <CustomSelect
                              label="City (LGA)"
                              name="city"
                              options={
                                lgaRes?.map((l: string) => ({
                                  label: l,
                                  value: l,
                                })) || []
                              }
                              value={selectedLGA}
                              onChange={handleLGAChange}
                              error={errors.currentCity?.message}
                              classNames="relative z-25"
                            />
                          </div>
                          <div className="col-span-full relative z-20">
                            <CustomInput
                              type="text"
                              name="address"
                              label="Address / Location"
                              placeholder="Optional: include full address or landmark"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              error={errors.address?.message}
                            />
                          </div>
                          <div className="col-span-full relative z-20">
                            <CustomInput
                              type="text"
                              name="notes"
                              label="Notes"
                              placeholder="Optional: extra details or restrictions"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              error={errors.notes?.message}
                            />
                          </div>
                        </>
                      )}

                      {deliveryType?.value === 'up_country' && (
                        <>
                          <div className="relative z-25">
                            <CustomSelect
                              label="Country"
                              name="country"
                              options={COUNTRY_OPTIONS}
                              value={country}
                              onChange={handleCountryChange}
                              error={errors.country?.message}
                              classNames="relative z-25"
                            />
                          </div>
                          <div className="col-span-full relative z-20">
                            <CustomInput
                              type="text"
                              name="address"
                              label="Address / Location"
                              placeholder="Enter full address or landmark"
                              value={address}
                              onChange={(e) => setAddress(e.target.value)}
                              error={errors.address?.message}
                            />
                          </div>
                          <div className="col-span-full relative z-20">
                            <CustomInput
                              type="text"
                              name="notes"
                              label="Notes"
                              placeholder="Optional: extra details or restrictions"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              error={errors.notes?.message}
                            />
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="relative z-30">
                        <CustomSelect
                          label="Current State"
                          name="state"
                          options={states}
                          value={selectedState}
                          isDisabled={loadingState}
                          onChange={handleStateChange}
                          error={errors.currentState?.message}
                          classNames="relative z-30"
                        />
                      </div>
                      <div className="relative z-20">
                        <CustomSelect
                          label="Current City"
                          name="lga"
                          options={lgas}
                          isDisabled={loadingLGA}
                          value={selectedLGA}
                          onChange={handleLGAChange}
                          error={errors.currentCity?.message}
                          classNames="relative z-20"
                        />
                      </div>
                    </>
                  )}
                </>
              )}
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
