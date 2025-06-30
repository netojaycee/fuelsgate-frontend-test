'use client';
import { AuthContext } from '@/contexts/AuthContext';
import DashboardFooter from '@/features/dashboard/components/dashboard-footer';
import DashboardHeader from '@/features/dashboard/components/dashboard-header';
import { cn } from '@/lib/utils';
import React, { useContext, useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = useContext(AuthContext);
  const role = user?.data?.role;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <>
        <DashboardHeader />
        <div
          className={cn(
            'relative',
            role === 'buyer'
              ? '-mt-[180px] max-sm:-mt-[600px]'
              : '-mt-[250px] max-sm:-mt-[630px]',
          )}
        >
          {children}
        </div>
        <DashboardFooter />
      </>
    )
  );
}
