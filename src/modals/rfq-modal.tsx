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
// import useTruckOrderHook from '@/hooks/useTruckOrder.hook';
import CustomLoader from '@/components/atoms/custom-loader';
import { TruckOrderDto } from '@/types/truck-order.types';
import { renderErrors } from '@/utils/renderErrors';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateTruckOrderPriceSchema } from '@/validations/truck-order.validation';
import { formatDate } from '@/utils/formatDate';
import useOrderHook from '@/hooks/useOrder.hook';
import useTransportFareHook from '@/hooks/useTransportFare.hook';
import { useEffect, useState, useMemo } from 'react';
import { formatNumber } from '@/utils/formatNumber';

const sora = Sora({ subsets: ['latin'] });
const TRUCK_RFQ = 'truck_rfq';

const RFQModal = () => {
  const { handleClose, openModal } = useContext(ModalContext);
  // const {
  //   useGetTruckOrderDetails,
  //   useUpdateTruckOrderPrice,
  //   useUpdateTruckOrderRFQStatus,
  // } = useTruckOrderHook();

  const { useUpdateOrder, useGetOrderDetails } = useOrderHook();

  // const { data, isLoading } = useGetTruckOrderDetails(
  //   openModal?.data.truckOrderId,
  // );

  const { data: orderData, isLoading } = useGetOrderDetails(
    openModal?.data.truckOrderId,
  );

  // Transport fare calculation state
  const [fareRange, setFareRange] = useState<{ min: number; max: number } | null>(null);
  const { useCalculateFare } = useTransportFareHook();
  const { mutateAsync: calculateFare } = useCalculateFare();
  const [fareLoading, setFareLoading] = useState(false);

  // Price per litre (for tanker, loaded)
  const [pricePerLitre, setPricePerLitre] = useState('');

  // Amount entered by user (from form)
  const [amount, setAmount] = useState('');
  // Arrival time entered by user (from form)
  const [arrivalTime, setArrivalTime] = useState('');

  // Calculate total (amount x capacity + enteredFare)
  const truckCapacity = useMemo(() => {
    const cap = orderData?.data?.truckId?.capacity;
    return cap ? parseFloat(cap) : 0;
  }, [orderData]);

  const showPricePerLitre = orderData?.data?.truckId?.truckType === 'tanker' && orderData?.data?.truckId?.loadStatus === 'loaded';

  const total = useMemo(() => {
    // For loaded tankers, total = pricePerLitre * capacity + amount (fare)
    if (showPricePerLitre && pricePerLitre && amount) {
      const pL = parseFloat(pricePerLitre) || 0;
      const fare = parseFloat(amount) || 0;
      return (pL * truckCapacity) + fare;
    }
    // For others, total = amount (fare)
    if (amount) {
      return parseFloat(amount) || 0;
    }
    return '';
  }, [showPricePerLitre, pricePerLitre, amount, truckCapacity]);

  // Fetch fare estimate on open
  useEffect(() => {
    const fetchFare = async () => {
      if (!orderData?.data?.truckId) return;
      const truck = orderData.data.truckId;
      if (!truck.truckType || !truck.truckCategory || !truck.capacity || !orderData.data.state || !orderData.data.city || !orderData.data.loadingDepot) return;
      setFareLoading(true);
      try {
        const result = await calculateFare({
          truckCapacity: parseInt(truck.capacity),
          truckType: truck.truckType,
          truckCategory: truck.truckCategory,
          deliveryState: orderData.data.state,
          deliveryLGA: orderData.data.city,
          loadPoint: orderData.data.loadingDepot,
        });
        if (result.statusCode === 200 && result.data) {
          setFareRange({ min: result.data.totalMin, max: result.data.totalMax });
        } else {
          setFareRange(null);
        }
      } catch {
        setFareRange(null);
      } finally {
        setFareLoading(false);
      }
    };
    fetchFare();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderData?.data?.truckId]);

  // console.log(orderData, "orderData in RFQModal");
  // const { mutateAsync: updatePrice, isPending: updatingPrice } =
  //   useUpdateTruckOrderPrice(openModal?.data.truckOrderId);

  const { mutateAsync: updateOrder, isPending: updatingOrder } = useUpdateOrder(
    openModal?.data.truckOrderId,
  );

  // const { mutateAsync: updateRFQStatus, isPending: isUpdatingStatus } =
  //   useUpdateTruckOrderRFQStatus(openModal?.data.truckOrderId);

  const {
    setError,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<Pick<TruckOrderDto, 'price' | 'arrivalTime'>>({
    resolver: yupResolver(updateTruckOrderPriceSchema),
    defaultValues: {
      ...(openModal?.data || {}),
      price: orderData?.data?.price,
      arrivalTime: orderData?.data?.arrivalTime,
    },
  });

  console.log(orderData, "data in quote sending")


  const onSubmit = async () => {
    try {
      // Compose the payload
      const credentials: any = {
        price: total,
        arrivalTime,
        description: 'sending_rfq',
        type: 'truck',
        rfqStatus: 'sent',
      };
      if (showPricePerLitre) credentials.pricePerLitre = pricePerLitre;
      await updateOrder(credentials);
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
                    {orderData?.data?.truckId?.truckNumber}
                  </Text>
                </div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <Text variant="ps" color="text-dark-gray-550">
                  Product
                  </Text>
                  <Text
                    variant="ps"
                    color="text-[#151A23]"
                    fontWeight="bold"
                    classNames="text-right"
                  >
                    {orderData?.data?.truckId?.productId?.name}
                  </Text>
                </div>
                 <div className="flex items-center justify-between gap-2 mb-4">
                  <Text variant="ps" color="text-dark-gray-550">
                  Capacity
                  </Text>
                  <Text
                    variant="ps"
                    color="text-[#151A23]"
                    fontWeight="bold"
                    classNames="text-right"
                  >
                    {orderData?.data?.truckId?.capacity} {orderData?.data?.truckId?.truckType === 'tanker' ? 'Ltrs' : 'Tons'}
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
                    {orderData?.data?.loadingDepot},{' '}
                    {orderData?.data?.truckId?.depotHubId?.name}
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
                    {orderData?.data?.destination}, {orderData?.data?.city},{' '}
                    {orderData?.data?.state}
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
                    {formatDate(orderData?.data?.loadingDate)}
                  </Text>
                </div>
              </div>
            </div>

            <form onSubmit={e => { e.preventDefault(); onSubmit(); }}>
              {/* Transport Fare Estimate Badge */}
              {fareLoading ? (
                <div className="flex justify-center mb-4"><CustomLoader /></div>
              ) : fareRange && (
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-br from-green-100 to-green-200 border border-green-300 rounded-xl px-6 py-3 shadow-md flex flex-col items-center max-w-xs w-full">
                    <Text variant="ps" color="text-green-700" fontWeight="bold" classNames="mb-1">
                      Estimated Transport Fare
                    </Text>
                    <div className="text-xl font-bold text-green-800">
                      ₦{formatNumber(fareRange.min)}{' '} - ₦{formatNumber(fareRange.max)}
                    </div>
                    <Text variant="pxs" color="text-green-600" classNames="mt-1">
                      (Guideline only, actual quote may vary)
                    </Text>
                  </div>
                </div>
              )}
              <div className="bg-light-gray-150 py-[10px] px-4 rounded-[10px] mb-8">
                {/* Amount field (fare) */}
                <CustomInput
                  type="number"
                  name="amount"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  label={showPricePerLitre ? 'Enter Transport Fare' : 'Enter Amount (Fare)'}
                  prefix="₦"
                  prefixPadding="pl-10"
                  classNames="mb-4"
                />
                {/* Price per litre field (for tanker, loaded) */}
                {showPricePerLitre && (
                  <CustomInput
                    type="number"
                    name="pricePerLitre"
                    value={pricePerLitre}
                    onChange={e => setPricePerLitre(e.target.value)}
                    label="Price Per Litre"
                    prefix="₦"
                    prefixPadding="pl-10"
                    classNames="mb-4"
                  />
                )}
                {/* Arrival time */}
                <CustomInput
                  type="datetime-local"
                  name="arrivalTime"
                  value={arrivalTime}
                  onChange={e => setArrivalTime(e.target.value)}
                  label="Enter estimated time of arrival"
                />
              </div>
              {/* Total summary */}
              {(showPricePerLitre ? (pricePerLitre && amount) : amount) && (
                <div className="flex justify-center mb-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl px-6 py-3 shadow flex flex-col items-center max-w-xs w-full">
                    <Text variant="ps" color="text-blue-700" fontWeight="bold" classNames="mb-2">
                      Quote Breakdown
                    </Text>
                    {showPricePerLitre ? (
                      <>
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-sm text-blue-900 font-medium">Price Per Litre × Capacity</span>
                          <span className="text-sm text-blue-900 font-semibold">₦{formatNumber((parseFloat(pricePerLitre) || 0) * truckCapacity)}</span>
                        </div>
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-sm text-blue-900 font-medium">Transport Fare</span>
                          <span className="text-sm text-blue-900 font-semibold">₦{formatNumber(amount)}</span>
                        </div>
                        <div className="border-t border-blue-200 w-full my-2"></div>
                        <div className="flex items-center justify-between w-full">
                          <span className="text-base font-bold text-blue-700">Total Quote</span>
                          <span className="text-xl font-bold text-blue-800">₦{formatNumber(total)}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center justify-between w-full mb-1">
                          <span className="text-sm text-blue-900 font-medium">Transport Fare</span>
                          <span className="text-sm text-blue-900 font-semibold">₦{formatNumber(amount)}</span>
                        </div>
                        <div className="border-t border-blue-200 w-full my-2"></div>
                        <div className="flex items-center justify-between w-full">
                          <span className="text-base font-bold text-blue-700">Total Quote</span>
                          <span className="text-xl font-bold text-blue-800">₦{formatNumber(total)}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
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
                  loading={updatingOrder}
                  disabled={!(arrivalTime && (showPricePerLitre ? (pricePerLitre && amount) : amount))}
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
