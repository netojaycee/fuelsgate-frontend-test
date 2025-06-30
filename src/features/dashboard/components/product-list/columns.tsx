import { LockBtn } from './lock-btn';
import { OfferBtn } from './offer-btn';
import { DownloadPdfBtn } from './download-pdf-btn';
import { Timer } from '@/components/atoms/timer';
import { getMinutesDifference } from '@/utils/formatDate';
import { TableAvatar } from '@/components/organism/custom-table/custom-column-components/avatar';
import { TableNumber } from '@/components/organism/custom-table/custom-column-components/number';
import ClickableUserName from '@/components/atoms/clickable-user-name';

const productListColumns = [
  {
    accessorKey: 'sellerId',
    header: 'Seller',
    cell: ({ row }: { row: any }) => {
      const seller = row.getValue('sellerId');
      const profilePicture = seller?.profilePicture;

      return (
        <div className="flex items-center gap-3">
          <TableAvatar
            name={seller.businessName}
            profilePicture={profilePicture}
          />
          <ClickableUserName
            user={{
              _id: seller.userId?._id || seller.userId || '',
              firstName: seller.userId?.firstName || '',
              lastName: seller.userId?.lastName || '',
              email: seller.userId?.email,
              businessName: seller.businessName,
              role: 'seller',
            }}
            variant="ps"
            color="text-blue-600"
            fontWeight="medium"
          />
        </div>
      );
    },
  },
  {
    accessorKey: 'depotHubId.name',
    header: 'Depot',
    cell: ({ row }: { row: any }) => {
      return <span className="text-sm">{row.original.depot}</span>;
    },
  },
  {
    accessorKey: 'volume',
    header: 'Available Volume',
    cell: ({ row }: { row: any }) => {
      return <TableNumber number={row.getValue('volume')} type="volume" />;
    },
  },
  {
    accessorKey: 'price',
    header: 'Opening Price',
    cell: ({ row }: { row: any }) => {
      return <TableNumber number={row.getValue('price')} type="price" />;
    },
  },
  {
    accessorKey: 'expiresIn',
    header: 'Expires In',
    cell: ({ row }: { row: any }) => {
      const time = getMinutesDifference(row.getValue('expiresIn'));
      return <Timer time={time} format="hh:mm" />;
    },
  },
  {
    accessorKey: 'offers',
    header: 'Buyer Offer',
    cell: ({ row }: { row: any }) => {
      const buyerOffer = row.getValue('offers');
      const orders = row.original.orders;
      const price = row.getValue('price');
      const receiverId = row.getValue('sellerId').userId;
      const productUploadId = row.original._id;
      return (
        <OfferBtn
          {...{ price, receiverId, productUploadId, buyerOffer, orders }}
        />
      );
    },
  },
  {
    accessorKey: 'locked',
    header: 'Action',
    cell: ({ row }: { row: any }) => {
      const orders = row.original.orders;
      const price = row.getValue('price');
      const productUploadId = row.original._id;
      const sellerId = row.original.sellerId._id;

      return (
        <LockBtn
          {...{ orders, price, productUploadId, sellerId }}
          affix="Volume"
        />
      );
    },
  },
  // {
  //   accessorKey: 'productQuality',
  //   header: 'See Quality',
  //   cell: ({ row }: { row: any }) => {
  //     const productQuality = row.getValue('productQuality');
  //     return <DownloadPdfBtn productQuality={productQuality} />;
  //   },
  // },
];

export { productListColumns };
