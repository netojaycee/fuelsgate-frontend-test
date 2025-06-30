import { cn } from '@/lib/utils';
import { Sora } from 'next/font/google';
import React, { forwardRef, useCallback, useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type NavLinkType = {
  label?: string;
  dropdown?: boolean;
  icon: React.ReactNode;
  count?: number;
  frame: 'icon' | 'picture';
  loading?: boolean;
  dropdownOptions?: { title: string; action: () => void }[];
  onClick?: () => void;
};

const sora = Sora({ subsets: ['latin'] });

const NavLink = forwardRef<HTMLButtonElement, NavLinkType>(
  (
    {
      label,
      icon,
      dropdown = false,
      frame,
      count = 0,
      onClick,
      loading = false,
      dropdownOptions,
      ...props
    },
    ref,
  ) => {
    const countBadge = count > 0 && (
      <span className="absolute top-0 right-0 h-5 min-w-5 p-1 rounded-2xl bg-red-tone-200 text-white text-[10px] flex items-center justify-center font-normal">
        {count}
      </span>
    );

    const buttonContent = (
      <>
        {icon && (
          <span
            className={cn(
              'relative overflow-hidden rounded-full inline-flex justify-center items-center',
              frame === 'icon'
                ? 'h-7 w-7 bg-deep-gray-250 p-1'
                : 'h-5 w-5 border border-white',
            )}
          >
            {icon}
          </span>
        )}
        {label && <span className={cn(!dropdown && 'pr-3')}>{label}</span>}
        {dropdown && <ChevronDown color="#667185" />}
      </>
    );

    return loading ? (
      <Skeleton className="h-[45px] w-fit bg-deep-gray-400 text-white rounded-[100px] gap-[10px] p-[10px] text-sm font-normal items-center tracking-[-1%]" />
    ) : (
      <DropdownMenu>
        {dropdown ? (
          <DropdownMenuTrigger
            className={cn(
              'relative inline-flex h-[45px] w-fit bg-deep-gray-400 text-white rounded-[100px] gap-[10px] p-[10px] text-sm font-normal items-center tracking-[-1%] outline-none',
              sora.className,
            )}
          >
            {buttonContent}
            {countBadge}
          </DropdownMenuTrigger>
        ) : (
          <div className="relative outline-none">
            <button
              type="button"
              ref={ref}
              onClick={onClick}
              className={cn(
                'inline-flex h-[45px] w-fit bg-deep-gray-400 text-white rounded-[100px] gap-[10px] p-[10px] text-sm font-normal items-center tracking-[-1%]',
                sora.className,
              )}
              {...props}
            >
              {buttonContent}
            </button>
            {countBadge}
          </div>
        )}
        {dropdown && (
          <DropdownMenuContent className="max-w-56 w-fit">
            {dropdownOptions?.map((item) => (
              <DropdownMenuCheckboxItem key={item.title} onClick={item.action}>
                {item.title}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    );
  },
);

NavLink.displayName = 'NavLink';

export { NavLink, type NavLinkType };
