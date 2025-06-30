'use client';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import SellerForm from './seller-form';
import TransporterForm from './transporter-form';
import BuyerForm from './buyer-form';
import { AuthContext } from '@/contexts/AuthContext';
import useBlockPageHook from '@/hooks/useBlockPage.hook';
import { Roles } from '@/features/authentication/types/authentication.types';
import useDepotHubHook from '@/hooks/useDepotHub.hook';
import useProductHook from '@/hooks/useProduct.hook';
import { DepotHubDto } from '@/types/depot-hub.types';
import { ProductDto } from '@/types/product.types';

const OnboardingForm = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { user } = useContext(AuthContext);
  const role: Roles | undefined = user?.data?.role;
  useBlockPageHook({ isBlocking: true });
  const { useFetchDepotHubs } = useDepotHubHook();
  const { data: depotsRes, isLoading: loadingDepots } = useFetchDepotHubs;
  const { useFetchProducts } = useProductHook();
  const { data: productsRes, isLoading: loadingProducts } = useFetchProducts;

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      return productsRes?.data?.products.map((item: ProductDto) => ({
        label: item.name,
        value: item._id,
        color: item.color,
        slug: item.value,
      }));
    }
  }, [productsRes]);

  return (
    isMounted && (
      <div className="max-w-[512px] mx-auto">
        {role === 'seller' && (
          <SellerForm
            {...{ depots, products, loadingDepots, loadingProducts }}
          />
        )}
        {role === 'buyer' && <BuyerForm />}
        {role === 'transporter' && (
          <TransporterForm {...{ depots, loadingDepots }} />
        )}
      </div>
    )
  );
};

export default OnboardingForm;
