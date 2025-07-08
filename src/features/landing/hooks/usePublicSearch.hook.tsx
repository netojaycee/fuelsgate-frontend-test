import usePublicDepotHub from '@/features/landing/hooks/usePublicDepotHub.hook';
import usePublicProduct from '@/features/landing/hooks/usePublicProduct.hook';
import usePublicState from '@/features/landing/hooks/usePublicState.hook';
import usePublicTruck from '@/features/landing/hooks/usePublicTruck.hook';
import { DepotHubDto } from '@/types/depot-hub.types';
import { ProductDto } from '@/types/product.types';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useToastConfig from '@/hooks/useToastConfig.hook';
import { useRouter, useSearchParams } from 'next/navigation';
import { TRUCK_SIZES } from '@/data/truck-sizes';

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

  // Check if all required fields are present
  const areRequiredFieldsPresent = useMemo(() => {
    return !!(selectedProduct && depot && selectedSize);
  }, [selectedProduct, depot, selectedSize]);

  const validateSearchTrucks = useCallback(() => {
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
    // else if (!selectedState) {
    //   showToast('Please select your destination state', 'error');
    //   return false;
    // } else if (!selectedLGA) {
    //   showToast('Please select your destination LGA', 'error');
    //   return false;
    // }
    return true;
  }, [
    selectedProduct,
    depot,
    selectedSize,
    // selectedState,
    // selectedLGA,
    showToast,
  ]);

  // Format data for dropdowns
  const depots = useMemo(() => {
    if (depotsRes) {
      return depotsRes?.data
        ?.sort((a: DepotHubDto, b: DepotHubDto) => a.name.localeCompare(b.name))
        ?.map((item: DepotHubDto) => ({
          label: item.name,
          value: item._id,
        }));
    }
    return [];
  }, [depotsRes]);

  const states = useMemo(() => {
    if (stateRes) {
      return stateRes?.map((item: string[]) => ({
        label: item,
        value: item,
      }));
    }
    return [];
  }, [stateRes]);

  const lgas = useMemo(() => {
    if (lgaRes) {
      return lgaRes?.map((item: string[]) => ({
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

      // If we have URL params, set the initial selections
      if (productId || depotHubId || sizeValue) {
        // Find the corresponding objects in our dropdown options
        if (productId && products?.length) {
          const product = products.find(
            (item: any) => item.value === productId,
          );
          if (product) setSelectedProduct(product);
        }

        if (depotHubId && depots?.length) {
          const depotObj = depots.find(
            (item: any) => item.value === depotHubId,
          );
          if (depotObj) setDepot(depotObj);
        }

        if (sizeValue && TRUCK_SIZES?.length) {
          const size = TRUCK_SIZES.find(
            (item: any) => item.value === sizeValue,
          );
          if (size) setSelectedSize(size);
        }

        setUrlParamsInitialized(true);
      } else {
        // If no URL params, reset selections
        setUrlParamsInitialized(true);
      }
    } else if (!isSearchPage) {
      // Not on search page, mark as initialized
      setUrlParamsInitialized(true);
    }
  }, [isSearchPage, searchParams, products, depots]);


  const constructedSearchQuery = useMemo(() => {
    if (
      isSearchPage &&
      urlParamsInitialized &&
      areRequiredFieldsPresent &&
      selectedProduct &&
      depot &&
      selectedSize
    ) {
      return `?productId=${selectedProduct.value}&depotHubId=${depot.value}&size=${selectedSize.value}&status=available&limit=20&page=`;
    }
    return ''; // Empty query will prevent the hook from running
  }, [
    isSearchPage,
    urlParamsInitialized,
    areRequiredFieldsPresent,
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
  // Run search if all required fields are present (separate effect)
  useEffect(() => {
    if (
      isSearchPage &&
      areRequiredFieldsPresent &&
      selectedProduct &&
      depot &&
      selectedSize
    ) {
      // All required fields are present, construct query and trigger search
      const query = `?productId=${selectedProduct.value}&depotHubId=${depot.value}&size=${selectedSize.value}&status=available&limit=20&page=`;
      setSearchQuery(query);
      setHasSearched(true);
    }
  }, [
    isSearchPage,
    areRequiredFieldsPresent,
    selectedProduct,
    depot,
    selectedSize,
  ]);

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

  // Search handler
  const handleSearchTruckClick = useCallback(() => {
    if (!areRequiredFieldsPresent) {
      // If any required field is missing, run validation to show appropriate errors
      validateSearchTrucks();
      return;
    }

    // At this point, all required fields are present due to areRequiredFieldsPresent check
    // But TypeScript doesn't know this, so we need to add null checks
    if (!selectedProduct || !depot || !selectedSize) {
      return; // This should never execute, but satisfies TypeScript
    }

    if (isSearchPage) {
      // On search page - perform search directly
      setIsSearching(true);
      const query = `?productId=${selectedProduct.value}&depotHubId=${depot.value}&size=${selectedSize.value}&status=available&limit=20&page=`;
      setSearchQuery(query);
      setHasSearched(true);

      // Update URL without navigation
      window.history.pushState(
        {},
        '',
        `/truck-search?productId=${selectedProduct.value}&depotHubId=${depot.value}&size=${selectedSize.value}`,
      );

      // Refetch data with new query
      setTimeout(() => {
        refetchTrucks();
        setIsSearching(false);
      }, 500);
    } else {
      // On landing page - navigate to search page
      router.push(
        `/truck-search?productId=${selectedProduct.value}&depotHubId=${depot.value}&size=${selectedSize.value}`,
      );
    }
  }, [
    areRequiredFieldsPresent,
    validateSearchTrucks,
    router,
    selectedProduct,
    depot,
    selectedSize,
    isSearchPage,
    refetchTrucks,
  ]);

  return {
    // Selection state
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
