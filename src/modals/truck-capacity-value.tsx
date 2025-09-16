import { CustomSelectOption } from '@/components/atoms/custom-select';
import React from 'react'
import { components, ValueContainerProps } from 'react-select'


type LitreValueContainerSelectProps = ValueContainerProps<CustomSelectOption, boolean>['selectProps'] & {
  unit?: string;
};

const LitreValueContainer = (props: ValueContainerProps<CustomSelectOption, boolean> & { selectProps: LitreValueContainerSelectProps }) => {
  const { children, selectProps } = props;
  const unit = selectProps.unit || ''; // label passed via selectProps
  
  return (
    <components.ValueContainer {...props}>
      <div className="flex items-center justify-start gap-2 h-[26px] px-1 text-sm">
        <div className='text-xs text-dark-gray-400'>
          {unit}
        </div>
        {children}
      </div>
    </components.ValueContainer>
  );
};


const LitreValueContainerWrapper = (props: ValueContainerProps<unknown, boolean>) => {
  return <LitreValueContainer {...(props as ValueContainerProps<CustomSelectOption, boolean>)} />;
};

export { LitreValueContainerWrapper }