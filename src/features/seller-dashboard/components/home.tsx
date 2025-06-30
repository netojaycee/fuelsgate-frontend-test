import { Plus } from 'lucide-react';
import React, { lazy, Suspense, useEffect, useRef } from 'react';
import { Text } from '@/components/atoms/text';
import { OrderTableList } from './orders-list';
import CustomButton from '@/components/atoms/custom-button';
import useSellerHomeHook from '../hooks/useSellerHome.hook';
import CustomLoader from '@/components/atoms/custom-loader';
import { ProductUploadDto } from '@/types/product-upload.types';

const Product = lazy(() => import('./product'));
const ProductsEmptyState = lazy(() => import('./products-empty-state'));

const Home = () => {
  const {
    sellerOrders,
    dispatch,
    productUploads,
    isLoadingOrders,
    isLoadingProducts,
    fetchNextProductPage,
    openUploadProductModal,
  } = useSellerHomeHook();
  const productsScroll = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentElement = productsScroll.current;
    
    const handleScroll = () => {
      if (currentElement) {
        const scrollLeft = currentElement.scrollLeft;
        const scrollWidth = currentElement.scrollWidth;
        const clientWidth = currentElement.clientWidth;

        if (scrollLeft + clientWidth >= scrollWidth - 5) {
          fetchNextProductPage();
        }
      }
    };

    if (currentElement) {
      currentElement.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentElement) {
        currentElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [fetchNextProductPage]);

  return (
    <>
      <div className="flex items-center flex-wrap justify-between gap-2 py-4">
        <Text variant="pl" color="text-dark-gray-500" fontWeight="medium">
          Products
        </Text>
        <CustomButton
          variant="primary"
          label="Upload Product"
          width="w-fit"
          height="h-11"
          fontSize="text-sm"
          leftIcon={<Plus height={24} width={24} />}
          classNames="gap-1 rounded-lg p-2"
          onClick={openUploadProductModal}
        />
      </div>

      <div
        ref={productsScroll}
        className="h-fit w-full p-1 mb-6 overflow-x-auto"
      >
        <Suspense fallback={<CustomLoader className="mb-6" />}>
          {isLoadingProducts ? (
            <CustomLoader
              className="mb-6 mx-auto"
              height="h-11"
              width="max-w-[250px]"
            />
          ) : productUploads?.pages[0].data.total ? (
            <div className="flex w-max h-fit gap-7">
              {productUploads.pages.map((product, index) => (
                <React.Fragment key={index}>
                  {product.data.productUploads?.map(
                    (item: ProductUploadDto) => (
                      <Product key={item._id} data={item} />
                    ),
                  )}
                </React.Fragment>
              ))}
            </div>
          ) : (
            <ProductsEmptyState />
          )}
        </Suspense>
      </div>

      <Text variant="pl" color="text-dark-gray-500" fontWeight="medium">
        Orders
      </Text>
      <OrderTableList
        orders={sellerOrders?.data?.orders}
        currentPage={sellerOrders?.data.currentPage}
        totalPages={sellerOrders?.data.totalPages}
        loading={isLoadingOrders}
        dispatch={dispatch}
      />
    </>
  );
};

export default Home;
