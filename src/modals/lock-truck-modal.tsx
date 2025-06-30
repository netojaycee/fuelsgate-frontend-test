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

const sora = Sora({ subsets: ['latin'] });
const LOCK_TRUCK = 'lOCK_TRUCK';

const LockTruckModal = () => {
  const [open, setOpen] = useState(true);
  const { handleClose, openModal } = useContext(ModalContext);
  const { truckId, truckNumber, depotHub, truckSize, product, state, city } =
    openModal?.data;
  const { useCreateTruckOrder } = useTruckOrderHook();
  const { mutateAsync: createNewOrder, isPending: isLoading } =
    useCreateTruckOrder();

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

  const depots = useMemo(() => {
    if (depotsRes) {
      const depotOptions = depotsRes?.data?.find(
        (item: DepotHubDto) => item.name === depotHub,
      );

      return depotOptions?.depots?.map((item: string) => ({
        label: item,
        value: item,
      }));
    }
  }, [depotsRes, depotHub]);

  const [selectedDepot, setSelectedDepot] = useState<
    CustomSelectOption | undefined
  >(undefined);

  const handleDepotChange = useCallback((value: unknown) => {
    setSelectedDepot(value as CustomSelectOption);
    setValue('loadingDepot', (value as CustomSelectOption)?.value as string);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data: TruckOrderFormDto) => {
    try {
      await createNewOrder(data);
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
          Lock Truck
        </DialogTitle>
      </DialogHeader>
      <div>
        <DialogDescription className="text-dark-gray-400 text-sm mb-5">
          Fill in the details below to lock the truck
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
                className="relative z-[1] before:z-0 before:absolute before:bg-gray-200 before:rounded-lg before:animate-ping before:h-full before:w-full"
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

              <div className="flex items-center justify-between gap-2 mb-4">
                <Text variant="ps" color="text-dark-gray-550">
                  Product
                </Text>
                <Text variant="ps" color="text-[#151A23]" fontWeight="medium">
                  {product.name}
                </Text>
              </div>

              <div className="flex items-center justify-between gap-2 mb-4">
                <Text variant="ps" color="text-dark-gray-550">
                  Truck Size
                </Text>
                <Text variant="ps" color="text-[#151A23]" fontWeight="medium">
                  {formatNumber(truckSize)}
                </Text>
              </div>

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

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grow grid grid-cols-1 gap-2 bg-light-gray-150 py-[10px] px-4 rounded-[10px] mb-4">
            <CustomSelect
              label="Loading Depot"
              name="loadingDepot"
              options={depots}
              value={selectedDepot}
              isDisabled={loadingDepots}
              onChange={handleDepotChange}
              error={errors.loadingDepot?.message}
            />

            {/* 
              <CustomSelect
                label="Loading City"
                name="loadingCity"
                options={lgas}
                isDisabled={loadingLGA}
                value={selectedLGA}
                onChange={handleLGAChange}
                error={errors.loadingCity?.message}
              />

              <CustomInput
                type="text"
                name="loadingAddress"
                register={register}
                error={errors.loadingAddress?.message}
                label="Enter Loading Address"
                classNames="mb-4 col-span-2"
              /> 
            */}
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
              label="Enter Loading Date"
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
