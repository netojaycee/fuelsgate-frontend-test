import React from "react";
import { NavLink } from ".";
import { FGChat } from "@fg-icons";
import type { Meta, StoryObj } from "@storybook/react";
import Image from "next/image";

const meta = {
  title: 'Components/NavLink',
  component: NavLink,
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
    dropdown: {
      type: 'boolean',
      control: 'boolean',
      description: "Pass true or false to enable dropdown for component",
    },
    frame: {
      control: 'select',
      type: 'string',
      options: [ 'picture', 'icon' ],
      description: "Select the frame of the icon/image",
    },
    count: {
      control: 'text',
      type: 'number',
      description: "Pass number of unread notifications here",
    },
    onClick: {
      type: 'function',
      description: "Pass onClick event to the button here",
    }
  }
} satisfies Meta<typeof NavLink>

export default meta;

type Story = StoryObj<typeof meta>;

export const Base = {
  args: {
    label: 'Label',
    frame: 'icon',
    icon: <FGChat color="white" />,
  },
} satisfies Story;

export const WithoutLabel = {
  args: {
    frame: 'icon',
    icon: <FGChat color="white" />,
  },
} satisfies Story;

export const Count = {
  args: {
    label: 'Label',
    frame: 'icon',
    count: 10,
    icon: <FGChat color="white" />,
  },
} satisfies Story;

export const Picture = {
  args: {
    label: 'Label',
    frame: 'icon',
    icon: <Image src="https://loremflickr.com/3200/2400/paris,boy?random=1" fill className='object-cover' alt='User Image' />,
  },
} satisfies Story;

export const Dropdown = {
  args: {
    label: 'Label',
    frame: 'icon',
    dropdown: true,
    icon: <Image src="https://loremflickr.com/3200/2400/paris,boy?random=1" fill className='object-cover' alt='User Image' />,
  },
} satisfies Story;