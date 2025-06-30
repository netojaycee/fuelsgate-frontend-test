import React from "react";
import { FGCheckCircle } from "@fg-icons";
import { Heading } from "@/components/atoms/heading";
import { Text } from "@/components/atoms/text";

type ChecklistProps = {
  title: string;
  description: string;
};

const Checklist = ({ title, description }: ChecklistProps) => {
  return (
    <div className="flex items-start gap-2">
      <FGCheckCircle height={25} width={25} className="mt-1.5" />
      <div>
        <Heading
          variant="h6"
          lineHeight="leading-6"
          color="text-deep-gray-300"
          fontWeight="semibold"
          classNames="mb-1"
        >
          {title}
        </Heading>
        <Text variant="pm" color="text-dark-gray-400">
          {description}
        </Text>
      </div>
    </div>
  );
};

export default Checklist;
