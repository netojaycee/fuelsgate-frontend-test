import { Header } from './header';
import { Text } from '@/components/atoms/text';
import { TruckOrderTableList } from './truck-order-list';
import React from 'react';
import useTruckRequestHook from '../hooks/useTruckRequest.hook';
import TrucksRenderer from './trucks-renderer';

const TruckRequest = () => {
  const {
    trucks,
    isLoadingTrucks,
    setPage,
    fetchNextTruckPage,
    fetchingTruckError,
    truckOrders,
    isLoadingOrders,
  } = useTruckRequestHook();

  return (
    <>
      <Header />

      <TrucksRenderer
        fetchNextPage={fetchNextTruckPage}
        isLoading={isLoadingTrucks}
        trucks={trucks}
      />

      <Text variant="pl" color="text-dark-gray-500" fontWeight="medium">
        Orders
      </Text>
      {fetchingTruckError ? (
        <div className="text-red-500 bg-red-100 border-red-500 p-3 rounded-lg text-sm my-5">
          An Error occurred while trying to fetch truck orders. Please contact
          support!
        </div>
      ) : (
        <TruckOrderTableList
          setPage={setPage}
          currentPage={truckOrders?.data.currentPage}
          totalPages={truckOrders?.data.totalPages}
          orders={truckOrders?.data.truckOrders}
          loading={isLoadingOrders}
        />
      )}
    </>
  );
};

export default TruckRequest;
