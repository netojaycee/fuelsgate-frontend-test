import React, { useContext } from 'react';
import { Sora } from 'next/font/google';
import { cn } from '@/lib/utils';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Text } from '@/components/atoms/text';
import OrderImg from '@assets/images/Order.svg';
import Image from 'next/image';
import { Timer } from '@/components/atoms/timer';
import CustomButton from '@/components/atoms/custom-button';
import Cookies from 'js-cookie';
import { Download } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FGReceipt } from '@fg-icons';
import { ModalContext } from '@/contexts/ModalContext';
import useProductUploadHook from '@/hooks/useProductUpload.hook';
import CustomLoader from '@/components/atoms/custom-loader';
import { getMinutesDifference, timeDiff } from '@/utils/formatDate';
import { formatNumber } from '@/utils/formatNumber';
import useOrderHook from '@/hooks/useOrder.hook';
import NumberHandler from '@/components/atoms/number-hander';

const sora = Sora({ subsets: ['latin'] });
const ORDER_SUMMARY = 'order-summary';

const OrderSummaryModal = () => {
  const { openModal } = useContext(ModalContext);
  const volume = Cookies.get('volume');

  const { useGetProductUploadHook } = useProductUploadHook();
  const { data, isLoading } = useGetProductUploadHook(
    openModal?.data?.productUploadId,
  );
  const { useCreateOrder } = useOrderHook();
  const { mutateAsync, isPending } = useCreateOrder();

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = data.data.productQuality;
    a.download = 'product_quality.pdf';
    a.target = '_blank';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleContactClick = () => {
    const a = document.createElement('a');
    a.href = `tel:${data.data.sellerId?.phoneNumber}`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCreateOrder = async () => {
    await mutateAsync({
      productUploadId: openModal?.data?.productUploadId,
      sellerId: openModal?.data?.sellerId,
      price: openModal?.data?.price,
      volume: volume ? parseInt(volume) : 0,
    });
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle
          className={cn(
            'leading-5 text-blue-tone-200 font-semibold text-2xl',
            sora.className,
          )}
        >
          Order Summary
        </DialogTitle>
      </DialogHeader>
      {isLoading ? (
        <CustomLoader />
      ) : (
        <div>
          <Text variant="pxs" color="text-dark-gray-400" classNames="mb-2">
            Last updated:{' '}
            <span className="font-medium">{timeDiff(data.data.updatedAt)}</span>
          </Text>
          <div className="relative h-[127px] w-full mb-2">
            <Image src={OrderImg} fill alt="Order image" />
          </div>
          <div className="flex items-center gap-2 justify-between mb-1">
            <Timer
              time={getMinutesDifference(data.data.expiresIn)}
              format="hh:mm"
              classNames="border-none"
            />
            {data.data.productQuality && (
              <CustomButton
                variant="plain"
                label="Product Document"
                leftIcon={<Download height={20} width={20} />}
                onClick={handleDownload}
                color="text-blue-tone-350"
                fontSize="text-sm"
                width="w-fit"
                classNames="gap-1"
              />
            )}
          </div>
          <div className="bg-light-gray-150 rounded-[10px] p-3 mb-3">
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center justify-between gap-2 mb-4">
                <Text
                  variant="pm"
                  color="text-dark-gray-550"
                  fontWeight="semibold"
                >
                  Product Details
                </Text>
                <span
                  className={cn(
                    'inline-flex items-center justify-center h-[17px] w-10 text-xs font-medium rounded-sm uppercase text-white',
                    data.data.productId?.color,
                  )}
                >
                  {data.data.productId?.value}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <Text
                  variant="ps"
                  color="text-dark-gray-550"
                  fontWeight="regular"
                >
                  <span className="uppercase">
                    {data.data.productId?.value}
                  </span>{' '}
                  Volume
                </Text>
                <Text
                  variant="ps"
                  color="text-dark-gray-550"
                  fontWeight="medium"
                >
                  <NumberHandler number={data.data.volume} suffix="Ltrs" />
                </Text>
              </div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <Text
                  variant="ps"
                  color="text-dark-gray-550"
                  fontWeight="regular"
                >
                  Price Per Litre
                </Text>
                <Text
                  variant="ps"
                  color="text-dark-gray-550"
                  fontWeight="medium"
                >
                  <NumberHandler
                    number={data.data.price}
                    prefix="₦"
                    suffix="/Ltr"
                  />
                </Text>
              </div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <Text
                  variant="ps"
                  color="text-dark-gray-550"
                  fontWeight="regular"
                >
                  Loading Depot
                </Text>
                <Text
                  variant="ps"
                  color="text-dark-gray-550"
                  fontWeight="medium"
                >
                  {data.data.depot}, {data.data.depotHubId.name}
                </Text>
              </div>
              {volume && (
                <div className="flex items-center justify-between gap-2 bg-light-gray-200 p-2 rounded-[4px]">
                  <Text
                    variant="ps"
                    color="text-dark-gray-550"
                    fontWeight="regular"
                  >
                    Volume Ordered (x <NumberHandler number={volume} />)
                  </Text>
                  <Text
                    variant="ps"
                    color="text-dark-gray-550"
                    fontWeight="bold"
                  >
                    <NumberHandler
                      number={parseInt(volume) * data.data.price}
                      prefix="₦"
                    />
                  </Text>
                </div>
              )}
            </div>
          </div>
          <div className="bg-light-gray-150 rounded-[10px] p-3 mb-7">
            <div className="bg-white rounded-lg p-3">
              <Text
                variant="pm"
                color="text-dark-gray-550"
                fontWeight="semibold"
                classNames="mb-4"
              >
                Seller Details
              </Text>
              <div className="flex flex-wrap items-center gap-3">
                <Avatar className="h-[38px] w-[38px]">
                  <AvatarImage
                    src={data.data.sellerId?.profilePicture}
                    className="object-cover"
                  />
                  <AvatarFallback>
                    {data.data.sellerId.businessName?.substring(0, 1)}
                  </AvatarFallback>
                </Avatar>

                <div className="mr-auto">
                  <Text variant="pl" fontFamily={sora.className}>
                    {data.data.sellerId.businessName}
                  </Text>
                  <Text variant="ps" color="text-dark-gray-50">
                    12 uploaded products
                  </Text>
                </div>

                <CustomButton
                  variant="white"
                  label="Contact"
                  width="w-fit"
                  fontSize="text-sm"
                  fontWeight="medium"
                  height="h-11"
                  onClick={handleContactClick}
                />
              </div>
            </div>
          </div>

          <CustomButton
            variant="primary"
            label="Confirm"
            leftIcon={<FGReceipt color="white" />}
            onClick={handleCreateOrder}
            loading={isPending}
          />
        </div>
      )}
    </>
  );
};

export { OrderSummaryModal, ORDER_SUMMARY };
