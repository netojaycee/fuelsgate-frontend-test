import useTruckHook from '@/features/transporter-dashboard/hooks/useTruck.hook';
import useDepotHubHook from '@/hooks/useDepotHub.hook';
import useProductHook from '@/hooks/useProduct.hook';
import useProductUploadHook from '@/hooks/useProductUpload.hook';
import useStateHook from '@/hooks/useState.hook';
import { DepotHubDto } from '@/types/depot-hub.types';
import { ProductDto } from '@/types/product.types';
import io from 'socket.io-client';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import { AuthContext } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { BuyerContext } from '../contexts/BuyerContext';
import useBuyerHook from '@/hooks/useBuyer.hook';
import useToastConfig from '@/hooks/useToastConfig.hook';

type TabTypes = 'seller' | 'transporter' | 'calculator';

const useBuyerDashboardHook = () => {
  const { user } = useContext(AuthContext);
  const { showToast } = useToastConfig();
  const {
    selectedState,
    selectedLGA,
    volume,
    depot,
    selectedSize,
    selectedProduct,
    selectedLoadStatus,
    truckType,
    flatbedLocation,
    handleLoadStatusChange,
    handleDepotChange,
    handleStateChange,
    handleProductsChange,
    handleSizeChange,
    handleLGAChange,
    handleVolumeChange,
    handleTruckTypeChange,
    handleFlatbedLocationChange,
  } = useContext(BuyerContext);

  const { useFetchDepotHubs } = useDepotHubHook();
  const { data: depotsRes, isLoading: loadingDepots } = useFetchDepotHubs;
  const { useFetchProducts } = useProductHook();
  const { data: productsRes, isLoading: loadingProducts } = useFetchProducts;
  const { useFetchStates, useFetchStateLGA } = useStateHook();
  const { data: stateRes, isLoading: loadingState } = useFetchStates;
  const { data: lgaRes, isLoading: loadingLGA } = useFetchStateLGA(
    selectedState?.value,
  );
  const [trucksData, setTrucksData] = useState<any[]>([]);
  const [totalTrucks, setTotalTrucks] = useState<number>(0);
  const [productsData, setProductsData] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState<number>(0);

  const { useFetchTrucks } = useTruckHook();
  
  // Different conditions for tanker vs flatbed trucks
  const shouldFetchTankerTrucks =
    truckType?.value === 'tanker' &&
    selectedProduct?.value &&
    depot?.value &&
    selectedLoadStatus?.value &&
    selectedSize?.value &&
    selectedProduct?.value !== '' &&
    depot?.value !== '' &&
    selectedSize?.value !== '' &&
    selectedLoadStatus?.value !== '';

  const shouldFetchFlatbedTrucks =
    truckType?.value !== 'tanker' &&
    flatbedLocation?.value &&
    selectedState?.value &&
    selectedLGA?.value &&
    flatbedLocation?.value !== '' &&
    selectedState?.value !== '' &&
    selectedLGA?.value !== '';

  const shouldFetchTrucks = shouldFetchTankerTrucks || shouldFetchFlatbedTrucks;

  // Construct query based on truck type
  const getTruckQuery = () => {
    if (truckType?.value === 'tanker') {
      return `?productId=${selectedProduct?.value ?? ''}&depotHubId=${
        depot?.value ?? ''
      }&size=${selectedSize?.value ?? ''}&loadStatus=${selectedLoadStatus?.value ?? ''}&truckType=tanker&status=available&limit=20&page=`;
    } else if (truckType?.value !== 'tanker') {
      return `?locationId=${flatbedLocation?.value ?? ''}&truckType=${truckType?.value}&status=available&limit=20&page=`;
    }
    return '';
  };

  const {
    data: trucks,
    isFetching: isLoadingTrucks,
    fetchNextPage: fetchNextTruckPage,
    hasNextPage: truckHasNextPage,
    isFetchingNextPage: loadingFetchNextTruckPage,
    refetch: refetchTrucks,
  } = useFetchTrucks(
    getTruckQuery(),
    { enabled: !!shouldFetchTrucks }
  );

  const { useFetchProductUploads } = useProductUploadHook();
  const {
    data: productUploads,
    isFetching: isLoadingProducts,
    fetchNextPage: fetchNextProductPage,
    hasNextPage: productHasNextPage,
    isFetchingNextPage: loadingFetchNextProductPage,
    refetch: refetchProducts,
  } = useFetchProductUploads(
    `?productId=${selectedProduct?.value ?? ''}&depotHubId=${
      depot?.value ?? ''
    }&volume=${volume}&limit=20&status=active&page=`,
  );

  const validateSearchProduct = useCallback(() => {
    if (!selectedProduct) {
      showToast('Please select a product to search', 'error');
      return false;
    } else if (!depot) {
      showToast('Please select a depot', 'error');
      return false;
    } else if (volume === '') {
      showToast('Enter the volume you want to purchase', 'error');
      return false;
    }
    return true;
  }, [selectedProduct, depot, volume, showToast]);

  const validateSearchTrucks = useCallback(() => {
    if (!truckType) {
      showToast('Please select a truck type', 'error');
      return false;
    }
    
    if (truckType.value === 'tanker') {
      if (!selectedProduct) {
        showToast('Please select a product to search', 'error');
        return false;
      } else if (!depot) {
        showToast('Please select a depot', 'error');
        return false;
      } else if (!selectedSize) {
        showToast('Please select Volume', 'error');
        return false;
      } else if (!selectedLoadStatus) {
        showToast('Please select load status', 'error');
        return false;
      } else if (!selectedState) {
        showToast('Please select your destination state', 'error');
        return false;
      } else if (!selectedLGA) {
        showToast('Please select your destination LGA', 'error');
        return false;
      }
    } else if (truckType.value === 'flatbed') {
      if (!flatbedLocation) {
        showToast('Please select a location', 'error');
        return false;
      } else if (!selectedState) {
        showToast('Please select your destination state', 'error');
        return false;
      } else if (!selectedLGA) {
        showToast('Please select your destination LGA', 'error');
        return false;
      }
    }
    
    return true;
  }, [
    truckType,
    selectedProduct,
    depot,
    selectedSize,
    selectedState,
    selectedLGA,
    selectedLoadStatus,
    flatbedLocation,
    showToast,
  ]);

  const { useFetchBuyerAnalytics, useFetchBuyerScrollData } = useBuyerHook();
  const { data: buyerData, isLoading: loadingBuyerAnalytics } =
    useFetchBuyerAnalytics();
  const { data: buyerScrollData, isLoading: loadingBuyerScrollData } =
    useFetchBuyerScrollData();

  useEffect(() => {
    const mergedDataArray = trucks?.pages?.flatMap((page) => page.data) || [];
    setTotalTrucks(mergedDataArray[0]?.total);
    setTrucksData(mergedDataArray?.flatMap((item) => item.trucks));
  }, [trucks]);

  useEffect(() => {
    const mergedDataArray =
      productUploads?.pages?.flatMap((page) => page.data) || [];
    setTotalProducts(mergedDataArray[0]?.total);
    setProductsData(mergedDataArray?.flatMap((item) => item.productUploads));
  }, [productUploads]);

  const _activeTab = Cookies.get('active-tab') as TabTypes;

  const isTabType = (tab: string): tab is TabTypes => {
    return ['transporter', 'seller', 'calculator'].includes(tab);
  };

  const [activeTab, setActive] = useState<TabTypes>(
    isTabType(_activeTab) ? _activeTab : 'transporter',
  );

  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleTabClick = (payload: TabTypes) => {
    setActive(payload);
    Cookies.set('active-tab', payload);
  };

  const queryClient = useQueryClient();
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
      transports: ['websocket'],
      secure: true,
    });
    socket.on('receiveOffer', (offer) => {
      refetchProducts();
    });
    socket.on('receiveOrder', (order) => {
      setProductsData((prev) =>
        prev.map((item) => {
          if (item._id === order.productUploadId) {
            return {
              ...item,
              orders: [...item.orders, order.buyerId],
            };
          }
          return item;
        }),
      );

      queryClient.invalidateQueries({
        queryKey: ['PRODUCT_UPLOADS'],
      });
    });
  }, [queryClient, refetchProducts]);

  // const depots = useMemo(() => {
  //   if (depotsRes) {
  //     return depotsRes?.data
  //       ?.sort((a: DepotHubDto, b: DepotHubDto) => a.name.localeCompare(b.name))
  //       ?.map((item: DepotHubDto) => ({
  //         label: item.name,
  //         value: item._id,
  //       }));
  //   }
  // }, [depotsRes]);

    const depots = useMemo(() => {
      if (depotsRes && truckType) {
        return depotsRes?.data
          ?.filter((item: DepotHubDto) =>
            truckType.value === 'tanker' ? item.type === 'tanker' : item.type === 'others'
          )
          ?.sort((a: DepotHubDto, b: DepotHubDto) => a.name.localeCompare(b.name))
          ?.map((item: DepotHubDto) => ({
            label: item.name,
            value: item._id,
          }));
      }
      return [];
    }, [depotsRes, truckType]);

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

  const handleRefetchClick = useCallback(() => {
    if (activeTab === 'seller') {
      if (validateSearchProduct()) {
        refetchProducts();
      }
    } else if (activeTab === 'transporter') {
      if (validateSearchTrucks()) {
        refetchTrucks();
      }
    }
  }, [
    activeTab,
    refetchProducts,
    refetchTrucks,
    validateSearchProduct,
    validateSearchTrucks,
  ]);

  return {
    trucks,
    isLoadingTrucks,
    fetchNextTruckPage,
    truckHasNextPage,
    loadingFetchNextTruckPage,
    productUploads,
    isLoadingProducts,
    productHasNextPage,
    fetchNextProductPage,
    loadingFetchNextProductPage,
    user,
    loadingDepots,
    loadingProducts,
    selectedLGA,
    selectedLoadStatus,
    selectedState,
    loadingState,
    loadingLGA,
    trucksData,
    totalTrucks,
    depot,
    selectedSize,
    selectedProduct,
    activeTab,
    productsData,
    totalProducts,
    isMounted,
    truckType,
    flatbedLocation,
    handleTabClick,
    depots,
    states,
    products,
    lgas,
    volume,
    buyerData,
    loadingBuyerAnalytics,
    handleVolumeChange,
    handleRefetchClick,
    handleDepotChange,
    handleStateChange,
    handleProductsChange,
    handleLoadStatusChange,
    handleSizeChange,
    handleLGAChange,
    handleTruckTypeChange,
    handleFlatbedLocationChange,
    buyerScrollData,
    loadingBuyerScrollData,
  };
};

export default useBuyerDashboardHook;
