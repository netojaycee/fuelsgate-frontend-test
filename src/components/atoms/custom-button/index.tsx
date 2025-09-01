import React, { forwardRef, memo } from 'react';
import { Button } from '../../ui/button';
import clsx from 'clsx';
import { FontWeight, getFontWeight } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

type TCustomButton = {
  label?: string;
  type?: 'button' | 'reset' | 'submit';
  variant: string;
  classNames?: string;
  fontSize?: string;
  fontWeight?: FontWeight;
  fontFamily?: string;
  border?: string;
  height?: string;
  color?: string;
  bgColor?: string;
  width?: string;
  loading?: boolean;
  leftIcon?: React.ReactElement;
  disabled?: boolean;
  rightIcon?: React.ReactElement;
  onClick?: (payload?: unknown) => void;
  onMouseLeave?: () => void;
  onMouseEnter?: () => void;
  hideLabel?: boolean;
};

const CustomButton = forwardRef<HTMLButtonElement, TCustomButton>(
  (
    {
      label,
      type = 'button',
      variant,
      classNames,
      fontSize,
      fontWeight,
      fontFamily,
      width,
      color,
      bgColor,
      height,
      border,
      leftIcon,
      loading,
      rightIcon,
      onClick,
      onMouseLeave,
      onMouseEnter,
      hideLabel = false,
      ...attributes
    },
    ref,
  ) => {
    let buttonClass = classNames;

    if (variant === 'primary') {
      buttonClass = clsx(
        'rounded-full hover:bg-black',
        bgColor ?? 'bg-deep-gray-300',
        color ?? 'text-white',
        buttonClass,
      );
    } else if (variant === 'white') {
      buttonClass = clsx(
        'rounded-full hover:bg-mid-gray-50',
        bgColor ?? 'bg-white',
        border ?? 'border border-mid-gray-450',
        color ?? 'text-blue-tone-150',
        buttonClass,
      );
    } else if (variant === 'plain') {
      buttonClass = clsx(
        'hover:text-deep-gray-300 hover:bg-transparent',
        bgColor ?? 'bg-transparent',
        color ?? 'text-deep-gray-300',
        border,
        buttonClass,
      );
    } else if (variant === 'glow') {
      buttonClass = clsx(
        'rounded-full before:hover:bg-black before:animate border-[3px] border-transparent before:absolute before:h-full before:w-full before:rounded-full',
        bgColor ?? 'before:bg-deep-gray-300 bg-custom-gradient',
        color ?? 'text-white',
        buttonClass,
      );
    }

    return (
      <Button
        type={type}
        disabled={loading}
        className={clsx(
          `relative animate`,
          buttonClass,
          width ?? 'w-full',
          fontSize ?? 'text-base',
          height ?? 'h-[40px]',
          fontFamily,
          getFontWeight(fontWeight),
        )}
        ref={ref}
        onClick={onClick}
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
        {...attributes}
      >
        <span className="relative !flex items-center justify-center animate gap-3">
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5 text-white" />
          ) : (
            <>
              {/* Show only icon if mobile and hideLabel is true */}
              {(hideLabel && window.innerWidth <= 768) ? (
          leftIcon ?? rightIcon
              ) : (
          <>
            {leftIcon}
            {label}
            {rightIcon}
          </>
              )}
            </>
          )}
        </span>
      </Button>
    );
  },
);

CustomButton.displayName = 'CustomButton';

export default memo(CustomButton);
