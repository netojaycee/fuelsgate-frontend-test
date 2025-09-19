import React from 'react';
import { truckListColumns } from './columns';
import { CustomTable } from '@/components/organism/custom-table';
import { truckListPublicColumns } from './pubicColumns';

const TruckTableList = ({
  trucks,
  loading,
  isSearch = false,
}: {
  trucks: any;
  loading: boolean;
  isSearch?: boolean;
}) => {
  // console.log('TruckTableList', trucks);
  return (
    <CustomTable type={'truckList'} columns={isSearch ? truckListPublicColumns : truckListColumns} data={trucks} loading={loading} />
  );
};

export { TruckTableList };
