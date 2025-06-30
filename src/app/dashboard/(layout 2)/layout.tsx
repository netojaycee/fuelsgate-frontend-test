import DashboardHeader2 from '@/features/dashboard/components/dashboard-header-2';
import React from 'react';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative -mt-[250px] max-sm:-mt-[630px]">
      <DashboardHeader2 />
      {children}
    </div>
  );
}
