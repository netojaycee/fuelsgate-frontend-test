import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  fetchProductUploadsRequest,
  getProductUploadRequest,
  saveProductUploadsRequest,
  updateProductUploadsRequest,
  deleteProductUploadRequest,
} from '@/services/product-upload.service';
import { ProductUploadDto } from '@/types/product-upload.types';
import useToastConfig from './useToastConfig.hook';
import { ModalContext } from '@/contexts/ModalContext';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

const useProductUploadHook = () => {
  const { showToast } = useToastConfig();
  const { handleClose } = useContext(ModalContext);
  const { user } = useContext(AuthContext);
  const role = user?.data?.role;

  const useFetchProductUploads = (query?: string) => {
    return useInfiniteQuery({
      queryFn: async ({ pageParam = 1 }) => {
        return await fetchProductUploadsRequest(query ?? '', pageParam);
      },
      initialPageParam: 1,
      queryKey: ['PRODUCT_UPLOADS', query],
      getNextPageParam: (lastPage) => {
        const currentPage = parseInt(lastPage.data.currentPage);
        const totalPage = lastPage.data.totalPages;
        return currentPage < totalPage ? currentPage + 1 : undefined;
      },
      enabled: role === 'buyer' ? false : true,
    });
  };

  const useGetProductUploadHook = (productUploadId: string) =>
    useQuery({
      queryFn: async () => {
        return await getProductUploadRequest(productUploadId);
      },
      queryKey: [`PRODUCT_UPLOAD_${productUploadId}`, productUploadId],
    });

  const useUploadProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (
        data: Omit<ProductUploadDto, '_id' | 'sellerId' | 'status'>,
      ) => saveProductUploadsRequest(data),
      onSuccess: (response) => {
        showToast(response.message, 'success');
        queryClient.invalidateQueries({ queryKey: ['PRODUCT_UPLOADS'] });
        handleClose && handleClose();
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });
  };

  const useUpdateProductUpload = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (
        data: Omit<ProductUploadDto, '_id' | 'sellerId' | 'status'>,
      ) => updateProductUploadsRequest(data, id),
      onSuccess: (response) => {
        showToast(response.message, 'success');
        queryClient.invalidateQueries({ queryKey: ['PRODUCT_UPLOADS'] });
        handleClose && handleClose();
      },
      onError: (response) => {
        showToast(response.message, 'error');
      },
    });
  };

  const useDeleteProductUpload = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (productUploadId: string) =>
        deleteProductUploadRequest(productUploadId),
      onSuccess: (response) => {
        showToast(
          response.message || 'Product deleted successfully',
          'success',
        );
        queryClient.invalidateQueries({ queryKey: ['PRODUCT_UPLOADS'] });
      },
      onError: (response) => {
        showToast(response.message || 'Failed to delete product', 'error');
      },
    });
  };

  return {
    useFetchProductUploads,
    useUploadProduct,
    useUpdateProductUpload,
    useGetProductUploadHook,
    useDeleteProductUpload,
  };
};

export default useProductUploadHook;
