import React, { useCallback, useContext, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Sora } from 'next/font/google';
import { Text } from '@/components/atoms/text';
import { ModalContext } from '@/contexts/ModalContext';
import CustomButton from '@/components/atoms/custom-button';
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  CustomSelect,
  CustomSelectOption,
} from '@/components/atoms/custom-select';
import useDepotHubHook from '@/hooks/useDepotHub.hook';
import { DepotHubDto } from '@/types/depot-hub.types';
import { TruckDto } from '@/features/transporter-dashboard/types/truck.type';
import useTruckHook from '@/features/transporter-dashboard/hooks/useTruck.hook';
import useToastConfig from '@/hooks/useToastConfig.hook';

const sora = Sora({ subsets: ['latin'] });
export const UPDATE_TRUCK_STATUS = 'UPDATE_TRUCK_STATUS';

// Form validation schema
const updateTruckStatusSchema = yup.object().shape({
  depot: yup.string().required('Depot is required'),
  depotHubId: yup.string().required('Hub is required'),
});

type UpdateTruckStatusFormDto = {
  depot: string;
  depotHubId: string;
};

const UpdateTruckStatusModal = () => {
  const { handleClose, openModal } = useContext(ModalContext);
  const { showToast } = useToastConfig();
  const truck = openModal?.data?.truck as TruckDto;
  const newStatus = openModal?.data?.newStatus as 'available' | 'locked';

  // Current status is available and we're trying to lock it
  const isLockingTruck =
    truck?.status === 'available' && newStatus === 'locked';

  // Only show the update location option when unlocking a truck
  const [updateLocation, setUpdateLocation] = useState(false);

  const { useUpdateTruck } = useTruckHook();
  const { mutateAsync: updateTruckAsync, isPending: isUpdating } =
    useUpdateTruck(truck?._id || '');

  const { useFetchDepotHubs } = useDepotHubHook();
  const { data: depotsRes, isLoading: loadingDepots } = useFetchDepotHubs;

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateTruckStatusFormDto>({
    resolver: yupResolver(updateTruckStatusSchema),
    defaultValues: {
      depot: truck?.depot || '',
      depotHubId:
        typeof truck?.depotHubId === 'object'
          ? truck?.depotHubId?._id
          : truck?.depotHubId || '',
    },
  });

  // Get available hubs
  const hubs = useMemo(() => {
    if (depotsRes) {
      return depotsRes?.data?.map((item: DepotHubDto) => ({
        label: item.name,
        value: item._id,
      }));
    }
    return [];
  }, [depotsRes]);

  // Get depots for selected hub
  const [selectedHub, setSelectedHub] = useState<
    CustomSelectOption | undefined
  >(
    typeof truck?.depotHubId === 'object' && truck?.depotHubId?._id
      ? { label: truck.depotHubId.name, value: truck.depotHubId._id }
      : undefined,
  );

  const [selectedDepot, setSelectedDepot] = useState<
    CustomSelectOption | undefined
  >(truck?.depot ? { label: truck.depot, value: truck.depot } : undefined);

  const depots = useMemo(() => {
    if (depotsRes && selectedHub) {
      const hubData = depotsRes?.data?.find(
        (item: DepotHubDto) => item._id === selectedHub.value,
      );

      return (
        hubData?.depots?.map((depot: string) => ({
          label: depot,
          value: depot,
        })) || []
      );
    }
    return [];
  }, [depotsRes, selectedHub]);

  const handleHubChange = useCallback(
    (value: unknown) => {
      const hubOption = value as CustomSelectOption;
      setSelectedHub(hubOption);
      setValue('depotHubId', hubOption?.value as string);
      // Reset depot when hub changes
      setSelectedDepot(undefined);
      setValue('depot', '');
    },
    [setValue],
  );

  const handleDepotChange = useCallback(
    (value: unknown) => {
      const depotOption = value as CustomSelectOption;
      setSelectedDepot(depotOption);
      setValue('depot', depotOption?.value as string);
    },
    [setValue],
  );

  const onSubmit = async (data: UpdateTruckStatusFormDto) => {
    try {
      const credentials = {
        profileType: truck?.profileType,
        profileId: truck?.profileId?._id,
        depot: updateLocation ? data.depot : truck?.depot,
        depotHubId: updateLocation
          ? data.depotHubId
          : typeof truck?.depotHubId === 'object'
          ? truck?.depotHubId?._id
          : truck?.depotHubId,
        status: isLockingTruck ? 'locked' : 'pending', // If locking, set directly to locked; if unlocking, set to pending
        productId: truck?.productId?._id,
        capacity: truck?.capacity,
        truckNumber: truck?.truckNumber,
      };

      await updateTruckAsync(credentials as any);

      showToast(
        isLockingTruck
          ? 'Truck locked successfully'
          : `Truck status updated to pending${
              updateLocation ? ' with new location' : ''
            }`,
        'success',
      );

      handleClose && handleClose();
    } catch (error: any) {
      showToast(error?.message || 'Failed to update truck status', 'error');
    }
  };

  const handleCancel = () => {
    handleClose && handleClose();
  };

  const statusText = newStatus === 'available' ? 'lock' : 'unlock';
  const currentStatusText =
    truck?.status === 'available'
      ? 'Available'
      : truck?.status === 'locked'
      ? 'Locked'
      : 'Pending';

  return (
    <>
      <DialogHeader>
        <DialogTitle
          className={cn(
            'leading-5 text-blue-tone-200 font-semibold text-2xl',
            sora.className,
          )}
        >
          {isLockingTruck ? 'Lock Truck' : 'Update Truck Status'}
        </DialogTitle>
      </DialogHeader>

      <div>
        {isLockingTruck ? (
          /* Simple confirmation UI for locking a truck */
          <>
            <DialogDescription className="text-dark-gray-400 text-sm mb-5">
              You are about to lock truck <strong>{truck?.truckNumber}</strong>.
              Are you sure you want to continue?
            </DialogDescription>

            <div className="bg-light-gray-150 py-3 px-4 rounded-lg mb-6">
              <div className="flex items-center justify-between mb-2">
                <Text variant="ps" color="text-dark-gray-550">
                  Current Status
                </Text>
                <Text variant="ps" color="text-green-600" fontWeight="semibold">
                  Available
                </Text>
              </div>

              <div className="flex items-center justify-between">
                <Text variant="ps" color="text-dark-gray-550">
                  New Status
                </Text>
                <Text variant="ps" color="text-red-600" fontWeight="semibold">
                  Locked
                </Text>
              </div>
            </div>
          </>
        ) : (
          /* Complex UI with location update options for unlocking */
          <>
            <DialogDescription className="text-dark-gray-400 text-sm mb-5">
              You are about to unlock truck{' '}
              <strong>{truck?.truckNumber}</strong>. This will set the status to
              &quot;pending&quot; while the change is processed.
            </DialogDescription>

            <div className="bg-light-gray-150 py-3 px-4 rounded-lg mb-6">
              <div className="flex items-center justify-between mb-2">
                <Text variant="ps" color="text-dark-gray-550">
                  Current Status
                </Text>
                <Text variant="ps" color="text-red-600" fontWeight="semibold">
                  Locked
                </Text>
              </div>

              <div className="flex items-center justify-between">
                <Text variant="ps" color="text-dark-gray-550">
                  New Status
                </Text>
                <Text
                  variant="ps"
                  color="text-orange-600"
                  fontWeight="semibold"
                >
                  Pending
                </Text>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <input
                  type="checkbox"
                  id="updateLocation"
                  checked={updateLocation}
                  onChange={(e) => setUpdateLocation(e.target.checked)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="updateLocation"
                  className="text-sm text-gray-700"
                >
                  Update hub and depot location
                </label>
              </div>

              {updateLocation && (
                <div className="space-y-4 pl-7">
                  <div>
                    <Text
                      variant="ps"
                      color="text-dark-gray-550"
                      classNames="mb-2 block"
                    >
                      Select Hub
                    </Text>
                    <CustomSelect
                      name="hub"
                      options={hubs}
                      value={selectedHub}
                      onChange={handleHubChange}
                      label="Select hub..."
                      isDisabled={loadingDepots}
                      error={errors?.depotHubId && errors.depotHubId.message}
                    />
                  </div>

                  <div>
                    <Text
                      variant="ps"
                      color="text-dark-gray-550"
                      classNames="mb-2 block"
                    >
                      Select Depot
                    </Text>
                    <CustomSelect
                      name="depot"
                      options={depots}
                      value={selectedDepot}
                      onChange={handleDepotChange}
                      label="Select depot..."
                      isDisabled={!selectedHub}
                    />
                    {errors.depot && (
                      <Text
                        variant="pxs"
                        color="text-red-500"
                        classNames="mt-1"
                      >
                        {errors.depot.message}
                      </Text>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        <div className="flex gap-3 justify-end">
          <CustomButton
            variant="outline"
            onClick={handleCancel}
            disabled={isUpdating}
            label="Cancel"
            fontSize="text-sm"
            classNames="rounded-lg gap-1 px-4 py-[10px] relative z-[1] before:z-0 before:absolute before:bg-black/20 before:rounded-lg before:h-full before:w-full"
            height="h-11"
            width="w-fit"
          />

          <CustomButton
            onClick={() => handleSubmit(onSubmit)()}
            variant={isLockingTruck ? 'danger' : 'primary'}
            disabled={isUpdating}
            label={isLockingTruck ? 'Lock Truck' : 'Update Status'}
            fontSize="text-sm"
            classNames="rounded-lg gap-1 px-4 py-[10px] relative z-[1] before:z-0 before:absolute before:bg-black/20 before:rounded-lg before:h-full before:w-full"
            height="h-11"
            width="w-fit"
          />
        </div>
      </div>
    </>
  );
};

export default UpdateTruckStatusModal;
