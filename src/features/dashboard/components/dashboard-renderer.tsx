'use client';
import BuyerDashboard from './buyer-dashboard';
import { AuthContext } from '@/contexts/AuthContext';
import React, { useContext, useEffect, useState } from 'react';
import { Roles } from '@/features/authentication/types/authentication.types';
import CoreDashboard from './core-dashboard';
import { BuyerProvider } from '../contexts/BuyerContext';

const DashboardRenderer = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { user } = useContext(AuthContext);
  const role: Roles | undefined = user?.data?.role;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    isMounted &&
    ((role === 'buyer' && (
      <BuyerProvider>
        <BuyerDashboard />
      </BuyerProvider>
    )) ||
      ((role === 'seller' || role === 'transporter') && <CoreDashboard />))
  );
};

export default DashboardRenderer;
