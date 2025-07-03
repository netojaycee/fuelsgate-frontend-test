import CustomLoader from '@/components/atoms/custom-loader';
import React, { Suspense, useEffect, useRef, useState, useMemo } from 'react';
import Truck from './truck';
import TrucksEmptyState from './trucks-empty-state';
import { TruckDto, TruckStatus } from '../types/truck.type';
import TrucksSearchAndFilter from './trucks-search-and-filter';
import { Text } from '@/components/atoms/text';
import { Search } from 'lucide-react';

type TrucksRendererProps = {
  fetchNextPage: () => void;
  isLoading: boolean;
  trucks: any;
  filter?: boolean; // Optional prop to control filtering
};
const TrucksRenderer: React.FC<TrucksRendererProps> = ({
  fetchNextPage,
  isLoading,
  trucks,
  filter = true, // Default to true if not provided
}) => {
  const trucksScroll = useRef<HTMLDivElement | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TruckStatus | 'all'>('all');

  // Filter and search logic
  const filteredTrucks = useMemo(() => {
    if (!trucks?.pages) return [];

    return trucks.pages.map((page: any) => {
      const filteredData = { ...page };
      if (page.data.trucks) {
        filteredData.data = { ...page.data };
        filteredData.data.trucks = page.data.trucks.filter(
          (truck: TruckDto) => {
            // Apply status filter
            const statusMatches =
              statusFilter === 'all' || truck.status === statusFilter;

            // Apply search filter - case insensitive search on truck number
            const searchMatches =
              !searchTerm ||
              (truck.truckNumber &&
                truck.truckNumber
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase()));

            return statusMatches && searchMatches;
          },
        );
      }
      return filteredData;
    });
  }, [trucks, searchTerm, statusFilter]);

  // Check if any trucks match the current filters
  const hasFilteredResults = useMemo(() => {
    if (!filteredTrucks.length) return false;
    return filteredTrucks.some(
      (page: any) => page.data.trucks && page.data.trucks.length > 0,
    );
  }, [filteredTrucks]);

  // Handle search changes
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  // Handle filter changes
  const handleFilterChange = (filter: TruckStatus | 'all') => {
    setStatusFilter(filter);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (trucksScroll.current) {
        const scrollLeft = trucksScroll.current.scrollLeft;
        const scrollWidth = trucksScroll.current.scrollWidth;
        const clientWidth = trucksScroll.current.clientWidth;

        if (scrollLeft + clientWidth >= scrollWidth - 5) {
          fetchNextPage();
        }
      }
    };

    const currentElement = trucksScroll.current;
    if (currentElement) {
      currentElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentElement) {
        currentElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [fetchNextPage]);

  return (
    <>
      {filter && (
        <TrucksSearchAndFilter
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
        />
      )}

      <div className="h-fit w-full mb-4">
        <Suspense fallback={<CustomLoader className="mb-3" />}>
          {isLoading ? (
            <CustomLoader
              className="mb-6 mx-auto"
              height="h-11"
              width="max-w-[250px]"
            />
          ) : trucks?.pages[0].data.total ? (
            hasFilteredResults ? (
              <div
                ref={trucksScroll}
                className="h-fit w-full p-1 overflow-x-auto"
              >
                <div className="grid grid-cols-3 w-max h-fit gap-7 p-4">
                  {filteredTrucks.map((truck: any, index: number) => (
                    <React.Fragment key={index}>
                      {truck.data.trucks?.map((item: TruckDto) => (
                        <Truck key={item._id} data={item} />
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 w-full bg-gray-50 rounded-lg border border-gray-100">
                <div className="inline-block p-4 bg-white rounded-full mb-4 shadow-sm">
                  <Search className="w-6 h-6 text-gray-400" />
                </div>
                <Text variant="ps" color="text-gray-700" fontWeight="medium">
                  No trucks found matching your filters
                </Text>
                <Text variant="pxs" color="text-gray-500" classNames="mt-2">
                  Try adjusting your search or filter criteria
                </Text>
              </div>
            )
          ) : (
            <TrucksEmptyState />
          )}
        </Suspense>
      </div>
    </>
  );
};

export default TrucksRenderer;
