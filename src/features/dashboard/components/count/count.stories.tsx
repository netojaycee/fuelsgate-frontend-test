import React from "react";
import { FGChat } from "@fg-icons";
import type { Meta, StoryObj } from "@storybook/react";
import { Count } from ".";

const meta = {
  title: 'Components/Count',
  component: Count,
  decorators: ((story) => <div className="bg-black p-10">{story()}</div>),
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    label: {
      control: 'text',
      type: 'string',
      description: "Enter button label name here"
    },
    icon: {
      type: 'function',
      description: "Pass Icon or image component here",
    },
    count: {
      control: 'text',
      type: 'string',
      description: "Pass count for the label",
    }
  }
} satisfies Meta<typeof Count>

export default meta;

type Story = StoryObj<typeof meta>;

export const Base = {
  args: {
    label: 'Label',
    count: '500,000,000 Ltr',
    icon: <FGChat color="white" />,
  },
} satisfies Story;