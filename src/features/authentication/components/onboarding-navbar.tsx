'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/contexts/AuthContext';
import whiteLogo from '@assets/images/logo_white.svg';
import React, { useCallback, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const OnboardingNavbar = () => {
  const { resetUser } = useContext(AuthContext);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = useCallback(() => {
    resetUser?.();
    router.push('/login');
  }, [resetUser, router]);

  return (
    <div className="bg-black">
      <div className="container mx-auto py-7 max-sm:px-2.5">
        <div className="flex justify-between items-center">
          <Image src={whiteLogo} width={77} height={52} alt="Logo" />
          {pathname !== '/role-select' && (
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-white"
            >
              Logout
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingNavbar;
