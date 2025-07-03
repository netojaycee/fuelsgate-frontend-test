'use client';
import { useCallback, useEffect } from 'react';
import { requestHandler } from '@/utils/requestHandler';
import { Loader2 } from 'lucide-react';

import { useRouter } from 'next/navigation';
import useAuthenticationHook from '@/features/authentication/hooks/useAuthentication.hooks';
import useOnboardingHooks from '@/features/authentication/hooks/useOnboarding.hooks';

const GoogleAuth = () => {
  const { saveUserData } = useAuthenticationHook();
  const { saveProfileData } = useOnboardingHooks();
  const router = useRouter();

  const handleGoogleCallback = useCallback(async () => {
    try {
      const searchParams = new URLSearchParams(window.location.search);
      const response = await requestHandler(
        'get',
        `/google/callback?${searchParams.toString()}`,
      );

      if (response.user) {
        saveUserData(response.user);
        if (response.profile) {
          saveProfileData(response.profile);
        }
        if (!response.profile) {
          router.push('/onboarding');
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error during Google authentication:', error);
    }
  }, [router, saveUserData, saveProfileData]);

  useEffect(() => {
    handleGoogleCallback();
  }, [handleGoogleCallback]);

  return (
    <div className="text-center py-10">
      <span>Authenticating with google...</span>
      <Loader2 className="mx-auto mt-5 animate-spin" />
    </div>
  );
};

export default GoogleAuth;
