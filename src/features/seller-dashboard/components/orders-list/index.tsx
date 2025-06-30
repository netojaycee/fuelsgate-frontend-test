import React from 'react';
import { orderListColumns } from './columns';
import { CustomTable } from '@/components/organism/custom-table';
import CustomPagination from '@/components/molecules/CustomPagination';

const OrderTableList = ({
  orders,
  loading,
  dispatch,
  currentPage,
  totalPages,
}: {
  orders: any;
  loading: boolean;
  dispatch: React.Dispatch<PaginationAction>;
  currentPage: number;
  totalPages: number;
}) => {
  const emptyStateMessage = {
    title: 'No orders yet',
    message: 'You have no received any orders yet.',
  };

  const handleNextPage = () =>
    dispatch({
      type: 'UPDATE_ORDER_PAGE',
      payload: currentPage < totalPages ? currentPage + 1 : currentPage,
    });

  const handlePreviousPage = () =>
    dispatch({
      type: 'UPDATE_ORDER_PAGE',
      payload: currentPage > 1 ? currentPage - 1 : currentPage,
    });

  return (
    <>
      <CustomTable
        columns={orderListColumns}
        data={orders}
        loading={loading}
        emptyState={emptyStateMessage}
      />
      <CustomPagination {...{ handleNextPage, handlePreviousPage }} />
    </>
  );
};

export { OrderTableList };
