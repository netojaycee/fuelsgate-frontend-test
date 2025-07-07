import DashboardFooter from '@/features/dashboard/components/dashboard-footer';

export const dynamic = 'force-dynamic';

export default function TruckSearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children} <DashboardFooter />
    </>
  );
}
