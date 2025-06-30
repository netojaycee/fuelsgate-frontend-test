import React from 'react';
import { cn } from '@/lib/utils';
import { cva } from 'class-variance-authority';
import { Text } from '@/components/atoms/text';
import { FGCheckCircle, FGClockFill, FGTimesCircle } from '@fg-icons';

export type StatusTypes =
  | 'in-progress'
  | 'ongoing'
  | 'awaiting-approval'
  | 'pending'
  | 'cancelled'
  | 'rejected'
  | 'sent'
  | 'completed'
  | 'accepted';

export type StatusTextProps = {
  status: StatusTypes;
};

const StatusText = ({ status }: StatusTextProps) => {
  const statusVariants = cva('', {
    variants: {
      variant: {
        pending: 'text-red-tone-500',
        ongoing: 'text-red-tone-500',
        'in-progress': 'text-red-tone-500',
        accepted: 'text-green-tone-1000',
        rejected: 'text-red-tone-100',
        completed: 'text-green-tone-1000',
        cancelled: 'text-red-tone-100',
        'awaiting-approval': 'text-red-tone-500',
        sent: 'text-green-tone-1000',
      },
    },
    defaultVariants: {
      variant: 'pending',
    },
  });

  return (
    <Text
      variant="pxs"
      classNames="flex items-center capitalize gap-1 whitespace-nowrap"
      color={cn(statusVariants({ variant: status }))}
    >
      {(status === 'pending' ||
        status === 'awaiting-approval' ||
        status === 'ongoing') && (
        <FGClockFill height={16} width={16} color="#F17B2C" />
      )}
      {(status === 'accepted' ||
        status === 'sent' ||
        status === 'completed') && (
        <FGCheckCircle height={13} width={13} color="#38C793" />
      )}
      {(status === 'rejected' || status === 'cancelled') && (
        <FGTimesCircle height={13} width={13} color="#DF1C41" />
      )}
      {status}
    </Text>
  );
};

export { StatusText };
