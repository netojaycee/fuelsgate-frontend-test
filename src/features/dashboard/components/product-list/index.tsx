import React from 'react';
import { productListColumns } from './columns';
import { CustomTable } from '@/components/organism/custom-table';

const ProductTableList = ({
  products,
  loading,
}: {
  products: any;
  loading: boolean;
}) => {
  return (
    <CustomTable
      columns={productListColumns}
      data={products}
      loading={loading}
    />
  );
};

export { ProductTableList };
