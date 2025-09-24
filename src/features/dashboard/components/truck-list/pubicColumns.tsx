import { TableNumber } from '@/components/organism/custom-table/custom-column-components/number';
import { TableAvatar } from '@/components/organism/custom-table/custom-column-components/avatar';
import { LockBtn } from '../product-list/lock-btn';
import ClickableUserName from '@/components/atoms/clickable-user-name';

const truckListPublicColumns = [
  // {
  //   accessorKey: 'profileId',
  //   header: 'Transporter',
  //   cell: ({ row }: { row: any }) => {
  //     const transporter = row.getValue('profileId');
  //     const companyName = transporter?.companyName ?? transporter?.businessName;

  //     return (
  //       <div className="flex items-center gap-3">
  //         <TableAvatar
  //           name={companyName}
  //           profilePicture={transporter?.profilePicture}
  //         />
  //         <ClickableUserName
  //           user={{
  //             _id: transporter.userId?._id || transporter.userId || '',
  //             firstName: transporter.userId?.firstName || '',
  //             lastName: transporter.userId?.lastName || '',
  //             email: transporter.userId?.email,
  //             companyName: companyName,
  //             role: 'transporter',
  //           }}
  //           variant="ps"
  //           color="text-blue-600"
  //           fontWeight="medium"
  //         />
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: 'depotHubId.name',
  //   header: 'Depot Hub',
  // },
 {
    accessorKey: 'depot',
    header: 'Location',
    cell: ({ row }: { row: any }) => {
      const depot = row.getValue('depot');
      const currentState = row.original?.currentState;
      const displayText = depot ? depot : currentState || '';
      // Show only first 12 chars, ellipsis if longer
      return (
        <span
          className="inline-block max-w-[60px] md:max-w-[120px] truncate"
          title={displayText}
        >
          {displayText}
        </span>
      );
    },
  },
  // {
  //   accessorKey: 'capacity',
  //   header: 'Volume',
  //   cell: ({ row }: { row: any }) => {
  //     return <TableNumber number={row.getValue('capacity')} type="volume" />;
  //   },
  // },
 
  {
    accessorKey: 'status',
    header: 'Action',
    cell: ({ row }: { row: any }) => {
      return (
        <LockBtn
          truck={row.original}
          affix="Truck"
          disabled={row.getValue('status') !== 'available'}
          isSearch
        />
      );
    },
  },
];

export { truckListPublicColumns };
