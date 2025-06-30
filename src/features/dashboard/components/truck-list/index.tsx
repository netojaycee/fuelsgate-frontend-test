import React from 'react';
import { truckListColumns } from './columns';
import { CustomTable } from '@/components/organism/custom-table';

const TruckTableList = ({
  trucks,
  loading,
}: {
  trucks: any;
  loading: boolean;
}) => {
  // console.log('TruckTableList', trucks);
  return (
    <CustomTable columns={truckListColumns} data={trucks} loading={loading} />
  );
};

export { TruckTableList };
