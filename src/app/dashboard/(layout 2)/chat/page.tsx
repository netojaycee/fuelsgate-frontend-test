import Image from 'next/image';
import React from 'react';
import StartNew from '@assets/images/start-new.svg';
import { Text } from '@/components/atoms/text';

const Chat = () => {
  return (
    <div className="relative bg-white hidden lg:flex flex-col gap-2 items-center justify-center h-full">
      <Image
        src={StartNew}
        height={150}
        width={150}
        alt="Start new conversation"
      />
      <Text
        variant="ps"
        fontWeight="medium"
        classNames="text-center"
        color="text-gray-400"
      >
        Select a Conversation to start
      </Text>
    </div>
  );
};

export default Chat;
