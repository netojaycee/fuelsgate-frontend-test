import { Text } from '@/components/atoms/text';
import { TableNumber } from '@/components/organism/custom-table/custom-column-components/number';
import { ReviewOfferBtn } from './review-offer-btn';
import { StatusText } from '@/features/transporter-dashboard/components/truck-order-list/status-text';
import ProductRenderer from '@/components/atoms/product-renderer';
import ClickableUserName from '@/components/atoms/clickable-user-name';

const orderListColumns = [
  {
    accessorKey: 'buyerId',
    header: 'Customer',
    cell: ({ row }: any) => {
      return (
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
    accessorKey: 'productUploadId',
    header: 'Product',
    cell: ({ row }: { row: any }) => {
      return (
        <ProductRenderer product={row.getValue('productUploadId').productId} />
      );
    },
  },
  {
    accessorKey: 'volume',
    header: 'Volume',
    cell: ({ row }: { row: any }) => {
      return <TableNumber number={row.getValue('volume')} type="volume" />;
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
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }: any) => {
      return (
        <ReviewOfferBtn
          orderId={row.original._id}
          orderStatus={row.getValue('status')}
        />
      );
    },
  },
];

export { orderListColumns };
