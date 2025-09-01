import { Header } from './header';
import { Text } from '@/components/atoms/text';
import { TruckOrderTableList } from './truck-order-list';
import React from 'react';
import useTruckRequestHook from '../hooks/useTruckRequest.hook';
import TrucksRenderer from './trucks-renderer';
import useOrderHook from '@/hooks/useOrder.hook';

const TruckRequest = () => {
  const {
    // trucks,
    userTrucks,
    isLoadingTrucks,
    setPage,
    fetchNextTruckPage,
    fetchingTruckError,
    // truckOrders,
    // isLoadingOrders,
    // allOrders,

    // refetchUserTruckOrders,
  } = useTruckRequestHook();

  const { useFetchAllOrders } = useOrderHook();

  const {
    data: allOrders,
    isLoading: isLoadingAllOrders,
    error: fetchingAllError,
    fetchNextPage: fetchNextPage,
    refetch: refetchAllOrders,
  } = useFetchAllOrders(`?type=truck&limit=${20}&page=`);
  // console.log(userTrucks)
  const orders = allOrders?.pages?.[0] || [];
  return (
    <>
      {/* <Header /> */}

      {/* <TrucksRenderer
        fetchNextPage={fetchNextTruckPage}
        isLoading={isLoadingTrucks}
        trucks={userTrucks}
      /> */}

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
          currentPage={orders?.data?.currentPage}
          totalPages={orders?.data?.totalPages}
          orders={orders?.data?.order || []}
          loading={isLoadingAllOrders}
        />
      )}
    </>
  );
};

export default TruckRequest;
