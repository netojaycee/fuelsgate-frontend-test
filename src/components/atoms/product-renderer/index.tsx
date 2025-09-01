import React from 'react';
import { cn } from '@/lib/utils';
import { ProductDto } from '@/types/product.types';
import { Truck } from 'lucide-react';

const ProductRenderer = ({ product }: { product: ProductDto }) => {
  return (
    <div className="flex items-center gap-2">
      {/* {product.color.includes('-') ? (
        <div className="h-[17px] w-10 rounded-sm overflow-hidden flex flex-col relative">
          <div
            className="h-1/2 w-full"
            style={{ backgroundColor: product.color.split('-')[0] }}
          />
          <div
            className="h-1/2 w-full"
            style={{ backgroundColor: product.color.split('-')[1] }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-xs font-medium uppercase text-white">
            {product.value}
          </span>
        </div>
      ) : (
        <span
          className={cn(
            'inline-flex items-center justify-center h-[17px] w-10 text-xs font-medium rounded-sm uppercase text-white',
          )}
          style={{ backgroundColor: product.color }}
        >
          {product.value}
        </span> 
      )} */}
      {product.color.includes('-') ? (
        <div className="h-[17px] w-10 rounded-full overflow-hidden flex flex-col relative">
          <div
            className="h-1/2 w-full"
            style={{ backgroundColor: product.color.split('-')[0] }}
          />
          <div
            className="h-1/2 w-full"
            style={{ backgroundColor: product.color.split('-')[1] }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Truck className="h-4 w-4 text-white" />
          </div>
        </div>
      ) : (
        <div
          className="inline-flex items-center justify-center h-[17px] w-10 rounded-full"
          style={{ backgroundColor: product.color }}
        >
          <Truck className="h-4 w-4 text-white" />
        </div>
      )}
    </div>
  );
};

export default ProductRenderer;
