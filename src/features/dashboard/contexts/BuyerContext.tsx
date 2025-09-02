'use client';
import { CustomSelectOption } from '@/components/atoms/custom-select';
import { ChangeEvent, createContext, useCallback, useState } from 'react';
import Cookies from 'js-cookie';

type BuyerProviderValueType = {
  selectedState?: CustomSelectOption;
  selectedLGA?: CustomSelectOption;
  volume?: string;
  depot?: CustomSelectOption;
  selectedSize?: CustomSelectOption;
  selectedProduct?: CustomSelectOption;
  selectedLoadStatus?: CustomSelectOption;
  truckType?: CustomSelectOption;
  flatbedLocation?: CustomSelectOption;
  handleLoadStatusChange?: (newValue: unknown) => void;
  handleDepotChange?: (newValue: unknown) => void;
  handleStateChange?: (newValue: unknown) => void;
  handleProductsChange?: (newValue: unknown) => void;
  handleSizeChange?: (newValue: unknown) => void;
  handleLGAChange?: (newValue: unknown) => void;
  handleVolumeChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  handleTruckTypeChange?: (newValue: unknown) => void;
  handleFlatbedLocationChange?: (newValue: unknown) => void;
};

const BuyerContext = createContext<BuyerProviderValueType>({});
const { Provider } = BuyerContext;

type BuyerProviderProps = {
  children: React.ReactNode;
};

const BuyerProvider = ({ children }: BuyerProviderProps) => {
  const [selectedState, setSelectedState] = useState<
    CustomSelectOption | undefined
  >(undefined);
  const [selectedLGA, setSelectedLGA] = useState<
    CustomSelectOption | undefined
  >(undefined);
  const [volume, setVolume] = useState<string>('');
  const [depot, setDepot] = useState<CustomSelectOption | undefined>(undefined);
  const [selectedSize, setSelectedSize] = useState<
    CustomSelectOption | undefined
  >(undefined);
  const [selectedLoadStatus, setSelectedLoadStatus] = useState<CustomSelectOption | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<
    CustomSelectOption | undefined
  >(undefined);
  const [truckType, setTruckType] = useState<CustomSelectOption | undefined>(
    { label: 'Tanker', value: 'tanker' } // Default to tanker
  );
  const [flatbedLocation, setFlatbedLocation] = useState<CustomSelectOption | undefined>(undefined);

  const handleDepotChange = useCallback((value: unknown) => {
    setDepot(value as CustomSelectOption);
  }, []);

  const handleStateChange = useCallback((value: unknown) => {
    setSelectedState(value as CustomSelectOption);
  }, []);

  const handleProductsChange = useCallback((value: unknown) => {
    setSelectedProduct(value as CustomSelectOption);
  }, []);

  const handleLoadStatusChange = useCallback((value: unknown) => {
    setSelectedLoadStatus(value as CustomSelectOption);
  }, []);

  const handleSizeChange = useCallback((value: unknown) => {
    setSelectedSize(value as CustomSelectOption);
  }, []);

  const handleLGAChange = useCallback((value: unknown) => {
    setSelectedLGA(value as CustomSelectOption);
  }, []);

  const handleVolumeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setVolume(event?.target.value);
      Cookies.set('volume', event?.target.value, { expires: 0.5 });
    },
    [],
  );

  const handleTruckTypeChange = useCallback((value: unknown) => {
    setTruckType(value as CustomSelectOption);
    // Reset relevant fields when truck type changes
    if ((value as CustomSelectOption)?.value === 'flatbed') {
      setDepot(undefined);
      setSelectedProduct(undefined);
      setSelectedSize(undefined);
      setSelectedLoadStatus(undefined);
    } else {
      setFlatbedLocation(undefined);
    }
  }, []);

  const handleFlatbedLocationChange = useCallback((value: unknown) => {
    setFlatbedLocation(value as CustomSelectOption);
  }, []);

  return (
    <Provider
      value={{
        selectedState,
        selectedLGA,
        volume,
        depot,
        selectedSize,
        selectedProduct,
        selectedLoadStatus,
        truckType,
        flatbedLocation,
        handleDepotChange,
        handleStateChange,
        handleProductsChange,
        handleLoadStatusChange,
        handleSizeChange,
        handleLGAChange,
        handleVolumeChange,
        handleTruckTypeChange,
        handleFlatbedLocationChange,
      }}
    >
      {children}
    </Provider>
  );
};

export { BuyerContext, BuyerProvider };
