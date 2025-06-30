import React from 'react';
import { truckOrderListColumns } from './columns';
import { CustomTable } from '@/components/organism/custom-table';
import CustomPagination from '@/components/molecules/CustomPagination';

type TruckOrderTableListProps = {
  orders: any;
  loading: boolean;
  currentPage: number;
  totalPages: number;
  setPage: (newValue: number) => void;
};
const TruckOrderTableList: React.FC<TruckOrderTableListProps> = ({
  orders,
  loading,
  setPage,
  currentPage,
  totalPages,
}) => {
  const handleNextPage = () =>
    setPage(currentPage < totalPages ? currentPage + 1 : currentPage);

  const handlePreviousPage = () =>
    setPage(currentPage > 1 ? currentPage - 1 : currentPage);

  const emptyStateMessage = {
    title: 'No order yet',
    message: 'You have no received any orders yet.',
  };
  return (
    <>
      <CustomTable
        columns={truckOrderListColumns}
        data={orders}
        loading={loading}
        emptyState={emptyStateMessage}
      />
      <CustomPagination {...{ handleNextPage, handlePreviousPage }} />
    </>
  );
};

export { TruckOrderTableList };
