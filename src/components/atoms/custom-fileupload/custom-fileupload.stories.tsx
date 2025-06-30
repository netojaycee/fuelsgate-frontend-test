import type { Meta, StoryObj } from "@storybook/react";
import { CustomFileUpload } from ".";

const meta = {
  title: 'Components/Custom FileUpload',
  component: CustomFileUpload,
  parameters: {
    layout: 'centered'
  },
  tags: ['autodocs'],
  argTypes: {
    fileType: {
      type: 'string',
      control: "select",
      description: "Select the type of file you want to accept",
      options: ['pdf', 'image']
    },
    name: {
      type: 'string',
      control: "text",
      description: "insert a unique name here"
    },
    label: {
      type: 'string',
      control: "text",
      description: "Enter input label here"
    },
    className: {
      type: 'string',
      control: 'text',
      description: 'Extra className to style the button'
    },
    optional: {
      type: 'boolean',
      control: 'boolean',
      description: 'Use true of false to set if input is optional'
    },
    onChange: {
      type: 'function',
      description: 'Pass a function to be executed on click here'
    },
    register: {
      type: 'function',
      description: 'Pass react form hook register here'
    },
    error: {
      type: 'string',
      control: 'text',
      description: 'Render error messages here'
    },
  }
} satisfies Meta<typeof CustomFileUpload>

export default meta;

type Story = StoryObj<typeof meta>;

export const Base = {
  args: {
    fileType: 'pdf',
    name: "pdf",
    label: "Upload PDf",
  },
} satisfies Story;

export const optional = {
  args: {
    fileType: 'image',
    name: "pdf",
    label: "Upload Image",
    optional: true
  },
} satisfies Story;

export const Error = {
  args: {
    fileType: 'image',
    name: "pdf",
    label: "Upload Image",
    error: 'image is required'
  },
} satisfies Story;
