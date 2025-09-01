'use client';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ArrowDownToLine, Search } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Text } from '@/components/atoms/text';
import CustomInput from '@/components/atoms/custom-input';
import { ChatPreview } from '@/features/chat/components/chat-preview';
import { cn } from '@/lib/utils';
import useOfferHook from '@/hooks/useOffer.hook';
import { OfferDto } from '@/types/offer.types';
import { AuthContext } from '@/contexts/AuthContext';
import CustomButton from '@/components/atoms/custom-button';
import CustomLoader from '@/components/atoms/custom-loader';

const ChatList = () => {
  const param = useParams();
  const { user } = useContext(AuthContext);
  const { useFetchOffers } = useOfferHook();
  const [search, setSearch] = useState('');
  const {
    data: offerList,
    isLoading: fetchingOffers,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useFetchOffers(
    `?profileId=${user?.data?._id}${
      search ? `&search=${search}` : ''
    }&limit=20&page=`,
  );

  const debouncedSearch = useCallback(
    (value: string) => {
      const timeout = setTimeout(() => {
        setSearch(value);
      }, 1500);
      return () => clearTimeout(timeout);
    },
    [setSearch],
  );

  useEffect(() => {
    refetch();
  }, [search, refetch]);

  return (
    <div className={cn('w-full min-h-[70vh]', param.chatId && 'max-lg:hidden')}>
      <CustomInput
        name="search"
        type="text"
        value={search}
        onChange={(e) => debouncedSearch(e.target.value)}
        placeholder="Search..."
        classNames="rounded-md mb-8"
        affix={<Search />}
      />
      <Text variant="pl" fontWeight="semibold" classNames="mb-5">
        {offerList?.pages[0].data.total} Conversations
      </Text>

      {offerList?.pages[0].data.total === 0 && (
        <div className="flex items-center justify-center h-[70vh]">
          <Text
            variant="pm"
            fontWeight="regular"
            color="text-gray-300"
            classNames="mb-5"
          >
            No conversations found
          </Text>
        </div>
      )}

      {/* RENDER MESSAGE LIST HERE */}
      {offerList?.pages.map((batch) =>
        batch.data.offers.map((item: OfferDto) => (
          <ChatPreview key={item._id} data={item} />
        )),
      )}

      {(fetchingOffers || isFetchingNextPage) && <CustomLoader />}
      {hasNextPage && (
        <CustomButton
          variant="white"
          label="Load more"
          onClick={() => fetchNextPage()}
          width="w-fit"
          height="h-10"
          fontSize="text-xs"
          color="text-gray-500"
          rightIcon={<ArrowDownToLine height={15} width={15} />}
          classNames="mx-auto gap-1"
        />
      )}
    </div>
  );
};

export { ChatList };
