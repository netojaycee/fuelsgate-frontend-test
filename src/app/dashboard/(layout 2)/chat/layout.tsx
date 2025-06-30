import React from 'react'
import { Heading } from '@/components/atoms/heading';
import { ChatList } from '@/components/organism/chat-list';

export default function ChatLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='relative bg-white'>
      <div className="relative container mx-auto py-4">
        <div className="relative max-w-[1211px] mx-auto border border-light-gray-550 rounded-xl py-8 px-10 max-sm:px-3">
          <Heading variant='h4' fontWeight='semibold' classNames='mb-5' color='text-dark-500'>Offer Room</Heading>

          <div className="grid grid-cols-12 sm:gap-10 gap-0">
            <div className="xl:col-span-4 lg:col-span-5 col-span-12 w-full">
              <ChatList />
            </div>
            <div className="xl:col-span-8 lg:col-span-7 col-span-12 w-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}