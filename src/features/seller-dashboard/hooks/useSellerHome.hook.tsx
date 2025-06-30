import io from 'socket.io-client';
import { AuthContext } from '@/contexts/AuthContext';
import { ModalContext } from '@/contexts/ModalContext';
import { useContext, useEffect, useReducer } from 'react';
import useSellerOrderHook from '../hooks/useSellerOrder.hook';
import { UPLOAD_PRODUCT } from '@/modals/upload-product-modal';
import useProductUploadHook from '@/hooks/useProductUpload.hook';
import {
  reducer as paginationReducer,
  initialState as initPaginationState,
} from '../store/reducer/seller-home.reducer';
import { useQueryClient } from '@tanstack/react-query';

const useSellerHomeHook = () => {
  const { handleToggle } = useContext(ModalContext);
  const { profile } = useContext(AuthContext);
  const [state, dispatch] = useReducer(paginationReducer, initPaginationState);
  const { useFetchProductUploads } = useProductUploadHook();
  const {
    data: productUploads,
    isFetching: isLoadingProducts,
    fetchNextPage: fetchNextProductPage,
    hasNextPage: productHasNextPage,
    isFetchingNextPage: loadingFetchNextProductPage,
  } = useFetchProductUploads(
    `?sellerId=${profile?._id}&limit=${state.productLimit}&status=active&page=`,
  );

  console.log(
    'seller home',
    productUploads,
    `?sellerId=${profile?._id}&limit=${state.productLimit}&status=active&page=`,
  );

  const { useFetchSellerOrders } = useSellerOrderHook();
  const {
    data: sellerOrders,
    isLoading: isLoadingOrders,
    refetch: refetchOrders,
  } = useFetchSellerOrders(
    `?sellerId=${profile?._id}&page=${state.orderPage}&limit=${state.orderLimit}`,
  );

  const queryClient = useQueryClient();
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
      transports: ['websocket'],
      secure: true,
    });
    socket.on('updatedOrderStatus', () => {
      queryClient.invalidateQueries({
        queryKey: ['ORDERS'],
      });
      refetchOrders();
    });
  }, [queryClient, sellerOrders, refetchOrders]);

  const openUploadProductModal = () =>
    handleToggle &&
    handleToggle({ name: UPLOAD_PRODUCT, data: {}, state: true });

  return {
    openUploadProductModal,
    productUploads,
    isLoadingProducts,
    sellerOrders,
    isLoadingOrders,
    dispatch,
    state,
    fetchNextProductPage,
    loadingFetchNextProductPage,
    productHasNextPage,
  };
};

export default useSellerHomeHook;
