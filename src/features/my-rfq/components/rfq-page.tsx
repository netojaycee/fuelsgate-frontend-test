'use client';
import React from 'react';
import Image from 'next/image';
import Pattern from '@assets/images/Pattern.svg';
import { Heading } from '@/components/atoms/heading';
import { Text } from '@/components/atoms/text';
import { RfqComponent } from '@/features/my-rfq/components/rfq';
import useTruckOrderHook from '@/hooks/useTruckOrder.hook';
import CustomLoader from '@/components/atoms/custom-loader';
import { TruckOrderDto } from '@/types/truck-order.types';

const RfqPage = () => {
  const { useFetchTruckOrders } = useTruckOrderHook();
  const { data, isLoading } = useFetchTruckOrders(`?limit=20&page=`);

  console.log(data, 'RFQ DATA');

  return (
    <>
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
              RFQ
            </Heading>
            <Text
              variant="pm"
              color="text-black/70"
              classNames="relative max-w-[479px] mb-14"
            >
              See all the quotes sent to you
            </Text>

            <div className="grid grid-cols-1 gap-4">
              {isLoading ? (
                <CustomLoader />
              ) : data?.pages[0].data.total > 0 ? (
                data?.pages.map((item) =>
                  item.data.truckOrders.map((truckOrder: TruckOrderDto) => (
                    <RfqComponent
                      key={truckOrder._id}
                      truckOrder={truckOrder}
                    />
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
    </>
  );
};

export default RfqPage;
