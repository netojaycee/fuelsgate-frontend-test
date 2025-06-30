'use client';
import CustomButton from '@/components/atoms/custom-button';
import CustomInput from '@/components/atoms/custom-input';
import { Heading } from '@/components/atoms/heading';
import { Text } from '@/components/atoms/text';
import SellerForm from '@/features/authentication/components/seller-form';
import { Sora } from 'next/font/google';
import React, { useContext, useMemo } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import useBlockPageHook from '@/hooks/useBlockPage.hook';
import { Roles } from '@/features/authentication/types/authentication.types';
import useDepotHubHook from '@/hooks/useDepotHub.hook';
import useProductHook from '@/hooks/useProduct.hook';
import { DepotHubDto } from '@/types/depot-hub.types';
import SellerFormFields from '@/components/organism/seller-form-fields';
import UpdateSellerForm from '@/features/dashboard/components/update-seller-form';
import UpdateTransporterForm from '@/features/dashboard/components/update-transport-form';

const sora = Sora({ subsets: ['latin'] });

const UpdateProfile = () => {
  const { user } = useContext(AuthContext);
  const role: Roles | undefined = user?.data?.role;
  useBlockPageHook({ isBlocking: true });
  const { useFetchDepotHubs } = useDepotHubHook();
  const { data: depotsRes, isLoading: loadingDepots } = useFetchDepotHubs;
  const { useFetchProducts } = useProductHook();
  const { data: productsRes, isLoading: loadingProducts } = useFetchProducts;

  const depots = useMemo(() => {
    if (depotsRes) {
      return depotsRes?.data
        ?.sort((a: DepotHubDto, b: DepotHubDto) => a.name.localeCompare(b.name))
        ?.map((item: DepotHubDto) => ({
          label: item.name,
          value: item._id,
        }));
    }
  }, [depotsRes]);

  const products = useMemo(() => {
    if (productsRes) {
      return productsRes?.data?.products.map((item: DepotHubDto) => ({
        label: item.name,
        value: item._id,
      }));
    }
  }, [productsRes]);

  return (
    <div className="relative bg-white">
      <div className="container mx-auto py-20">
        <div className="relative max-w-[750px] mx-auto">
          <Heading
            variant="h3"
            fontWeight="semibold"
            fontFamily={sora.className}
            classNames="mb-1"
          >
            Edit information
          </Heading>
          <Text variant="pm" color="text-black_70" classNames="mb-10">
            Edit your business information
          </Text>
          <div className="border w-full border-mid-gray-550 px-3 py-20 rounded-[10px]">
            <div className="max-w-[512px] mx-auto">
              {role === 'seller' && (
                <UpdateSellerForm
                  {...{ depots, products, loadingDepots, loadingProducts }}
                />
              )}
              {role === 'transporter' && (
                <UpdateTransporterForm
                  {...{
                    depots,
                    loadingDepots,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
