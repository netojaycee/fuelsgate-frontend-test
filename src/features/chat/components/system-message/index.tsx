import { Text } from '@/components/atoms/text';
import { timeDiff } from '@/utils/formatDate';
import { FGInfoFill } from '@fg-icons';
import React from 'react';

interface SystemMessageProps {
  content: string;
  timestamp: string;
}

const SystemMessage: React.FC<SystemMessageProps> = ({
  content,
  timestamp,
}) => {
  return (
    <div className="flex flex-col items-center my-4">
      <div className="bg-gray-100 border border-gray-200 rounded-xl px-4 py-2 max-w-md">
        <div className="flex items-center gap-2">
          <FGInfoFill height={16} width={16} color="#6B7280" />
          <Text variant="pxs" color="text-gray-600" classNames="text-center">
            {content}
          </Text>
        </div>
      </div>
      <Text variant="pxs" color="text-gray-400" classNames="mt-1">
        {timeDiff(timestamp)}
      </Text>
    </div>
  );
};

export default SystemMessage;
