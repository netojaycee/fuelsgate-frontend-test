import { Count } from './count';
import { cn } from '@/lib/utils';
import { ArrowDownToLine, Search } from 'lucide-react';
import { Sora } from 'next/font/google';
import { TruckTableList } from './truck-list';
import { Text } from '@/components/atoms/text';
import { ProductTableList } from './product-list';
import { Heading } from '@/components/atoms/heading';
import CustomInput from '@/components/atoms/custom-input';
import CustomButton from '@/components/atoms/custom-button';
import { CustomSelect } from '@/components/atoms/custom-select';
import { FGInfoFill, FGPaint, FGTruck, FGUserHeart } from '@fg-icons';
import React from 'react';
import {
  CustomProductOptionWrapper,
  CustomValueContainerWrapper,
  SortValueContainerWrapper,
} from './product-select-components';
import useBuyerDashboardHook from '../hooks/useBuyerDashboard.hook';
import { TRUCK_SIZES } from '@/data/truck-sizes';
import { formatNumber } from '@/utils/formatNumber';
import Marquee from 'react-fast-marquee';

const sora = Sora({ subsets: ['latin'] });

const BuyerDashboard = () => {
  const {
    isLoadingTrucks,
    fetchNextTruckPage,
    truckHasNextPage,
    loadingFetchNextTruckPage,
    isLoadingProducts,
    productHasNextPage,
    fetchNextProductPage,
    loadingFetchNextProductPage,
    productsData,
    totalProducts,
    user,
    loadingDepots,
    loadingProducts,
    selectedLGA,
    loadingState,
    loadingLGA,
    trucksData,
    totalTrucks,
    depot,
    selectedSize,
    selectedProduct,
    activeTab,
    isMounted,
    handleTabClick,
    depots,
    states,
    products,
    lgas,
    volume,
    handleVolumeChange,
    selectedState,
    buyerData,
    // loadingBuyerAnalytics,
    handleDepotChange,
    handleStateChange,
    handleProductsChange,
    handleSizeChange,
    handleRefetchClick,
    handleLGAChange,
  } = useBuyerDashboardHook();

  return (
    isMounted && (
      <div className="container mx-auto">
        {/* HEADER TEXT AND COUNTS */}
        <div className="mb-10 flex items-start gap-3 flex-wrap">
          <Heading
            variant="h3"
            color="text-gold"
            fontFamily={sora.className}
            lineHeight="leading-[38px]"
            classNames="max-w-[511px] mr-auto"
          >
            A Digital Platform For Bulk Fuel Procurement
          </Heading>

          {/* <div className="flex flex-wrap items-center gap-3">
            <Count
              icon={<FGPaint color="white" />}
              loading={loadingBuyerAnalytics}
              count={`${formatNumber(buyerData?.data?.totalVolume)} Ltr`}
              label="Volume Uploaded Today"
            />
            <Count
              icon={<FGUserHeart color="white" />}
              loading={loadingBuyerAnalytics}
              count={formatNumber(buyerData?.data?.totalSellers)}
              label="Total Sellers"
            />
            <Count
              icon={<FGTruck color="white" />}
              loading={loadingBuyerAnalytics}
              count={formatNumber(buyerData?.data?.totalTrucks)}
              label="Transporters"
            />
          </div> */}
        </div>

        {/* SEARCH AND FILTER CARD AND INPUTS */}
        <div className="bg-white border border-light-gray-450 rounded-[20px]">
          <div className="flex flex-wrap items-center gap-3 px-9 py-4 max-sm:px-4 border-b border-mid-gray-350">
            <CustomButton
              variant="plain"
              onClick={() => handleTabClick('seller')}
              width="w-fit"
              classNames="rounded-[9px]"
              color={cn(
                activeTab === 'seller' ? 'text-dark-300' : 'text-dark-gray-250',
              )}
              bgColor={cn(
                activeTab === 'seller' ? 'bg-light-gray-250' : 'bg-white',
              )}
              border={cn(
                'border',
                activeTab === 'seller'
                  ? 'border-mid-gray-250'
                  : 'border-light-gray-200',
              )}
              fontWeight="semibold"
              leftIcon={<FGUserHeart color="#666666" />}
              label="Sellers"
            />
            <CustomButton
              variant="plain"
              onClick={() => handleTabClick('transporter')}
              width="w-fit"
              classNames="rounded-[9px]"
              color={cn(
                activeTab === 'transporter'
                  ? 'text-dark-300'
                  : 'text-dark-gray-250',
              )}
              bgColor={cn(
                activeTab === 'transporter' ? 'bg-light-gray-250' : 'bg-white',
              )}
              border={cn(
                'border',
                activeTab === 'transporter'
                  ? 'border-mid-gray-250'
                  : 'border-light-gray-200',
              )}
              fontWeight="semibold"
              leftIcon={<FGTruck color="#666666" />}
              label="Transporters"
            />

            <Text
              variant="pm"
              classNames="ml-auto flex flex-wrap items-center gap-1"
              color="text-dark-gray-400"
            >
              <FGInfoFill color="#375DFB" height={15} width={15} />
              Filter your search for what you want.
            </Text>
          </div>

          {/* GREETING AND INPUT FIELDS TO SEARCH */}
          <div className="px-9 py-4 max-sm:px-4">
            {activeTab === 'seller' && (
              <>
                <Text
                  variant="pm"
                  fontWeight="semibold"
                  classNames="mb-1.5"
                  color="text-black"
                  lineHeight="leading-5"
                >
                  Hello {user?.data?.firstName}! 👋
                </Text>
                <Text
                  variant="pl"
                  color="text-black"
                  classNames="text-[20px] mb-5"
                  lineHeight="leading-6"
                >
                  What volume are we buying today?
                </Text>
              </>
            )}
            {activeTab === 'transporter' && (
              <>
                <Heading
                  variant="h5"
                  color="text-black"
                  classNames="text-[20px] my-5"
                  lineHeight="leading-6"
                >
                  Secure trucks to help transport your purchases
                </Heading>
              </>
            )}

            <div className="grid grid-cols-12 gap-2 items-center justify-stretch bg-light-gray-200 p-3 px-4 rounded-[10px]">
              <div
                className={cn(
                  'relative col-span-7 max-xl:col-span-12 grid max-sm:grid-cols-1 items-center gap-2',
                  activeTab === 'transporter' ? 'grid-cols-3' : 'grid-cols-2',
                )}
              >
                <CustomSelect
                  label="Select Product"
                  name="product"
                  options={products}
                  value={selectedProduct}
                  onChange={handleProductsChange}
                  Option={CustomProductOptionWrapper}
                  ValueContainer={CustomValueContainerWrapper}
                  isDisabled={loadingProducts}
                />

                <CustomSelect
                  label="Depot Hub"
                  name="depot"
                  options={depots}
                  value={depot}
                  onChange={handleDepotChange}
                  isDisabled={loadingDepots}
                />

                {activeTab === 'transporter' && (
                  <CustomSelect
                    label="Truck Size"
                    name="truckSize"
                    options={TRUCK_SIZES}
                    value={selectedSize}
                    onChange={handleSizeChange}
                  />
                )}
              </div>

              <div className="col-span-12 md:flex md:items-end gap-2 bg-mid-gray-150 rounded-lg px-4 py-2">
                {activeTab === 'seller' ? (
                  <CustomInput
                    type="number"
                    name="litres"
                    label="Volume"
                    classNames="grow"
                    defaultValue={volume}
                    onChange={handleVolumeChange}
                    affix="Ltr"
                  />
                ) : (
                  <div className="grow grid grid-cols-1 md:grid-cols-2 gap-2">
                    <CustomSelect
                      label="Delivery State"
                      name="state"
                      options={states}
                      value={selectedState}
                      isDisabled={loadingState}
                      onChange={handleStateChange}
                    />
                    <CustomSelect
                      label="Delivery City"
                      name="lga"
                      options={lgas}
                      isDisabled={loadingLGA}
                      value={selectedLGA}
                      onChange={handleLGAChange}
                    />
                  </div>
                )}
                <CustomButton
                  variant="primary"
                  type="button"
                  label="Search"
                  width="w-fit max-sm:w-full"
                  classNames="!rounded-lg mt-5 md:mt-0"
                  leftIcon={<Search />}
                  onClick={handleRefetchClick}
                />
              </div>
            </div>
          </div>
        </div>

        {/* SELECTED STATE AND ALERT */}
        <div className="flex flex-wrap items-center justify-between gap-3 my-7">
          <Heading
            variant="h5"
            fontWeight="semibold"
            lineHeight="leading-7"
            fontFamily={sora.className}
            color="text-dark-500"
          >
            {depot && <q>{depot?.label}</q>}
          </Heading>
          {activeTab === 'seller' && buyerData?.data?.totalSellers ? (
            <div className="h-7 bg-deep-gray-300 py-1 px-[10px] rounded-full w-fit">
              {buyerData?.data?.totalSellers < 20 ? (
                <Text variant="ps" color="text-white" fontWeight="regular">
                  Only{' '}
                  <span className="text-gold font-semibold">
                    {buyerData?.data?.totalSellers} available Seller
                  </span>{' '}
                  Left! Don&apos;t miss it
                </Text>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* AVAILABLE PRODUCTS */}
        <div className="flex items-center flex-wrap justify-between gap-3 border-y border-mid-gray-50 py-4">
          <Text variant="pm" fontWeight="regular" color="text-dark-500">
            {totalTrucks && totalProducts && (
              <>
                Available {activeTab === 'seller' ? 'Products' : 'Trucks'}
                &nbsp;-&nbsp;
                <span className="text-gold font-bold">
                  {activeTab === 'transporter' ? totalTrucks : totalProducts}
                </span>
              </>
            )}
          </Text>

          {activeTab === 'seller' && (
            <CustomSelect
              name="sort"
              classNames="w-[190px]"
              height="48px"
              borderRadius="9px"
              ValueContainer={SortValueContainerWrapper}
              value={{ label: 'Price', value: 'price' }}
              options={[
                { label: 'Price', value: 'price' },
                { label: 'Time', value: 'time' },
              ]}
            />
          )}
        </div>

        {/* PRODUCT LIST */}
        {activeTab === 'seller' && (
          <>
            <ProductTableList
              products={productsData}
              loading={isLoadingProducts || loadingFetchNextProductPage}
            />
            <div className="pb-5">
              {productHasNextPage ? (
                <CustomButton
                  variant="white"
                  label="Load more"
                  onClick={() => fetchNextProductPage()}
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
                  This is the end of our available product list
                </Text>
              )}
            </div>
          </>
        )}
        {/* TRUCK LIST */}
        {activeTab === 'transporter' && (
          <>
            <TruckTableList
              trucks={trucksData}
              loading={isLoadingTrucks || loadingFetchNextTruckPage}
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
        )}
      </div>
    )
  );
};

export default BuyerDashboard;
