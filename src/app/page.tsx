import DashboardFooter from '@/features/dashboard/components/dashboard-footer';
import Hero from '@/features/landing/components/hero';
import Productivity from '@/features/landing/components/productivity';
import RoleRenderer from '@/features/landing/components/role-renderer';
import { LandingProvider } from '@/features/landing/contexts/LandingContext';

export default function Home() {
  return (
    <LandingProvider>
      <div className='bg-black'>
      <Hero />
      <Productivity />
      </div>
      <RoleRenderer />
      <DashboardFooter />

    </LandingProvider>
  );
}
