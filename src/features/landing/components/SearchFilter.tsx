'use client';
import CustomButton from '@/components/atoms/custom-button';
import { CustomSelect } from '@/components/atoms/custom-select';
import { TRUCK_SIZES } from '@/data/truck-sizes';
import {
  CustomProductOptionWrapper,
  CustomValueContainerWrapper,
} from '@/features/dashboard/components/product-select-components';
import usePublicSearch from '@/features/landing/hooks/usePublicSearch.hook';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import React, { Suspense } from 'react';

// Search filter loader placeholder for Suspense fallback
const SearchFilterLoader = () => {
  return (
    <div className="relative col-span-7 max-xl:col-span-12 grid max-sm:grid-cols-1 items-center gap-2 grid-cols-3">
      <div className="animate-pulse bg-gray-200 h-12 rounded"></div>
      <div className="animate-pulse bg-gray-200 h-12 rounded"></div>
      <div className="animate-pulse bg-gray-200 h-12 rounded"></div>
    </div>
  );
};

const SearchFilterContent = ({
  isLoading = false,
  search = false,
}: {
  isLoading?: boolean;
  search?: boolean;
}) => {
  const {
    loadingDepots,
    loadingProducts,
    depot,
    selectedSize,
    selectedProduct,
    depots,
    products,
    handleDepotChange,
    handleProductsChange,
    handleSizeChange,
    handleSearchTruckClick,
    areRequiredFieldsPresent,
    isSearching,
  } = usePublicSearch(search);
  return (
    <>
      <div className="relative col-span-7 max-xl:col-span-12 grid  items-center gap-2 grid-cols-3">
        <CustomSelect
          label="Product"
          classNames={search ? '' : 'text-white'}
          name="product"
          options={products}
          value={selectedProduct || undefined}
          onChange={(newValue) =>
            handleProductsChange(
              newValue as {
                label: string;
                value: string;
                color?: string;
                slug?: string;
              } | null,
            )
          }
          Option={CustomProductOptionWrapper}
          ValueContainer={CustomValueContainerWrapper}
          isDisabled={loadingProducts}
        />

        <CustomSelect
          label="Depot Hub"
          classNames={search ? '' : 'text-white text-left'}
          name="depot"
          options={depots}
          value={depot || undefined}
          onChange={(newValue) =>
            handleDepotChange(
              newValue as { label: string; value: string } | null,
            )
          }
          isDisabled={loadingDepots}
        />

        <CustomSelect
          label="Truck Size"
          classNames={search ? '' : 'text-white text-left'}
          name="truckSize"
          options={TRUCK_SIZES}
          value={selectedSize || undefined}
          onChange={(newValue) =>
            handleSizeChange(
              newValue as { label: string; value: string } | null,
            )
          }
        />
      </div>
      <div className={cn('search-button-container', search ? 'mt-8' : '')}>
        <CustomButton
          variant="glow"
          onClick={handleSearchTruckClick}
          leftIcon={<Search />}
          label="Search..."
          width="w-[250px]"
          height="h-12"
          loading={isSearching || isLoading}
          disabled={!areRequiredFieldsPresent}
          classNames={`transition-transform duration-200 ${
            areRequiredFieldsPresent
              ? 'hover:scale-105'
              : 'opacity-70 cursor-not-allowed'
          }`}
        />
      </div>
    </>
  );
};

// Wrap the actual component with Suspense
const SearchFilter = (props: { isLoading?: boolean; search?: boolean }) => {
  return (
    <Suspense fallback={<SearchFilterLoader />}>
      <SearchFilterContent {...props} />
    </Suspense>
  );
};

export default SearchFilter;
