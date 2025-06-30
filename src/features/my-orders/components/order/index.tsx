'use client';
import CustomButton from '@/components/atoms/custom-button';
import { Text } from '@/components/atoms/text';
import { FGEye } from '@fg-icons';
import Image from 'next/image';
import React from 'react';
import OrderImg from '@assets/images/OrderImg.svg';
import { Heading } from '@/components/atoms/heading';
import { useRouter } from 'next/navigation';
import { TICKET } from '@/routes';
import { OrderDto } from '@/types/order.types';
import { ProductUploadDto } from '@/types/product-upload.types';
import { ProductDto } from '@/types/product.types';
import { cn } from '@/lib/utils';
import { SellerDto } from '@/features/authentication/types/onboarding.types';
import { timeDiffDay } from '@/utils/formatDate';
import { StatusText } from '@/features/transporter-dashboard/components/truck-order-list/status-text';
import CheckCircleIcon from '@/components/icons/CheckCircleIcon';
import NumberHandler from '@/components/atoms/number-hander';
import ClickableUserName from '@/components/atoms/clickable-user-name';
import RateButton from '@/components/atoms/rate-button';

// TODO: create a story and props for this
const Order: React.FC<{ order: OrderDto }> = ({ order }) => {
  const router = useRouter();
  const gotoTicket = () => router.push(`${TICKET}/${order._id}`);
  return (
    <div className="relative bg-white flex flex-wrap gap-1 items-center justify-between border border-mid-gray-550 p-4 pr-8 rounded-[10px]">
      <div className="flex flex-wrap items-center gap-4">
        <Image src={OrderImg} alt="Order image" width={80} height={80} />
        <div>
          <Text
            variant="pl"
            color="text-deep-gray-300"
            fontWeight="semibold"
            classNames="flex flex-wrap items-center gap-2 mb-1"
          >
            <span
              className={cn(
                'inline-flex items-center justify-center w-[43px] h-[17px] text-white rounded-[2px] uppercase font-medium text-xs',
                (
                  (order?.productUploadId as ProductUploadDto)
                    ?.productId as ProductDto
                )?.color,
              )}
            >
              {
                (
                  (order?.productUploadId as ProductUploadDto)
                    ?.productId as ProductDto
                )?.value
              }
            </span>
            {
              (
                (order?.productUploadId as ProductUploadDto)
                  ?.productId as ProductDto
              )?.name
            }
            {order.status === 'completed' && (
              <CheckCircleIcon color="#0F973D" height={16} width={16} />
            )}
          </Text>{' '}
          <Text
            variant="ps"
            color="text-dark-gray-50"
            fontWeight="regular"
            classNames="mb-1"
          >
            Volume - <NumberHandler number={order.volume} suffix="Ltrs" /> |
            Seller:{' '}
            <ClickableUserName
              user={{
                _id: ((order?.sellerId as SellerDto)?.userId as any)?._id || '',
                firstName:
                  ((order?.sellerId as SellerDto)?.userId as any)?.firstName ||
                  '',
                lastName:
                  ((order?.sellerId as SellerDto)?.userId as any)?.lastName ||
                  '',
                email: ((order?.sellerId as SellerDto)?.userId as any)?.email,
                businessName: (order?.sellerId as SellerDto)?.businessName,
                role: 'seller',
              }}
              variant="ps"
              fontWeight="medium"
              color="text-blue-600"
            />
          </Text>
          <Heading variant="h6" fontWeight="semibold">
            <NumberHandler number={order.volume * order.price} prefix="₦" />
          </Heading>
        </div>
      </div>
      <div>
        <Text
          variant="ps"
          color="text-dark-gray-50"
          classNames="mb-3 md:text-right"
        >
          {timeDiffDay(order.createdAt as Date)}
        </Text>{' '}
        {order.status === 'in-progress' || order.status === 'completed' ? (
          <div className="flex items-center gap-2">
            <CustomButton
              variant="primary"
              onClick={gotoTicket}
              height="h-11"
              label="See Ticket"
              leftIcon={<FGEye color="white" />}
              fontSize="text-sm"
              fontWeight="medium"
            />
            {order.status === 'completed' && (
              <RateButton
                orderId={order._id}
                orderType="order"
                orderStatus={order.status}
                ratedUser={{
                  _id:
                    ((order?.sellerId as SellerDto)?.userId as any)?._id || '',
                  firstName:
                    ((order?.sellerId as SellerDto)?.userId as any)
                      ?.firstName || '',
                  lastName:
                    ((order?.sellerId as SellerDto)?.userId as any)?.lastName ||
                    '',
                  email: ((order?.sellerId as SellerDto)?.userId as any)?.email,
                }}
                size="md"
                variant="outline"
              />
            )}
          </div>
        ) : (
          <div className="flex items-center justify-end">
            <StatusText status={order.status} />
          </div>
        )}
      </div>
    </div>
  );
};

export { Order };
