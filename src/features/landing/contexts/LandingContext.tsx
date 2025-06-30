'use client';
import { Roles } from '@/features/authentication/types/authentication.types';
import { useRouter } from 'next/navigation';
import { createContext, useState } from 'react';

type LandingProviderValueType = {
  activeTab?: Roles;
  setActiveTab?: (payload: Roles) => void;
  gotoComingSoon?: () => void;
  handleSignUp?: () => void;
  handleSignIn?: () => void;
  handleBuyerSignUp?: () => void;
  handleTransporterSignUp?: () => void;
  handleSellerSignUp?: () => void;
  handleSelectRole?: () => void;
};

const LandingContext = createContext<LandingProviderValueType>({});
const { Provider } = LandingContext;

type LandingProviderProps = {
  children: React.ReactNode;
};

const LandingProvider = ({ children }: LandingProviderProps) => {
  const [activeTab, setActiveTab] = useState<Roles>('seller');
  const router = useRouter();

  const gotoComingSoon = () => router.push('coming-soon');

  const handleSignUp = () => router.push(`/#roles`);
  const handleSelectRole = () => router.push(`/role-select`);
  const handleSignIn = () => router.push('/login');
  const handleBuyerSignUp = () => router.push('/register?role=buyer');
  const handleTransporterSignUp = () =>
    router.push('/register?role=transporter');
  const handleSellerSignUp = () => router.push('/register?role=seller');

  return (
    <Provider
      value={{
        activeTab,
        setActiveTab,
        gotoComingSoon,
        handleSignUp,
        handleSignIn,
        handleSelectRole,
        handleBuyerSignUp,
        handleTransporterSignUp,
        handleSellerSignUp,
      }}
    >
      {children}
    </Provider>
  );
};

export { LandingContext, LandingProvider };
