import React from "react";
import { Heading } from "@/components/atoms/heading";

const Productivity = () => {
  return (
    <div className="bg-black h-[407px] bg-[url(/images/ProductivityBg.svg)]">
      <div className="container mx-auto h-full flex flex-col items-center justify-center gap-10">
        <div className="bg-mid-gray-150 h-[32px] w-fit py-1 px-3 rounded-full text-deep-gray-250 text-base font-semibold text-center">
          Your Productivity Tool
        </div>
        <Heading
          variant="h2"
          color="text-transparent"
          fontWeight="semibold"
          lineHeight="leading-[52px]"
          classNames="bg-purple-gradient bg-clip-text max-w-[646px] text-center"
        >
          An all-in-one platform that people can actually use
        </Heading>
      </div>
    </div>
  );
};

export default Productivity;
