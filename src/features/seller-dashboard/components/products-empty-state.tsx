import { Text } from '@/components/atoms/text';
import { FGFlask } from '@fg-icons';
import React from 'react';

const ProductsEmptyState = () => {
  return (
    <div className="h-[150px] w-full border border-[#F1F1F2] rounded-xl flex gap-3 items-center justify-center mb-6">
      <span className="h-[38px] w-[38px] rounded-md flex items-center justify-center bg-[#F1F1F2]">
        <FGFlask color="#181C32" height={20} width={20} />
      </span>

      <div>
        <Text variant="ps" fontWeight="semibold" color="text-dark-gray-500">
          No product
        </Text>
        <Text variant="pxs" fontWeight="semibold" color="text-[#666666]">
          You have not uploaded any price today
        </Text>
      </div>
    </div>
  );
};

export default ProductsEmptyState;
