import CustomLoader from '@/components/atoms/custom-loader';
import { Text } from '@/components/atoms/text';
import React, { FC } from 'react';

type CountPropsType = {
  icon: React.ReactNode;
  count: string | number;
  label: string;
  loading?: boolean;
};

const Count: FC<CountPropsType> = ({ icon, count, label, loading }) => {
  return (
    <div className="flex flex-nowrap items-center gap-[10px] bg-deep-gray-400 rounded-full p-[10px] pr-7 h-[65px] w-fit">
      <div className="h-[45px] w-[45px] rounded-full flex bg-deep-gray-250">
        <div className="m-auto h-7 w-7 bg-deep-gray-200 p-1 rounded-full">
          {icon}
        </div>
      </div>

      <div>
        {loading ? (
          <CustomLoader height="h-7" width="w-7" />
        ) : (
          <Text variant="pl" color="text-white">
            {count}
          </Text>
        )}
        <Text variant="ps" color="text-[#FFFFFF99]">
          {label}
        </Text>
      </div>
    </div>
  );
};

export { Count };
