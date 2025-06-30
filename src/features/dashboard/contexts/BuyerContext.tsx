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
  handleDepotChange?: (newValue: unknown) => void;
  handleStateChange?: (newValue: unknown) => void;
  handleProductsChange?: (newValue: unknown) => void;
  handleSizeChange?: (newValue: unknown) => void;
  handleLGAChange?: (newValue: unknown) => void;
  handleVolumeChange?: (event: ChangeEvent<HTMLInputElement>) => void;
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
  const [selectedProduct, setSelectedProduct] = useState<
    CustomSelectOption | undefined
  >(undefined);

  const handleDepotChange = useCallback((value: unknown) => {
    setDepot(value as CustomSelectOption);
  }, []);

  const handleStateChange = useCallback((value: unknown) => {
    setSelectedState(value as CustomSelectOption);
  }, []);

  const handleProductsChange = useCallback((value: unknown) => {
    setSelectedProduct(value as CustomSelectOption);
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

  return (
    <Provider
      value={{
        selectedState,
        selectedLGA,
        volume,
        depot,
        selectedSize,
        selectedProduct,
        handleDepotChange,
        handleStateChange,
        handleProductsChange,
        handleSizeChange,
        handleLGAChange,
        handleVolumeChange,
      }}
    >
      {children}
    </Provider>
  );
};

export { BuyerContext, BuyerProvider };
