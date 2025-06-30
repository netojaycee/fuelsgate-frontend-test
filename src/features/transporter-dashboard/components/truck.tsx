import { Text } from '@/components/atoms/text';
import { ModalContext } from '@/contexts/ModalContext';
import { AuthContext } from '@/contexts/AuthContext';
import { FGTruckFill } from '@fg-icons';
import React, { useContext } from 'react';
import { TRACK_TRUCK } from '@/modals/track-truck-modal';
import { TruckDto } from '../types/truck.type';
import { formatNumber } from '@/utils/formatNumber';
import { LIST_TRUCK } from '@/modals/list-truck-modal';
import useTruckHook from '../hooks/useTruck.hook';
import { useConfirmation } from '@/hooks/useConfirmation.hook';
import { Edit, Trash } from 'lucide-react';

type TruckProps = {
  data: TruckDto;
};
const Truck: React.FC<TruckProps> = ({ data }) => {
  const { handleToggle } = useContext(ModalContext);
  const { useDeleteTruck } = useTruckHook();
  const { mutateAsync: deleteTruckAsync } = useDeleteTruck();
  const { showConfirmation } = useConfirmation();

  // const handleTrackTruckModal = () =>
  //   handleToggle &&
  //   handleToggle({
  //     state: true,
  //     name: TRACK_TRUCK,
  //     data: { truckOrderId: data.truckOrderId },
  //   });
  const handleEditTruckModal = () =>
    handleToggle &&
    handleToggle({
      name: LIST_TRUCK,
      state: true,
      data: { edit: true, truck: data },
    });
  const handleDeleteTruck = () => {
    showConfirmation({
      title: 'Delete Truck',
      message: `Are you sure you want to delete truck "${data?.truckNumber}"? This action cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: async () => {
        if (data?._id) {
          await deleteTruckAsync(data._id);
        }
      },
    });
  };

  return (
    <div className="relative p-4 border border-green-tone-200 bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 min-w-[280px] max-w-[320px] h-[180px] flex flex-col group">
      {/* Floating Status Badge - Top Right */}
      <div className="absolute -top-2 -right-2 z-10">
        {data?.status === 'locked' && (
          <span className="flex items-center justify-center bg-red-500 border-2 border-white px-2 py-1 rounded-full shadow-lg">
            <Text variant="pxs" fontWeight="semibold" color="text-white">
              Locked
            </Text>
          </span>
        )}
        {data?.status === 'available' && (
          <span className="flex items-center justify-center bg-green-500 border-2 border-white px-2 py-1 rounded-full shadow-lg">
            <Text variant="pxs" fontWeight="semibold" color="text-white">
              Available
            </Text>
          </span>
        )}
      </div>

      {/* Header with Action Buttons */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span
            className={`h-10 w-10 rounded-lg flex items-center justify-center shadow-sm ${
              (typeof data?.productId === 'object'
                ? data?.productId?.color
                : null) || 'bg-blue-tone-100'
            }`}
          >
            <FGTruckFill color="#ffffff" height={20} width={20} />
          </span>

          <div className="flex-1 min-w-0">
            <Text
              variant="ps"
              fontWeight="semibold"
              color="text-gray-900"
              classNames="truncate"
            >
              {data?.truckNumber}
            </Text>
            <Text variant="pxs" color="text-gray-500" classNames="truncate">
              {typeof data?.productId === 'object'
                ? data?.productId?.name
                : 'Unknown Product'}
            </Text>
          </div>
        </div>

        {/* Action Buttons - Now in header area */}
        {data?.status === 'available' && (
          <div className="mt-2 flex items-center gap-2 opacity-70 md:opacity-0 md:group-hover:opacity-100 hover:opacity-100 transition-opacity duration-200">
            <button
              type="button"
              onClick={handleEditTruckModal}
              className="flex items-center justify-center p-1 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 active:bg-blue-200 transition-all duration-200 shadow-sm"
              title="Edit Truck"
            >
              <Edit className="text-blue-600 w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleDeleteTruck}
              className="flex items-center justify-center p-1 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 hover:border-red-300 active:bg-red-200 transition-all duration-200 shadow-sm"
              title="Delete Truck"
            >
              <Trash className="text-red-600 w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Truck Details */}
      <div className="flex-1 space-y-2">
        {/* Capacity */}
        <div className="flex items-center justify-between">
          <Text variant="pxs" color="text-gray-500">
            Capacity
          </Text>
          <Text variant="ps" fontWeight="semibold" color="text-gray-900">
            {formatNumber(data?.capacity)} Ltrs
          </Text>
        </div>

        {/* Location */}
        <div className="flex items-center justify-between">
          <Text variant="pxs" color="text-gray-500">
            Location
          </Text>
          <div title={`${data?.currentCity}, ${data?.currentState}`}>
            <Text
              variant="pxs"
              color="text-gray-700"
              classNames="text-right truncate max-w-[140px]"
            >
              {data?.currentCity}, {data?.currentState}
            </Text>
          </div>
        </div>

        {/* Depot */}
        <div className="flex items-center justify-between">
          <Text variant="pxs" color="text-gray-500">
            Depot
          </Text>
          <div title={data?.depot}>
            <Text
              variant="pxs"
              color="text-gray-700"
              classNames="text-right truncate max-w-[140px]"
            >
              {data?.depot}
            </Text>
          </div>
        </div>

        {/* Hub */}
        <div className="flex items-center justify-between">
          <Text variant="pxs" color="text-gray-500">
            Hub
          </Text>
          <div
            title={
              typeof data?.depotHubId === 'object'
                ? data?.depotHubId?.name
                : 'Unknown Hub'
            }
          >
            <Text
              variant="pxs"
              color="text-gray-700"
              classNames="text-right truncate max-w-[140px]"
            >
              {typeof data?.depotHubId === 'object'
                ? data?.depotHubId?.name
                : 'Unknown Hub'}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Truck;
