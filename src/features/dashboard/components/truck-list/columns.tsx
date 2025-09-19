import { TableNumber } from '@/components/organism/custom-table/custom-column-components/number';
import { TableAvatar } from '@/components/organism/custom-table/custom-column-components/avatar';
import { LockBtn } from '../product-list/lock-btn';
import ClickableUserName from '@/components/atoms/clickable-user-name';

const truckListColumns = [
  {
    accessorKey: 'profileId',
    header: 'Transporter',
    // minWidth: 120,
    // maxWidth: 140,
    cell: ({ row }: { row: any }) => {
      const transporter = row.getValue('profileId');
      const companyNameRaw =
        transporter?.companyName ?? transporter?.businessName;
      const companyName = companyNameRaw ? companyNameRaw.split(' ')[0] : '';

      // Use truckOwner if available, otherwise use company name
      const displayName =
        row.original?.truckOwner?.split(' ')[0] || companyName;
      const role = row.original?.profileType || 'transporter';

      // Use ownerLogo if available, otherwise use transporter profile picture
      const profilePicture =
        row.original?.ownerLogo || transporter?.profilePicture;

      return (
        <div className="flex items-center gap-2 min-w-[20px] max-w-[25px] md:max-w-[140px]">
          <TableAvatar name={displayName} profilePicture={profilePicture} />
          <ClickableUserName
            user={{
              _id: transporter.userId?._id || transporter.userId || '',
              firstName: transporter.userId?.firstName || '',
              lastName: transporter.userId?.lastName || '',
              email: transporter.userId?.email,
              companyName: displayName,
              role,
            }}
            variant="ps"
            color="text-blue-600"
            fontWeight="medium"
          />
        </div>
      );
    },
  },
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
      return depot ? depot : currentState || '';
    },
  },

  {
    accessorKey: 'truckNumber',
    header: 'Truck No.',
  },
  // {
  //   accessorKey: 'capacity',
  //   header: 'Volume',
  //   cell: ({ row }: { row: any }) => {
  //     return <TableNumber number={row.getValue('capacity')} type="volume" />;
  //   },
  // },

  // {
  //   accessorKey: 'createdAt',
  //   header: 'Created At',
  //   cell: ({ row }: { row: any }) => {
  //     const createdAt = row.getValue('createdAt');
  //     const date = new Date(createdAt).toLocaleDateString('en-US', {
  //       year: 'numeric',
  //       month: 'short',
  //       day: 'numeric',
  //     });
  //     const time = new Date(createdAt).toLocaleTimeString('en-US', {
  //       hour: '2-digit',
  //       minute: '2-digit',
  //     });

  //     return (
  //       <div className="flex flex-col items-start">
  //         <span className="font-semibold text-gray-800">{date}</span>
  //         <span className="text-xs text-gray-500">{time}</span>
  //       </div>
  //     );
  //   },
  // },
  // {
  //   accessorKey: 'profileId.phoneNumber',
  //   header: 'Contact',
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
        />
      );
    },
  },
];

export { truckListColumns };

// Table wrapper style suggestion (add to your table component):
// <div className="w-full overflow-x-auto">
//   <table className="min-w-[700px] max-w-full table-fixed ...">
//     ...existing code...
//   </table>
// </div>
