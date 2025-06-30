'use client';
import React, { useContext } from 'react';
import { Text } from '@/components/atoms/text';
import { Heading } from '@/components/atoms/heading';
import { Order } from '@/features/my-orders/components/order';
import Image from 'next/image';
import Pattern from '@assets/images/Pattern.svg';
import useOrderHook from '@/hooks/useOrder.hook';
import { OrderDto } from '@/types/order.types';
import CustomLoader from '@/components/atoms/custom-loader';
import { AuthContext } from '@/contexts/AuthContext';

const MyOrders = () => {
  const { profile } = useContext(AuthContext);
  const { useFetchOffers } = useOrderHook();
  const { data, isLoading } = useFetchOffers(
    `?buyerId=${profile?._id}&limit=20&page=`,
  );

  return (
    <div className="relative bg-white">
      <div className="container mx-auto py-8">
        <div className="relative max-w-[1064px] mx-auto border border-mid-gray-550 sm:p-14 p-4 rounded-[10px]">
          <Image
            src={Pattern}
            alt="pattern"
            className="absolute top-0 left-0 z-0"
            height={440}
            width={1140}
          />

          <Heading
            variant="h3"
            fontWeight="semibold"
            classNames="mb-1 relative"
          >
            Orders &ndash; <span className="text-gold">Locked Volumes</span>
          </Heading>
          <Text
            variant="pm"
            color="text-black/70"
            classNames="relative max-w-[479px] mb-14"
          >
            See all the available products you have secured. Check tickets and
            complete procurement before their price timing expires
          </Text>

          <div className="grid grid-cols-1 gap-4">
            {isLoading ? (
              <CustomLoader />
            ) : data?.pages[0].data.total > 0 ? (
              data?.pages.map((item) =>
                item.data.orders.map((order: OrderDto) => (
                  <Order key={order._id} order={order} />
                )),
              )
            ) : (
              <div className="text-center text-xl font-medium py-10">
                No order found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
