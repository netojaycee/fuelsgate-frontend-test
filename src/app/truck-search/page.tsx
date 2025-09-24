'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import usePublicSearch from '@/features/landing/hooks/usePublicSearch.hook';
import { Card } from '@/components/ui/card';
import { Text } from '@/components/atoms/text';
import { Loader, AlertCircle, Search, ArrowDownToLine } from 'lucide-react';
import SearchFilter from '@/features/landing/components/SearchFilter';
import Image from 'next/image';
// import Logo from '@assets/images/logo_gold.svg';
import Link from 'next/link';
import { TruckTableList } from '@/features/dashboard/components/truck-list';
import CustomButton from '@/components/atoms/custom-button';
import Logo from '@/features/dashboard/components/Logo';

export default function TruckSearchPage() {
  // Use the enhanced search hook with isSearchPage set to true
  const [trucksData, setTrucksData] = useState<any[]>([]);
  const {
    trucksData: trucks,
    isLoadingTrucks,
    fetchNextTruckPage,
    truckHasNextPage,
    loadingFetchNextTruckPage,
    isSearching,
    hasSearched,
    areRequiredFieldsPresent,
    urlParamsInitialized,
  } = usePublicSearch(true);

  console.log(trucks, 'gggg search');

  useEffect(() => {
    const mergedDataArray = trucks?.pages?.flatMap((page) => page.data) || [];
    setTrucksData(mergedDataArray?.flatMap((item) => item.trucks));
  }, [trucks]);

  if (!urlParamsInitialized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto"></div>
            <p className="mt-4 text-gray-600">Initializing search...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen ">
      {/* Search filter section */}
      <div className="bg-gradient-to-b from-blue-tone-50 to-white pt-8 pb-12">
        <div className="group/navbar container mx-auto flex justify-between items-center gap-3 mb-4">
          {/* <Image src={Logo} width={99} height={67} alt="Logo" /> */}
         <Logo />
          <div className="flex items-center gap-4">
            <Link href={'/'} className="text-blue-tone-400 hover:underline">
              Home
            </Link>
          </div>
        </div>
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Search Available Trucks</h1>
            <p className="text-dark-gray-300">
              Use the filters below to find trucks that match your requirements
            </p>
          </div>
          <div className="bg-black rounded-3xl">
            <SearchFilter isLoading={isLoadingTrucks} search />
          </div>
        </div>
      </div>

      {/* Results section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Truck Search Results</h2>
          {trucks?.pages?.length &&
            trucks.pages[0]?.data?.trucks?.length > 0 && (
              <Text variant="ps" color="text-dark-gray-300">
                Showing {trucks.pages[0]?.data?.trucks?.length} results
              </Text>
            )}
        </div>

        {isLoadingTrucks ? (
          <div className="flex flex-col items-center justify-center h-60 bg-light-gray-200 rounded-lg">
            <Loader className="animate-spin mb-4 text-gold" size={40} />
            <Text variant="pl" fontWeight="medium">
              {'Searching for trucks...'}
            </Text>
            <Text variant="ps" color="text-dark-gray-300">
              This may take a moment
            </Text>
          </div>
        ) : trucks?.pages?.length &&
          trucks.pages[0]?.data?.trucks?.length > 0 ? (
          //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          //     {trucks.pages.map((page) =>
          //       page?.data?.trucks?.map((truck: any) => (
          //         <Card
          //           key={truck._id}
          //           className="p-5 shadow-md hover:shadow-lg transition-shadow rounded-xl border border-light-gray-300"
          //         >
          //           <div className="space-y-3">
          //             <div className="flex items-center justify-between">
          //               <Text
          //                 variant="pl"
          //                 fontWeight="semibold"
          //                 color="text-blue-tone-400"
          //               >
          //                 {truck.size} Truck
          //               </Text>
          //               <span className="px-3 py-1 bg-green-tone-200 text-green-tone-600 text-xs font-medium rounded-full">
          //                 {truck.status}
          //               </span>
          //             </div>
          //             <div className="border-b border-light-gray-300 my-2"></div>
          //             {truck.plateNumber && (
          //               <div className="flex justify-between">
          //                 <Text variant="ps" color="text-dark-gray-300">
          //                   Plate Number:
          //                 </Text>
          //                 <Text variant="ps" fontWeight="medium">
          //                   {truck.plateNumber}
          //                 </Text>
          //               </div>
          //             )}
          //             {truck.driverName && (
          //               <div className="flex justify-between">
          //                 <Text variant="ps" color="text-dark-gray-300">
          //                   Driver:
          //                 </Text>
          //                 <Text variant="ps" fontWeight="medium">
          //                   {truck.driverName}
          //                 </Text>
          //               </div>
          //             )}
          //             {truck.description && (
          //               <div className="mt-3">
          //                 <Text variant="ps" color="text-dark-gray-300">
          //                   Description:
          //                 </Text>
          //                 <Text variant="ps">{truck.description}</Text>
          //               </div>
          //             )}
          //             <button className="mt-4 w-full py-2 bg-gold hover:bg-opacity-90 text-white rounded-md transition-colors">
          //               Request Truck
          //             </button>
          //           </div>
          //         </Card>

          //       )),
          //     )}
          //   </div>
          <>
            <TruckTableList
              trucks={trucksData}
              loading={
                isLoadingTrucks || loadingFetchNextTruckPage || isSearching
              }
              isSearch
            />

            <div className="pb-5">
              {truckHasNextPage ? (
                <CustomButton
                  variant="white"
                  label="Load more"
                  onClick={() => fetchNextTruckPage()}
                  width="w-fit"
                  height="h-10"
                  color="text-gray-500"
                  rightIcon={<ArrowDownToLine height={20} width={20} />}
                  classNames="mx-auto gap-1"
                />
              ) : (
                <Text
                  variant="pxs"
                  classNames="text-center"
                  color="text-gray-300"
                >
                  This is the end of our available truck list
                </Text>
              )}
            </div>
          </>
        ) : hasSearched ? (
          <div className="flex flex-col items-center justify-center text-center py-16 bg-light-gray-200 rounded-lg">
            <AlertCircle className="mb-4 text-dark-gray-300" size={50} />
            <Text variant="pl" fontWeight="semibold" classNames="mb-2">
              No trucks found
            </Text>
            <Text
              variant="ps"
              color="text-dark-gray-300"
              classNames="max-w-md mb-6"
            >
              No available trucks match your search criteria. Please try
              different search parameters.
            </Text>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-16 bg-light-gray-100 rounded-lg border border-dashed border-light-gray-400">
            <Search className="mb-4 text-gold opacity-50" size={50} />
            <Text variant="pl" fontWeight="medium" classNames="mb-2">
              Start Your Search
            </Text>
            <Text
              variant="ps"
              color="text-dark-gray-300"
              classNames="max-w-md mb-2"
            >
              Use the search filters above to find trucks that match your
              requirements.
            </Text>
          </div>
        )}

        {truckHasNextPage && (
          <div className="mt-6 text-center">
            <button
              onClick={() => fetchNextTruckPage()}
              disabled={loadingFetchNextTruckPage}
              className="px-6 py-3 bg-gold hover:bg-opacity-90 text-white rounded-md transition-colors"
            >
              {loadingFetchNextTruckPage
                ? 'Loading more...'
                : 'Load more trucks'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
