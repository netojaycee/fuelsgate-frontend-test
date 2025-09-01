import { RfqBtn } from './rfq-btn';
import { StatusText } from './status-text';
import { Text } from '@/components/atoms/text';
import { TableNumber } from '@/components/organism/custom-table/custom-column-components/number';
import ClickableUserName from '@/components/atoms/clickable-user-name';
import CustomButton from '@/components/atoms/custom-button';

// Add Loading Depot
// Update Truck location
const truckOrderListColumns = [
  {
    accessorKey: 'buyerId',
    header: 'Customer',
    cell: ({ row }: any) => (
      // <ClickableUserName
      //   user={{
      //     _id: row.getValue('buyerId').userId._id,
      //     firstName: row.getValue('buyerId').userId.firstName,
      //     lastName: row.getValue('buyerId').userId.lastName,
      //     email: row.getValue('buyerId').userId.email,
      //     role: 'buyer',
      //   }}
      //   variant="ps"
      //   color="text-blue-600"
      //   className="whitespace-nowrap"
      // />
      <Text variant="ps">
        {row.getValue('buyerId').userId.firstName}{' '}
        {row.getValue('buyerId').userId.lastName}
      </Text>
    ),
  },

  {
    accessorKey: 'truckId',
    header: 'Truck Number',
    cell: ({ row }: { row: any }) => {
      const truckNumber = row.original?.truckId?.truckNumber;
      return (
        <span className="text-dark-gray-600 font-medium">
          {truckNumber || 'Unknown Truck'}
        </span>
      );
    },
  },

  // {
  //   accessorKey: 'destination',
  //   header: 'Destination',
  //   cell: ({ row }: { row: any }) => {
  //     return (
  //       <Text variant="ps" classNames="min-w-40">
  //         {row.getValue('destination')}
  //       </Text>
  //     );
  //   },
  // },
  {
    accessorKey: 'truckId',
    header: 'Volume',
    cell: ({ row }: { row: any }) => {
      return (
        <TableNumber number={row.getValue('truckId')?.capacity} type="volume" />
      );
    },
  },
  {
    accessorKey: 'price',
    header: 'Price',
    cell: ({ row }: { row: any }) => {
      return <TableNumber number={row.getValue('price')} type="price" />;
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Order Date',
    cell: ({ row }: { row: any }) => {
      const createdAt = row.getValue('createdAt');
      let dateTime = 'N/A';
      if (createdAt) {
        const dateObj = new Date(createdAt);
        dateTime = `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString(
          [],
          { hour: '2-digit', minute: '2-digit' },
        )}`;
      }
      return <span className="text-dark-gray-600 font-medium">{dateTime}</span>;
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }: { row: any }) => {
      return <StatusText status={row.getValue('status')} />;
    },
  },
  {
    accessorKey: 'rfqStatus',
    header: 'RFQ',
    cell: ({ row }: any) => {
      return <StatusText status={row.getValue('rfqStatus')} />;
    },
  },
  {
    accessorKey: '_id',
    header: 'Action',
    cell: ({ row }: any) => {
      console.log(row.original, 'row.original');

      const negotiationId = row.original.negotiationId;
      const status = row.getValue('status');
      const rfqStatus = row.getValue('rfqStatus');
      if (negotiationId && rfqStatus === 'rejected' && status === 'pending') {
        return (
          <CustomButton
            variant="primary"
            classNames="gap-1.5"
            label="Go to Chat"
            height="h-[38px]"
            fontSize="text-xs"
            fontWeight="medium"
            width="w-[122px]"
            onClick={() =>
              (window.location.href = `/dashboard/chat/${negotiationId}`)
            }
          />
        );
      }
      return (
        <RfqBtn
          truckOrderId={row.getValue('_id')}
          rfqStatus={rfqStatus}
          status={status}
        />
      );
    },
  },
];

export { truckOrderListColumns };
