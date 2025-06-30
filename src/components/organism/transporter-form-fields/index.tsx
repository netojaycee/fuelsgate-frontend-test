import CustomInput from '@/components/atoms/custom-input';
import {
  CustomSelect,
  CustomSelectOption,
} from '@/components/atoms/custom-select';
import React from 'react';

type TransporterFormFieldsProps = {
  register: any;
  errors: any;
  handleDepotChange: (value: unknown) => void;
  depot?: CustomSelectOption;
  depots: CustomSelectOption[];
  loadingDepots: boolean;
};

const TransporterFormFields: React.FC<TransporterFormFieldsProps> = ({
  register,
  errors,
  handleDepotChange,
  depot,
  depots,
  loadingDepots,
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <CustomInput
        type="text"
        label="Company name"
        register={register}
        error={errors.companyName?.message}
        name="companyName"
        classNames="col-span-full"
      />
      <CustomInput
        type="email"
        label="Company Email"
        register={register}
        error={errors.companyEmail?.message}
        name="companyEmail"
      />
      <CustomInput
        type="text"
        label="Company Address"
        register={register}
        error={errors.companyAddress?.message}
        name="companyAddress"
      />
      <CustomSelect
        label="State"
        name="state"
        onChange={handleDepotChange}
        value={depot}
        error={errors.state?.message}
        classNames="col-span-full"
        options={depots}
        isDisabled={loadingDepots}
      />
      <CustomInput
        type="tel"
        label="Phone Number"
        register={register}
        error={errors.phoneNumber?.message}
        name="phoneNumber"
        classNames="col-span-full"
      />
    </div>
  );
};

export default TransporterFormFields;
