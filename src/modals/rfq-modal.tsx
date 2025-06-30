import { cn } from '@/lib/utils';
import { Sora } from 'next/font/google';
import React, { useContext } from 'react';
import { Text } from '@/components/atoms/text';
import { ModalContext } from '@/contexts/ModalContext';
import CustomInput from '@/components/atoms/custom-input';
import CustomButton from '@/components/atoms/custom-button';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import useTruckOrderHook from '@/hooks/useTruckOrder.hook';
import CustomLoader from '@/components/atoms/custom-loader';
import { TruckOrderDto } from '@/types/truck-order.types';
import { renderErrors } from '@/utils/renderErrors';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateTruckOrderPriceSchema } from '@/validations/truck-order.validation';
import { formatDate } from '@/utils/formatDate';

const sora = Sora({ subsets: ['latin'] });
const TRUCK_RFQ = 'truck_rfq';

const RFQModal = () => {
  const { handleClose, openModal } = useContext(ModalContext);
  const {
    useGetTruckOrderDetails,
    useUpdateTruckOrderPrice,
    useUpdateTruckOrderRFQStatus,
  } = useTruckOrderHook();

  const { data, isLoading } = useGetTruckOrderDetails(
    openModal?.data.truckOrderId,
  );
  const { mutateAsync: updatePrice, isPending: updatingPrice } =
    useUpdateTruckOrderPrice(openModal?.data.truckOrderId);

    const { mutateAsync: updateRFQStatus, isPending: isUpdatingStatus } =
      useUpdateTruckOrderRFQStatus(openModal?.data.truckOrderId);

  const {
    setError,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Pick<TruckOrderDto, 'price' | 'arrivalTime'>>({
    resolver: yupResolver(updateTruckOrderPriceSchema),
    defaultValues: {
      ...(openModal?.data || {}),
      price: data?.data?.price,
      arrivalTime: data?.data?.arrivalTime,
    },
  });



  const onSubmit = async (data: Pick<TruckOrderDto, 'price'>) => {
    try {
      await updatePrice(data);
      await updateRFQStatus({
        rfqStatus: 'sent',
      });
    } catch (error: any) {
      renderErrors(error?.errors, setError);
    }
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
          Truck Quote
        </DialogTitle>
      </DialogHeader>
      <div>
        <DialogDescription className="text-dark-gray-400 text-sm mb-5">
          Enter billing for this truck request
        </DialogDescription>

        {isLoading ? (
          <CustomLoader />
        ) : (
          <>
            <div className="bg-light-gray-150 py-[10px] px-4 rounded-[10px] mb-3">
              <div className="bg-white p-4 rounded-lg">
                <Text
                  variant="ps"
                  color="text-dark-gray-550"
                  fontWeight="semibold"
                  classNames="mb-4"
                >
                  Request Details
                </Text>

                <div className="flex items-center justify-between gap-2 mb-4">
                  <Text variant="ps" color="text-dark-gray-550">
                    Truck number
                  </Text>
                  <Text
                    variant="ps"
                    color="text-[#151A23]"
                    fontWeight="bold"
                    classNames="text-right"
                  >
                    {data.data.truckId.truckNumber}
                  </Text>
                </div>

                <div className="flex items-center justify-between gap-2 mb-4">
                  <Text variant="ps" color="text-dark-gray-550">
                    Loading Depot
                  </Text>
                  <Text
                    variant="ps"
                    color="text-[#151A23]"
                    fontWeight="medium"
                    classNames="text-right"
                  >
                    {data.data.loadingDepot},{' '}
                    {data.data.truckId.depotHubId.name}
                  </Text>
                </div>

                <div className="flex items-center justify-between gap-2 mb-4">
                  <Text variant="ps" color="text-dark-gray-550">
                    Destination
                  </Text>
                  <Text
                    variant="ps"
                    color="text-[#151A23]"
                    fontWeight="medium"
                    classNames="text-right"
                  >
                    {data.data.destination}, {data.data.city}, {data.data.state}
                  </Text>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <Text variant="ps" color="text-dark-gray-550">
                    Loading Date
                  </Text>
                  <Text
                    variant="ps"
                    color="text-[#151A23]"
                    fontWeight="medium"
                    classNames="text-right"
                  >
                    {formatDate(data.data.loadingDate)}
                  </Text>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="bg-light-gray-150 py-[10px] px-4 rounded-[10px] mb-8">
                <CustomInput
                  type="number"
                  name="price"
                  register={register}
                  error={errors.price?.message}
                  value={data?.data?.price}
                  label="Enter amount"
                  prefix="₦"
                  prefixPadding="pl-10"
                  classNames="mb-4"
                />
                <CustomInput
                  type="datetime-local"
                  name="arrivalTime"
                  register={register}
                  error={errors.arrivalTime?.message}
                  label="Enter estimated time of arrival"
                />
              </div>

              <div className="flex items-center gap-2">
                <CustomButton
                  variant="white"
                  label="Close"
                  onClick={handleClose}
                  border="border-black border"
                />
                <CustomButton
                  variant="primary"
                  label="Send Quote"
                  type="submit"
                  loading={updatingPrice}
                />
              </div>
            </form>
          </>
        )}
      </div>
    </>
  );
};

export { RFQModal, TRUCK_RFQ };
