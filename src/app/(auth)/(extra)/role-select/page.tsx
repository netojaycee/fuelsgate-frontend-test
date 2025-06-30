import React from 'react';
import { Metadata } from 'next';
import RoleSelectForm from '@/features/authentication/components/role-select-form';

export const metadata: Metadata = {
  title: 'Fuelsgate | Role Select',
};

const RoleSelect = () => {
  const roles = [
    {
      id: 'buyer',
      name: 'Trader',
      description: 'Find product/price direct from suppliers',
    },
    {
      id: 'seller',
      name: 'Supplier',
      description: 'Post product/price at any depot location',
    },
    {
      id: 'transporter',
      name: 'Transporter',
      description: 'Post trucks at any depot location',
    },
  ];

  return <RoleSelectForm roles={roles} />;
};

export default RoleSelect;
