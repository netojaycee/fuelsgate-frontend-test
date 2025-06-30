import React from 'react';
import { Header } from './header';
import { Text } from '@/components/atoms/text';
import useTruckListingHook from '../hooks/useTruckListing.hook';
import TrucksRenderer from './trucks-renderer';

const Trucks = () => {
  const {
    // availableTrucks,
    // isLoadingAvailableTrucks,
    // fetchNextAvailableTruckPage,
    // lockedTrucks,
    // isLoadingLockedTrucks,
    // fetchNextLockedTruckPage,
    userTrucks,
    isLoadingUserTrucks,
    fetchNextUserTruckPage,
    lockedUserTrucks,
    isLoadingLockedUserTrucks,
    fetchNextLockedUserTruckPage,
  } = useTruckListingHook();

  return (
    <>
      <Header />

      <TrucksRenderer
        fetchNextPage={fetchNextUserTruckPage}
        isLoading={isLoadingUserTrucks}
        trucks={userTrucks}
      />

      <Text
        variant="pl"
        color="text-dark-gray-500"
        fontWeight="medium"
        classNames="mb-4"
      >
        Locked Trucks
      </Text>

      <TrucksRenderer
        fetchNextPage={fetchNextLockedUserTruckPage}
        isLoading={isLoadingLockedUserTrucks}
        trucks={lockedUserTrucks}
      />
    </>
  );
};

export default Trucks;
