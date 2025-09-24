import { cn } from '@/lib/utils';
import { Sora } from 'next/font/google';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Text } from '@/components/atoms/text';
import { ModalContext } from '@/contexts/ModalContext';
import CustomInput from '@/components/atoms/custom-input';
import CustomButton from '@/components/atoms/custom-button';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { formatNumber } from '@/utils/formatNumber';
import useTruckOrderHook from '@/hooks/useTruckOrder.hook';
import { renderErrors } from '@/utils/renderErrors';
import { TruckOrderFormDto } from '@/types/truck-order.types';
import { truckOrderSchema } from '@/validations/truck-order.validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// import useStateHook from '@/hooks/useState.hook';
import {
  CustomSelect,
  CustomSelectOption,
} from '@/components/atoms/custom-select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDownIcon } from 'lucide-react';
import useDepotHubHook from '@/hooks/useDepotHub.hook';
import { DepotHubDto } from '@/types/depot-hub.types';
import useOrderHook from '@/hooks/useOrder.hook';
import useTransportFareHook from '@/hooks/useTransportFare.hook';
import { useEffect } from 'react';

const sora = Sora({ subsets: ['latin'] });
const LOCK_TRUCK = 'lOCK_TRUCK';

const LockTruckModal = () => {
  const [open, setOpen] = useState(true);
  const { handleClose, openModal } = useContext(ModalContext);
  const { truckId, truckNumber, depotHub, truckSize, truckCategory, truckType, loadStatus, product, state, city } =
    openModal?.data || {};
    console.log(truckId, truckNumber, depotHub, truckSize, truckCategory, truckType, loadStatus, product, state, city, "fff")
  const { useCreateOrder } = useOrderHook();
  const { mutateAsync: createNewOrder, isPending: isLoading } =
    useCreateOrder();

  const {
    setError,
    register,
    formState: { errors },
    setValue,
    handleSubmit,
  } = useForm<TruckOrderFormDto>({
    resolver: yupResolver(truckOrderSchema),
    defaultValues: {
      truckId,
      state,
      city,
    },
  });

  const { useFetchDepotHubs } = useDepotHubHook();
  const { data: depotsRes, isLoading: loadingDepots } = useFetchDepotHubs;

  console.log(depotsRes, 'depotsRes in LockTruckModal');


  // Loadpoints for non-tanker trucks
  const { useFetchLoadPoints } = useTransportFareHook();
  const { data: loadPointsRes, isLoading: loadingLoadPoints } = useFetchLoadPoints();

  // For tanker: use depots from depotHub with type 'tanker'. For others: use loadpoints with state === depotHub
  const depots = useMemo(() => {
    if (truckType === 'tanker') {
      if (depotsRes) {
        const depotOptions = depotsRes?.data?.find(
          (item: DepotHubDto) => item.name === depotHub && item.type === 'tanker',
        );
        return depotOptions?.depots?.map((item: string) => ({
          label: item,
          value: item,
        }));
      }
    } else {
      // For non-tanker, show loadpoints whose state === depotHub
      if (loadPointsRes?.data?.length && depotHub) {
        return loadPointsRes.data
          .filter((lp: any) => lp.state === depotHub)
          .map((lp: any) => ({ label: lp.displayName, value: lp.name }));
      }
    }
    return [];
  }, [depotsRes, loadPointsRes, depotHub, truckType]);

  console.log(depots, 'depots to show in LockTruckModal');

  const [selectedDepot, setSelectedDepot] = useState<CustomSelectOption | undefined>(undefined);
  const [fareRange, setFareRange] = useState<{ min: number; max: number } | null>(null);
  const { useCalculateFare } = useTransportFareHook();
  const { mutateAsync: calculateFare, isPending: isCalculatingFare } = useCalculateFare();


  const handleDepotChange = useCallback((value: unknown) => {
    setSelectedDepot(value as CustomSelectOption);
    setValue('loadingDepot', (value as CustomSelectOption)?.value as string);
  }, [setValue]);

  // Fetch fare when depot is selected
  useEffect(() => {
    const fetchFare = async () => {
      if (!selectedDepot || !truckType || !truckCategory || !truckSize || !state || !city) {
        setFareRange(null);
        return;
      }
      try {
        const result = await calculateFare({
          truckCapacity: parseInt(truckSize),
          truckType,
          truckCategory,
          deliveryState: state,
          deliveryLGA: city,
          loadPoint: selectedDepot.value,
        });
        if (result.statusCode === 200 && result.data) {
          setFareRange({ min: result.data.totalMin, max: result.data.totalMax });
        } else {
          setFareRange(null);
        }
      } catch {
        setFareRange(null);
      }
    };
    fetchFare();
  }, [selectedDepot, truckType, truckCategory, truckSize, state, city, calculateFare]);

  const onSubmit = async (data: any) => {
    try {
      console.log(data, 'data in LockTruckModal onSubmit');
      let loadingDepotValue = data.loadingDepot;
      if (loadingDepotValue === 'lekki_deep_sea') {
        loadingDepotValue = 'Lekki Deep Sea Port';
      } else if (loadingDepotValue === 'tin_can_island') {
        loadingDepotValue = 'Tin Can Island Port';
      }
      await createNewOrder({ ...data, loadingDepot: loadingDepotValue, type: 'truck' });
      window.location.href = `/dashboard/my-rfq/`;
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
          Lock {loadStatus === "loaded" ?  "Volume" : "Truck"}
        </DialogTitle>
      </DialogHeader>
      <div>
        <DialogDescription className="text-dark-gray-400 text-sm mb-5">
          Fill in the details below to lock the {loadStatus === "loaded" ?  "Volume" : "Truck"}
        </DialogDescription>

        <div className="bg-light-gray-150 py-[10px] px-4 rounded-[10px] mb-3">
          <Collapsible
            className="bg-white p-4 rounded-lg"
            open={open}
            onOpenChange={setOpen}
          >
            <CollapsibleTrigger className="relative flex items-center w-full justify-between">
              <Text
                variant="ps"
                color="text-dark-gray-550"
                fontWeight="semibold"
              >
                Request Details
              </Text>

              <Button
                variant="ghost"
                size="icon"
                // className="relative z-[1] before:z-2 before:absolute before:bg-gray-200 before:rounded-lg  before:h-full before:w-full"
              >
                <ChevronDownIcon className="w-4 h-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="flex items-center justify-between gap-2 mb-4">
                <Text variant="ps" color="text-dark-gray-550">
                  Truck number
                </Text>
                <Text variant="ps" color="text-[#151A23]" fontWeight="bold">
                  {truckNumber}
                </Text>
              </div>


              {/* Product only for tanker */}
              {truckType === 'tanker' && product && (
                <div className="flex items-center justify-between gap-2 mb-4">
                  <Text variant="ps" color="text-dark-gray-550">
                    Product
                  </Text>
                  <Text variant="ps" color="text-[#151A23]" fontWeight="medium">
                    {product.name}
                  </Text>
                </div>
              )}


              <div className="flex items-center justify-between gap-2 mb-4">
                <Text variant="ps" color="text-dark-gray-550">
                  {loadStatus === "loaded" ? "Volume" : "Capacity"}
                </Text>
                <Text variant="ps" color="text-[#151A23]" fontWeight="medium">
                  {formatNumber(truckSize)}
                  {truckType ? ` (${truckType})` : ''}
                </Text>
              </div>

              {/* Load Status if present */}
              {loadStatus && truckType === 'tanker' && (
                <div className="flex items-center justify-between gap-2 mb-4">
                  <Text variant="ps" color="text-dark-gray-550">
                    Load Status
                  </Text>
                  <Text variant="ps" color="text-[#151A23]" fontWeight="medium">
                    {loadStatus.charAt(0).toUpperCase() + loadStatus.slice(1)}
                  </Text>
                </div>
              )}

              <div className="flex items-center justify-between gap-2 mb-4">
                <Text variant="ps" color="text-dark-gray-550">
                  Hub
                </Text>
                <Text variant="ps" color="text-[#151A23]" fontWeight="medium">
                  {depotHub}
                </Text>
              </div>

              <hr className="my-4" />
              <Text
                variant="ps"
                color="text-dark-gray-550"
                fontWeight="semibold"
                classNames="mb-4"
              >
                Destination
              </Text>

              <div className="flex items-center justify-between gap-2 mb-4">
                <Text variant="ps" color="text-dark-gray-550">
                  State
                </Text>
                <Text variant="ps" color="text-[#151A23]" fontWeight="medium">
                  {state}
                </Text>
              </div>

              <div className="flex items-center justify-between gap-2">
                <Text variant="ps" color="text-dark-gray-550">
                  City
                </Text>
                <Text variant="ps" color="text-[#151A23]" fontWeight="medium">
                  {city}
                </Text>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Transport Fare Estimate Badge/Section */}
        {selectedDepot && fareRange && (
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

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grow grid grid-cols-1 gap-2 bg-light-gray-150 py-[10px] px-4 rounded-[10px] mb-4">
            {/* Cargo Details for non-tanker trucks */}
            {truckType !== 'tanker' && (
              <>
                <CustomInput
                  type="text"
                  name="cargoType"
                  register={register}
                  error={errors.cargoType?.message}
                  label="Goods/Materials Type"
                  placeholder="e.g. Steel pipes, Machinery"
                  classNames="mb-2"
                />
                <CustomInput
                  type="text"
                  name="cargoWeight"
                  register={register}
                  error={errors.cargoWeight?.message}
                  label="Cargo Weight/Volume"
                  placeholder="e.g. 10 tonnes, 20 pallets"
                  classNames="mb-2"
                />
                <CustomSelect
                  label="Cargo Type"
                  name="cargoCategory"
                  options={[
                    { label: 'Standard (uniform)', value: 'standard' },
                    { label: 'Oversized (special permits)', value: 'oversized' },
                    { label: 'Hazardous', value: 'hazardous' },
                    { label: 'Other', value: 'other' },
                  ]}
                  value={undefined}
                  onChange={(val: unknown) => setValue('cargoCategory', (val as CustomSelectOption | undefined)?.value)}
                  error={errors.cargoCategory?.message}
                  classNames="mb-2"
                />
                <CustomSelect
                  label="Special Handling"
                  name="specialHandling"
                  options={[
                    { label: 'Cranes', value: 'cranes' },
                    { label: 'Tarpaulin', value: 'tarpaulin' },
                    { label: 'Customs clearance', value: 'customs' },
                    { label: 'Escorts', value: 'escorts' },
                    { label: 'Other', value: 'other' },
                  ]}
                  // isMulti
                  value={undefined}
                  onChange={(val) => setValue('specialHandling', Array.isArray(val) ? val.map((v: any) => v.value) : undefined)}
                  error={errors.specialHandling?.message}
                  classNames="mb-2"
                />
                <CustomInput
                  type="text"
                  name="notes"
                  register={register}
                  error={errors.notes?.message}
                  label="Additional Notes (optional)"
                  placeholder="Any extra info for the transporter"
                  classNames="mb-2"
                />
                <hr className="my-2" />
              </>
            )}
            <CustomSelect
              label={truckType === 'tanker' ? 'Load Depot' : 'Load Port'}
              name="loadingDepot"
              options={depots}
              value={selectedDepot}
              isDisabled={truckType === 'tanker' ? loadingDepots : loadingLoadPoints}
              onChange={handleDepotChange}
              error={errors.loadingDepot?.message}
            />
          </div>

          <div className="bg-light-gray-150 py-[10px] px-4 rounded-[10px] mb-8">
            <CustomInput
              type="text"
              name="destination"
              register={register}
              error={errors.destination?.message}
              label="Enter Destination Address"
              classNames="mb-4"
            />
            <CustomInput
              type="date"
              name="loadingDate"
              register={register}
              error={errors.loadingDate?.message}
              label="Enter Loading Date (minimum of 24hrs notice time)"
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
              type="submit"
              variant="primary"
              loading={isLoading}
              label="Request For Quote"
            />
          </div>
        </form>
      </div>
    </>
  );
};

export { LockTruckModal, LOCK_TRUCK };
