import { RfqBtn } from './rfq-btn';
import { StatusText } from './status-text';
import { Text } from '@/components/atoms/text';
import { TableNumber } from '@/components/organism/custom-table/custom-column-components/number';
import ClickableUserName from '@/components/atoms/clickable-user-name';

// Add Loading Depot
// Update Truck location
const truckOrderListColumns = [
  {
    accessorKey: 'buyerId',
    header: 'Customer',
    cell: ({ row }: any) => (
      <ClickableUserName
        user={{
          _id: row.getValue('buyerId').userId._id,
          firstName: row.getValue('buyerId').userId.firstName,
          lastName: row.getValue('buyerId').userId.lastName,
          email: row.getValue('buyerId').userId.email,
          role: 'buyer',
        }}
        variant="ps"
        color="text-blue-600"
        className="whitespace-nowrap"
      />
    ),
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
        <TableNumber number={row.getValue('truckId').capacity} type="volume" />
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
      return (
        <RfqBtn
          truckOrderId={row.getValue('_id')}
          rfqStatus={row.getValue('rfqStatus')}
          status={row.getValue('status')}
        />
      );
    },
  },
];

export { truckOrderListColumns };
