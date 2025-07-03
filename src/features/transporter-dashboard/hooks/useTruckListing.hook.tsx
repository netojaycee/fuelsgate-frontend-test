import { AuthContext } from '@/contexts/AuthContext';
import { useContext } from 'react';
import useTruckHook from './useTruck.hook';

const useTruckListingHook = () => {
  const { profile } = useContext(AuthContext);
  const { useFetchTrucks, useFetchUserTrucks } = useTruckHook();

  const {
    data: availableTrucks,
    isFetching: isLoadingAvailableTrucks,
    fetchNextPage: fetchNextAvailableTruckPage,
    hasNextPage: availableTruckHasNextPage,
    isFetchingNextPage: loadingFetchNextAvailableTruckPage,
  } = useFetchTrucks(
    `?profileId=${profile?._id}&status=available&limit=15&page=`,
  );

  const {
    data: userTrucks,
    isFetching: isLoadingUserTrucks,
    fetchNextPage: fetchNextUserTruckPage,
    hasNextPage: userTruckHasNextPage,
    isFetchingNextPage: loadingFetchNextUserTruckPage,
  } = useFetchUserTrucks(
    `?status=available,pending&limit=15&page=`,
    'USER_TRUCKS',
  );

  const {
    data: lockedUserTrucks,
    isFetching: isLoadingLockedUserTrucks,
    fetchNextPage: fetchNextLockedUserTruckPage,
    hasNextPage: lockedUserTruckHasNextPage,
    isFetchingNextPage: loadingFetchNextLockedUserTruckPage,
  } = useFetchUserTrucks(`?status=locked&limit=15&page=`, 'LOCKED_USER_TRUCKS');

  const {
    data: lockedTrucks,
    isFetching: isLoadingLockedTrucks,
    fetchNextPage: fetchNextLockedTruckPage,
    hasNextPage: lockedTruckHasNextPage,
    isFetchingNextPage: loadingFetchNextLockedTruckPage,
  } = useFetchTrucks(
    `?profileId=${profile?._id}&status=locked&limit=15&page=`,
    'LOCKED_TRUCKS',
  );

  return {
    availableTrucks,
    isLoadingAvailableTrucks,
    fetchNextAvailableTruckPage,
    availableTruckHasNextPage,
    loadingFetchNextAvailableTruckPage,
    lockedTrucks,
    isLoadingLockedTrucks,
    fetchNextLockedTruckPage,
    lockedTruckHasNextPage,
    loadingFetchNextLockedTruckPage,
    userTrucks,
    isLoadingUserTrucks,
    fetchNextUserTruckPage,
    userTruckHasNextPage,
    loadingFetchNextUserTruckPage,
    lockedUserTrucks,
    isLoadingLockedUserTrucks,
    fetchNextLockedUserTruckPage,
    lockedUserTruckHasNextPage,
    loadingFetchNextLockedUserTruckPage,
  };
};

export default useTruckListingHook;
