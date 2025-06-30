import CustomLoader from '@/components/atoms/custom-loader';
import React, { Suspense, useEffect, useRef } from 'react';
import Truck from './truck';
import TrucksEmptyState from './trucks-empty-state';
import { TruckDto } from '../types/truck.type';

type TrucksRendererProps = {
  fetchNextPage: () => void;
  isLoading: boolean;
  trucks: any;
};
const TrucksRenderer: React.FC<TrucksRendererProps> = ({
  fetchNextPage,
  isLoading,
  trucks,
}) => {
  const trucksScroll = useRef<HTMLDivElement | null>(null);


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
    <div ref={trucksScroll} className="h-fit w-full p-1 mb-6 overflow-x-auto">
      <Suspense fallback={<CustomLoader className="mb-6" />}>
        {isLoading ? (
          <CustomLoader
            className="mb-6 mx-auto"
            height="h-11"
            width="max-w-[250px]"
          />
        ) : trucks?.pages[0].data.total ? (
          <div className="grid grid-cols-3 w-max h-fit gap-7 p-4">
            {trucks.pages.map((truck: any, index: number) => (
              <React.Fragment key={index}>
                {truck.data.trucks?.map((item: TruckDto) => (
                  <Truck key={item._id} data={item} />
                ))}
              </React.Fragment>
            ))}
          </div>
        ) : (
          <TrucksEmptyState />
        )}
      </Suspense>
    </div>
  );
};

export default TrucksRenderer;
