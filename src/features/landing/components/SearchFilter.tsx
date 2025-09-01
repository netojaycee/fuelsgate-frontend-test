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
import { Search, Truck, Package, MapPin, Gauge } from 'lucide-react';
import React, { Suspense } from 'react';

// Truck type options
const TRUCK_TYPES = [
  { label: 'Tanker', value: 'tanker', icon: '🚚' },
  { label: 'Flat Bed', value: 'flatbed', icon: '🚛' },
];

// Search filter loader placeholder for Suspense fallback
const SearchFilterLoader = () => {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse bg-white/20 h-14 rounded-xl"></div>
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <div className="animate-pulse bg-white/20 h-12 w-48 rounded-xl"></div>
      </div>
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
    truckType,
    loadingDepots,
    loadingProducts,
    depot,
    selectedSize,
    selectedProduct,
    selectedState,
    depots,
    products,
    states,
    loadingState,
    handleTruckTypeChange,
    handleDepotChange,
    handleProductsChange,
    handleSizeChange,
    handleSearchTruckClick,
    areRequiredFieldsPresent,
    isSearching,
  } = usePublicSearch(search);


  return (
    <div className="relative bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl overflow-visible">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-orange-400/5 opacity-50 rounded-3xl"></div>
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400/10 rounded-full blur-xl"></div>
      <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-orange-400/10 rounded-full blur-xl"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h3 className="text-white text-xl md:text-2xl font-bold mb-3 leading-tight">
            Find Your Perfect Truck
          </h3>
          <p className="text-white/80 text-sm md:text-base">
            Select your truck type and requirements to get started
          </p>
        </div>

        {/* Truck Type Selection - Always shown first */}
        <div className="mb-8">
          <div className="grid grid-cols-2 gap-4">
            {TRUCK_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => handleTruckTypeChange(type)}
                className={cn(
                  "group p-6 rounded-2xl border-2 transition-all duration-500 flex flex-col items-center gap-3 relative overflow-hidden",
                  truckType?.value === type.value
                    ? "border-yellow-400 bg-gradient-to-br from-yellow-400/30 to-orange-400/20 text-white shadow-2xl transform scale-105 shadow-yellow-400/20"
                    : "border-white/30 bg-white/10 text-white/90 hover:border-yellow-400/50 hover:bg-white/15 hover:transform hover:scale-105 hover:shadow-lg"
                )}
              >
                {/* Background glow effect for selected */}
                {truckType?.value === type.value && (
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/10 animate-pulse"></div>
                )}
                
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <span className="text-3xl md:text-4xl transition-transform duration-300 group-hover:scale-110">
                    {type.icon}
                  </span>
                  <span className="font-semibold text-sm md:text-base">
                    {type.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Conditional Fields Based on Truck Type */}
        {truckType && (
          <div className="space-y-6 transition-all duration-500 ease-in-out">
            {/* For Tanker: Show Product, Location, Size */}
            {truckType.value === 'tanker' && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-white/80 text-sm">
                    Configure your tanker truck requirements
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  <div className="space-y-3 group">
                    <div className="flex items-center gap-2 text-white/90 text-sm font-semibold">
                      <div className="p-1.5 bg-blue-500/20 rounded-lg">
                        <Package className="w-4 h-4 text-blue-400" />
                      </div>
                      Product
                    </div>
                    <div className="transform transition-all duration-300 group-hover:scale-105 relative z-50">
                      <CustomSelect
                        placeholder="Select Product"
                        classNames="bg-white/95 text-gray-800 border-0 text-left shadow-lg relative z-50 text-left"
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
                    </div>
                  </div>

                  <div className="space-y-3 group">
                    <div className="flex items-center gap-2 text-white/90 text-sm font-semibold">
                      <div className="p-1.5 bg-green-500/20 rounded-lg">
                        <MapPin className="w-4 h-4 text-green-400" />
                      </div>
                      Location
                    </div>
                    <div className="transform transition-all duration-300 group-hover:scale-105 relative z-40">
                      <CustomSelect
                        placeholder="Select Location"
                        classNames="bg-white/95 text-gray-800 border-0 text-left shadow-lg relative z-40"
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
                    </div>
                  </div>

                  <div className="space-y-3 group">
                    <div className="flex items-center gap-2 text-white/90 text-sm font-semibold">
                      <div className="p-1.5 bg-purple-500/20 rounded-lg">
                        <Gauge className="w-4 h-4 text-purple-400" />
                      </div>
                      Truck Size
                    </div>
                    <div className="transform transition-all duration-300 group-hover:scale-105 relative z-30">
                      <CustomSelect
                        placeholder="Select Size"
                        classNames="bg-white/95 text-gray-800 border-0 text-left shadow-lg relative z-30"
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
                  </div>
                </div>
              </div>
            )}

            {/* For Flatbed: Show only Location (using states data) */}
            {truckType.value === 'flatbed' && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-white/80 text-sm">
                    Select your destination state for flatbed delivery
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3 group">
                    <div className="flex items-center gap-2 text-white/90 text-sm font-semibold">
                      <div className="p-1.5 bg-green-500/20 rounded-lg">
                        <MapPin className="w-4 h-4 text-green-400" />
                      </div>
                      State/Location
                    </div>
                    <div className="transform transition-all duration-300 group-hover:scale-105 relative z-50">
                      <CustomSelect
                        placeholder="Select State"
                        classNames="bg-white/95 text-gray-800 border-0 text-left shadow-lg relative z-50"
                        name="location"
                        options={states}
                        value={selectedState || undefined}
                        onChange={(newValue) =>
                          handleDepotChange(
                            newValue as { label: string; value: string } | null,
                          )
                        }
                        isDisabled={loadingState}
                      />
                    </div>
                  </div>
                  <div className="flex items-end">
                    <div className="w-full p-5 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl border border-blue-400/30 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-400/20 rounded-lg">
                          <Truck className="w-5 h-5 text-blue-300" />
                        </div>
                        <div>
                          <p className="text-blue-200 text-sm font-medium">
                            Versatile Transport
                          </p>
                          <p className="text-blue-300/80 text-xs">
                            Perfect for any cargo type
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search Button */}
            <div className="pt-6 flex justify-center relative z-10">
              <div className="relative group">
                {areRequiredFieldsPresent && (
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                )}
                <CustomButton
                  variant="glow"
                  onClick={handleSearchTruckClick}
                  leftIcon={<Search className="w-5 h-5" />}
                  label="Search Trucks"
                  width="w-full md:w-[320px]"
                  height="h-16"
                  loading={isSearching || isLoading}
                  disabled={!areRequiredFieldsPresent}
                  classNames={cn(
                    "relative text-lg font-bold transition-all duration-300 rounded-2xl",
                    areRequiredFieldsPresent
                      ? "hover:scale-105 hover:shadow-2xl transform"
                      : "opacity-60 cursor-not-allowed"
                  )}
                />
              </div>
            </div>
          </div>
        )}

        {/* Default State when no truck type selected */}
        {!truckType && (
          <div className="text-center py-12 transition-all duration-500">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-2xl"></div>
              <Truck className="relative w-20 h-20 text-white/60 mx-auto mb-6" />
            </div>
            <p className="text-white/80 text-lg font-medium mb-2">
              Choose your truck type to get started
            </p>
            <p className="text-white/60 text-sm">
              Select between tanker and flatbed options above
            </p>
          </div>
        )}
      </div>
    </div>
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
