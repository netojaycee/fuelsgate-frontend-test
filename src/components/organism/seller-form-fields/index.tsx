import CustomInput from '@/components/atoms/custom-input';
import { CustomRadioButton } from '@/components/atoms/custom-radiobutton';
import {
  CustomSelect,
  CustomSelectOption,
} from '@/components/atoms/custom-select';
import { RadioGroup } from '@/components/ui/radio-group';
import { SellerValues } from '@/features/authentication/types/onboarding.types';
import React from 'react';

type SellerFormFieldsProps = {
  type: string;
  handleCategoryChange: (value: SellerValues) => void;
  register: any;
  errors: any;
  handleProductsChange: (value: unknown) => void;
  handleDepotChange: (value: unknown) => void;
  depot?: CustomSelectOption;
  depots: CustomSelectOption[];
  products: CustomSelectOption[];
  selectedProducts?: CustomSelectOption[];
  loadingDepots: boolean;
  loadingProducts: boolean;
};

const SellerFormFields: React.FC<SellerFormFieldsProps> = ({
  type,
  handleCategoryChange,
  register,
  errors,
  handleProductsChange,
  products,
  selectedProducts,
  loadingProducts,
  handleDepotChange,
  depot,
  depots,
  loadingDepots,
}) => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4">
        <RadioGroup
          defaultValue={type}
          onValueChange={handleCategoryChange}
          className="flex items-center gap-10 mb-2"
        >
          <CustomRadioButton
            label="Depot Owner/Trader"
            name="depot-owner"
            value="depot-owner"
          />
          <CustomRadioButton label="Trader" name="trader" value="trader" />
        </RadioGroup>

        <hr className="mb-4" />

        {type === 'trader' && (
          <CustomInput
            type="text"
            label="Business Name"
            register={register}
            error={errors.businessName?.message}
            name="businessName"
          />
        )}

        {type === 'depot-owner' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                type="text"
                label="Depot Name"
                name="depotName"
                register={register}
                error={errors.depotName?.message}
              />
              <CustomInput
                type="text"
                label="Trading Name"
                name="businessName"
                register={register}
                error={errors.businessName?.message}
              />
            </div>
          </>
        )}
        <CustomSelect
          label={`What Products Do You ${type === 'depot-owner' ? 'Store/' : ''}Trade?`}
          onChange={handleProductsChange}
          multiple={true}
          value={selectedProducts}
          error={errors.products?.message}
          name="products"
          options={products}
          isDisabled={loadingProducts}
        />
        <CustomInput
          type="tel"
          label="Phone Number"
          name="phoneNumber"
          register={register}
          error={errors.phoneNumber?.message}
        />
        <CustomInput
          type="text"
          label="Head Office Address"
          name="officeAddress"
          placeholder="Street, City"
          register={register}
          error={errors.officeAddress?.message}
          optional={true}
        />
        {type === 'depot-owner' && (
          <CustomInput
            type="text"
            label="Depot Address"
            name="depotAddress"
            register={register}
            error={errors.depotAddress?.message}
            placeholder="Street, City"
          />
        )}
        <CustomSelect
          label="State/Depot Hub"
          name="depotHub"
          onChange={handleDepotChange}
          value={depot}
          options={depots}
          isDisabled={loadingDepots}
          error={errors.depotHub?.message}
        />
      </div>
    </>
  );
};

export default SellerFormFields;
