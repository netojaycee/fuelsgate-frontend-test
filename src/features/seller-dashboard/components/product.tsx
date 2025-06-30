import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FGFlask } from '@fg-icons';
import { Sora } from 'next/font/google';
import { Text } from '@/components/atoms/text';
import { ProductUploadDto } from '@/types/product-upload.types';
import { ProductDto } from '@/types/product.types';
import { getMinutesDifference } from '@/utils/formatDate';
import { ModalContext } from '@/contexts/ModalContext';
import { AuthContext } from '@/contexts/AuthContext';
import { UPLOAD_PRODUCT } from '@/modals/upload-product-modal';
import NumberHandler from '@/components/atoms/number-hander';
import useProductUploadHook from '@/hooks/useProductUpload.hook';
import { useConfirmation } from '@/hooks/useConfirmation.hook';
import { Edit, Trash } from 'lucide-react';

// TODO: DOCUMENT THIS COMPONENT USING STORYBOOK
// TODO: PROVIDE AND EXTEND THE PROPS HERE
// TODO: MEMOIZE THIS COMPONENT

const sora = Sora({ subsets: ['latin'] });

type ProductProps = {
  data: ProductUploadDto;
};

const Product: React.FC<ProductProps> = ({ data }) => {
  const expiresInDate = new Date(data.expiresIn);
  const minDiff = getMinutesDifference(expiresInDate.toISOString());
  const totalSeconds = minDiff * 60;
  const [_time, setTime] = useState<number>(totalSeconds);
  const { handleToggle } = useContext(ModalContext);
  const { user } = useContext(AuthContext);
  const { useDeleteProductUpload } = useProductUploadHook();
  const { mutateAsync: deleteProductAsync } = useDeleteProductUpload();
  const { showConfirmation } = useConfirmation();

  // Get the logged-in user's ID for ownership check
  const loggedInUserId = user?.data?._id;
  const productUserId =
    typeof data?.sellerId === 'object' ? data?.sellerId?.userId : null;
  const isOwner = loggedInUserId === productUserId;

  const handleEditProductModal = () => {
    handleToggle &&
      handleToggle({
        name: UPLOAD_PRODUCT,
        data: {
          edit: true,
          product: data,
        },
        state: true,
      });
  };

  const handleDeleteProduct = () => {
    showConfirmation({
      title: 'Delete Product',
      message: `Are you sure you want to delete this product? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: async () => {
        if (data?._id) {
          await deleteProductAsync(data._id);
        }
      },
    });
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime: number) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [setTime]);

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours}hr${hours > 1 ? 's' : ''} : ${
      minutes < 10 ? '0' : ''
    }${minutes}ms : ${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}s`;
  }, []);
console.log(`data`, data);
  return (
    <div className="border border-light-gray-500 h-auto rounded-xl pr-4 py-7 pl-6 min-w-[250px]">
      {' '}
      <div className="flex items-start gap-2 justify-between mb-7">
        <div className="flex items-center gap-3">
          <span
            // className={`h-[38px] w-[38px] rounded-md flex items-center justify-center`}
            // style={{
            //   backgroundColor:
            //     (typeof data.productId === 'object'
            //       ? data.productId?.color
            //       : null) || '#50CD89',
            // }}
            className={`h-[30px] w-[30px] rounded-[4px] flex items-center justify-center border  ${
              (typeof data?.productId === 'object'
                ? data?.productId?.color
                : null) || 'bg-blue-tone-100'
            }`}
          >
            <FGFlask height={20} width={20} />
            {/* <FlaskConical className={`w-5 h-5 ${
              (typeof data?.productId === 'object'
                ? data?.productId?.color
                : null) || 'text-blue-tone-100'}`}/> */}
          </span>

          <div>
            <Text variant="ps" fontWeight="semibold" color="text-dark-gray-500">
              {(data.productId as ProductDto)?.name?.substring(0, 3)}
            </Text>
            <Text
              variant="pxs"
              fontWeight="semibold"
              color="text-green-tone-800"
            >
              {formatTime(_time)}
            </Text>
          </div>
        </div>

        {isOwner && (
          <div className="flex gap-2">
            <button
              type="button"
              className="flex items-center"
              onClick={handleEditProductModal}
            >
              <Edit className="text-blue-tone-250 w-4 h-4" />
            </button>
            <button
              type="button"
              className="flex items-center"
              onClick={handleDeleteProduct}
            >
              <Trash className="text-red-tone-600 w-4 h-4" />
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <Text
          variant="pm"
          fontWeight="semibold"
          color="text-dark-300"
          fontFamily={sora.className}
        >
          <NumberHandler number={data.volume} suffix="Ltrs" />
        </Text>
        <Text
          variant="pm"
          fontWeight="regular"
          color="text-dark-gray-400"
          fontFamily={sora.className}
        >
          <NumberHandler number={data.price} prefix="₦" />
        </Text>
      </div>
    </div>
  );
};

export default Product;
