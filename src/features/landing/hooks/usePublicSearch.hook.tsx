import usePublicDepotHub from '@/features/landing/hooks/usePublicDepotHub.hook';
import usePublicProduct from '@/features/landing/hooks/usePublicProduct.hook';
import usePublicState from '@/features/landing/hooks/usePublicState.hook';
import usePublicTruck from '@/features/landing/hooks/usePublicTruck.hook';
import { DepotHubDto } from '@/types/depot-hub.types';
import { ProductDto } from '@/types/product.types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useToastConfig from '@/hooks/useToastConfig.hook';
import { useRouter, useSearchParams } from 'next/navigation';
import { TRUCK_SIZES, NON_TANKER_SIZES } from '@/data/truck-sizes';

/**
 * A public-friendly hook for search functionality that doesn't require authentication.
 * Used on public pages like the landing page search filters.
 */
const usePublicSearch = (isSearchPage = false) => {
  const { showToast } = useToastConfig();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { useFetchPublicTrucks } = usePublicTruck();

  // Search state
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hasSearched, setHasSearched] = useState(false);

  // Local state for selections (instead of using BuyerContext)
  const [depot, setDepot] = useState<{ label: string; value: string } | null>(
    null,
  );
  const [selectedProduct, setSelectedProduct] = useState<{
    label: string;
    value: string;
    color?: string;
    slug?: string;
  } | null>(null);
  const [selectedSize, setSelectedSize] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedState, setSelectedState] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedLGA, setSelectedLGA] = useState<{
    label: string;
    value: string;
  } | null>(null);

  // Truck type state
  const [truckType, setTruckType] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const [volume, setVolume] = useState<string>('');
  const [urlParamsInitialized, setUrlParamsInitialized] = useState(false);

  // Fetch public data without authentication requirements
  const { useFetchPublicDepotHubs } = usePublicDepotHub();
  const { data: depotsRes, isLoading: loadingDepots } = useFetchPublicDepotHubs;

  const { useFetchPublicProducts } = usePublicProduct();
  const { data: productsRes, isLoading: loadingProducts } =
    useFetchPublicProducts;

  const { useFetchPublicStates, useFetchPublicStateLGA } = usePublicState();
  const { data: stateRes, isLoading: loadingState } = useFetchPublicStates;
  const { data: lgaRes, isLoading: loadingLGA } = useFetchPublicStateLGA(
    selectedState?.value,
  );

  // Handler functions
  const handleDepotChange = useCallback(
    (value: { label: string; value: string } | null) => {
      setDepot(value);
    },
    [],
  );

  const handleProductsChange = useCallback(
    (
      value: {
        label: string;
        value: string;
        color?: string;
        slug?: string;
      } | null,
    ) => {
      setSelectedProduct(value);
    },
    [],
  );

  const handleSizeChange = useCallback(
    (value: { label: string; value: string } | null) => {
      setSelectedSize(value);
    },
    [],
  );

  const handleStateChange = useCallback(
    (value: { label: string; value: string } | null) => {
      setSelectedState(value);
      // Reset LGA when state changes
      setSelectedLGA(null);
    },
    [],
  );

  const handleLGAChange = useCallback(
    (value: { label: string; value: string } | null) => {
      setSelectedLGA(value);
    },
    [],
  );

  const handleTruckTypeChange = useCallback(
    (value: { label: string; value: string } | null) => {
      setTruckType(value);
      // Reset other selections when truck type changes
      setDepot(null);
      setSelectedProduct(null);
      setSelectedSize(null);
    },
    [],
  );

  const handleVolumeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setVolume(e.target.value);
    },
    [],
  );

  // Validation functions
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

  // Check if all required fields are present based on truck type
  const areRequiredFieldsPresent = useMemo(() => {
    if (!truckType) return false;

    if (truckType.value === 'tanker') {
      return !!(selectedProduct && depot && selectedSize);
    } else if (truckType.value !== 'tanker') {
      return !!depot; // Only location required for flatbed
    }
    return false;
  }, [truckType, selectedProduct, depot, selectedSize]);

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
        showToast('Please select truck size', 'error');
        return false;
      }
    } else if (truckType.value !== 'tanker') {
      if (!depot) {
        showToast('Please select a location', 'error');
        return false;
      }
    }

    return true;
  }, [truckType, selectedProduct, depot, selectedSize, showToast]);

  // Format data for dropdowns
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

  // total states
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

  const products = useMemo(() => {
    if (productsRes) {
      return productsRes?.data?.products.map((item: ProductDto) => ({
        color: item.color,
        slug: item.value,
        label: item.value.toLocaleUpperCase(),
        value: item._id,
      }));
    }
    return [];
  }, [productsRes]);

  // Initialize values from URL when on search page
  useEffect(() => {
    if (isSearchPage && searchParams) {
      // Get values from URL
      const productId = searchParams.get('productId');
      const depotHubId = searchParams.get('depotHubId');
      const sizeValue = searchParams.get('size');
      const truckTypeValue = searchParams.get('truckType');

      // If we have URL params, set the initial selections
      if (
        productId ||
        depotHubId ||
        sizeValue ||
        truckTypeValue
      ) {
        // Set truck type first (this is critical for conditional rendering)
        if (truckTypeValue) {
          const truckTypeOptions = [
            { label: 'Tanker', value: 'tanker' },
            { label: 'Flat Bed', value: 'flatbed' },
            { label: 'SideWall', value: 'sidewall' },
            { label: 'Lowbed', value: 'lowbed' },
          ];
          const truckTypeObj = truckTypeOptions.find(
            (item) => item.value === truckTypeValue,
          );
          if (truckTypeObj) setTruckType(truckTypeObj);
        }

        // Find the corresponding objects in our dropdown options
        if (productId && products?.length) {
          const product = products.find(
            (item: any) => item.value === productId,
          );
          if (product) setSelectedProduct(product);
        }

        // Handle depot/location for both tanker (depotHubId) and flatbed (locationId)
        if ((depotHubId) && depots?.length) {
          const depotObj = depots.find(
            (item: any) => item.value === (depotHubId),
          );
          if (depotObj) setDepot(depotObj);
        }

        if (sizeValue) {
          let sizeOptions = [];
          if (truckType && truckType.value === 'tanker') {
            sizeOptions = TRUCK_SIZES;
          } else {
            sizeOptions = NON_TANKER_SIZES;
          }
          const size = sizeOptions.find(
            (item: any) => item.value === sizeValue,
          );
          if (size) setSelectedSize(size);
        }

        setUrlParamsInitialized(true);
        setHasSearched(true); // Mark as searched since we have URL params
      } else {
        // If no URL params, reset selections
        setUrlParamsInitialized(true);
      }
    } else if (!isSearchPage) {
      // Not on search page, mark as initialized
      setUrlParamsInitialized(true);
    }
  }, [isSearchPage, searchParams, products, depots, truckType]);

  const constructedSearchQuery = useMemo(() => {
    if (isSearchPage && urlParamsInitialized && truckType) {
      if (
        truckType.value === 'tanker' &&
        selectedProduct &&
        depot &&
        selectedSize
      ) {
        return `?productId=${selectedProduct.value}&depotHubId=${depot.value}&size=${selectedSize.value}&truckType=tanker&status=available&limit=20&page=`;
      } else if (truckType.value !== 'tanker' && depot && selectedSize) {
        return `?depotHubId=${depot.value}&truckType=${truckType.value}&size=${selectedSize.value}&status=available&limit=20&page=`;
      }
    }
    return ''; // Empty query will prevent the hook from running
  }, [
    isSearchPage,
    urlParamsInitialized,
    truckType,
    selectedProduct,
    depot,
    selectedSize,
  ]);

  useEffect(() => {

    if (constructedSearchQuery) {
      setSearchQuery(constructedSearchQuery);
      setHasSearched(true);
    }
  }, [constructedSearchQuery]);

  // Fetch truck data based on search query
  const {
    data: trucksData,
    isFetching: isLoadingTrucks,
    fetchNextPage: fetchNextTruckPage,
    hasNextPage: truckHasNextPage,
    isFetchingNextPage: loadingFetchNextTruckPage,
    refetch: refetchTrucks,
  } = useFetchPublicTrucks(
    constructedSearchQuery || undefined,
    'PUBLIC_SEARCH_TRUCKS',
  );

  // Automatic search effect when URL params are loaded and all required fields are present
  useEffect(() => {
    if (
      isSearchPage &&
      urlParamsInitialized &&
      truckType &&
      constructedSearchQuery
    ) {
      // Automatically trigger search when URL parameters are present and initialized
      const timeoutId = setTimeout(() => {
        if (refetchTrucks) {
          refetchTrucks();
        }
      }, 100); // Small delay to ensure everything is properly initialized

      return () => clearTimeout(timeoutId);
    }
  }, [
    isSearchPage,
    urlParamsInitialized,
    truckType,
    constructedSearchQuery,
    refetchTrucks,
  ]);

  // Search handler
  const handleSearchTruckClick = useCallback(() => {
    if (!areRequiredFieldsPresent) {
      // If any required field is missing, run validation to show appropriate errors
      validateSearchTrucks();
      return;
    }

    // At this point, all required fields are present due to areRequiredFieldsPresent check
    if (!truckType) {
      return; // This should never execute, but satisfies TypeScript
    }

    if (isSearchPage) {
      // On search page - perform search directly
      setIsSearching(true);
      let query = '';
      let url = '';

      if (
        truckType.value === 'tanker' &&
        selectedProduct &&
        depot &&
        selectedSize
      ) {
        query = `?productId=${selectedProduct.value}&depotHubId=${depot.value}&size=${selectedSize.value}&truckType=tanker&status=available&limit=20&page=`;
        url = `/truck-search?productId=${selectedProduct.value}&depotHubId=${depot.value}&size=${selectedSize.value}&truckType=tanker`;
      } else if (truckType.value !== 'tanker' && depot && selectedSize) {
        query = `?depotHubId=${depot.value}&truckType=${truckType.value}&size=${selectedSize.value}&status=available&limit=20&page=`;
        url = `/truck-search?depotHubId=${depot.value}&truckType=${truckType.value}&size=${selectedSize.value}`;
      }

      if (query && url) {
        setSearchQuery(query);
        setHasSearched(true);

        // Update URL without navigation
        window.history.pushState({}, '', url);

        // Refetch data with new query
        setTimeout(() => {
          refetchTrucks();
          setIsSearching(false);
        }, 500);
      }
    } else {
      // On landing page - navigate to search page
      let url = '';

      if (
        truckType.value === 'tanker' &&
        selectedProduct &&
        depot &&
        selectedSize
      ) {
        url = `/truck-search?productId=${selectedProduct.value}&depotHubId=${depot.value}&size=${selectedSize.value}&truckType=tanker`;
      } else if (truckType.value !== 'tanker' && depot && selectedSize) {
        url = `/truck-search?depotHubId=${depot.value}&truckType=${truckType.value}&size=${selectedSize.value}`;
      }

      if (url) {
        router.push(url);
      }
    }
  }, [
    areRequiredFieldsPresent,
    validateSearchTrucks,
    router,
    truckType,
    selectedProduct,
    depot,
    selectedSize,
    isSearchPage,
    refetchTrucks,
  ]);

  return {
    // Selection state
    truckType,
    depot,
    selectedProduct,
    selectedSize,
    selectedState,
    selectedLGA,
    volume,

    // Loading states
    loadingDepots,
    loadingProducts,
    loadingState,
    loadingLGA,
    isSearching,

    // Search state
    hasSearched,
    searchQuery,
    areRequiredFieldsPresent,
    urlParamsInitialized,

    // Search results
    trucksData,
    isLoadingTrucks,
    fetchNextTruckPage,
    truckHasNextPage,
    loadingFetchNextTruckPage,

    // Data for dropdowns
    depots,
    products,
    states,
    lgas,

    // Handlers
    handleTruckTypeChange,
    handleDepotChange,
    handleProductsChange,
    handleSizeChange,
    handleStateChange,
    handleLGAChange,
    handleVolumeChange,
    handleSearchTruckClick,

    // Validation functions
    validateSearchProduct,
    validateSearchTrucks,
  };
};

export default usePublicSearch;
