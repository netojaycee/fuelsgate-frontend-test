import Cookies from 'js-cookie';
import { cn } from '@/lib/utils';
import { Cog } from 'lucide-react';
import UserProfile from './user-profile';
import { Text } from '@/components/atoms/text';
import { AuthContext } from '@/contexts/AuthContext';
import { Heading } from '@/components/atoms/heading';
import CustomButton from '@/components/atoms/custom-button';
import React, { useContext, useEffect, useState } from 'react';
import Home from '@/features/seller-dashboard/components/home';
import TruckRequest from '@/features/transporter-dashboard/components/truck-request';
import Trucks from '@/features/transporter-dashboard/components/trucks';
import { Roles } from '@/features/authentication/types/authentication.types';
import Settings from './settings';

type TabTypes = 'home' | 'truck-request' | 'settings' | 'trucks';

const CoreDashboard = () => {
  const _activeTab = Cookies.get('active-tab') as TabTypes;
  const isTabType = (tab: string): tab is TabTypes => {
    return ['home', 'truck-request', 'settings', 'trucks'].includes(tab);
  };
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const { user } = useContext(AuthContext);
  const role: Roles | undefined = user?.data?.role;

  const [activeTab, setActive] = useState<TabTypes>(
    isTabType(_activeTab)
      ? _activeTab
      : role === 'seller'
        ? 'home'
        : 'truck-request',
  );

  const displayRole =
    role === 'buyer'
      ? 'Trader'
      : role === 'seller'
        ? 'Supplier'
        : role === 'transporter'
          ? 'Transporter'
          : '';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleTabClick = (payload: TabTypes) => {
    setActive(payload);
    Cookies.set('active-tab', payload);
  };

  return (
    isMounted && (
      <div className="container mx-auto">
        <hr className="mb-16 mt-7 border-dark-400" />
        <Heading
          variant="h1"
          classNames="mb-2 hidden max-lg:block"
          fontWeight="regular"
          color="text-white"
        >
          Welcome back,{' '}
          <span className="font-medium capitalize">
            {user?.data?.firstName}
          </span>
        </Heading>
        <Text
          variant="pm"
          color="text-white"
          classNames="mb-10 hidden max-lg:block"
        >
          You are logged in as a {displayRole}
        </Text>
        <div className="grid grid-cols-12 gap-10 max-xl:gap-4 max-sm:gap-5 mb-10">
          <div className="col-span-4 max-lg:col-span-12">
            <UserProfile />
          </div>
          <div className="col-span-8 max-lg:col-span-12">
            <Heading
              variant="h1"
              classNames="mb-2 block max-lg:hidden"
              fontWeight="regular"
              color="text-white"
            >
              Welcome back,{' '}
              <span className="font-medium capitalize">
                {user?.data?.firstName}
              </span>
            </Heading>
            <Text
              variant="pm"
              color="text-white"
              classNames="mb-10 block max-lg:hidden"
            >
              You are logged in as a {displayRole}
            </Text>
            <div className="bg-white border border-light-gray-450 rounded-[20px]">
              <div className="flex flex-wrap items-center gap-1 px-9 max-lg:px-4 py-4 max-sm:px-4 border-b border-mid-gray-350">
                {role === 'seller' && (
                  <CustomButton
                    variant="plain"
                    fontSize="text-base"
                    onClick={() => handleTabClick('home')}
                    height="h-11"
                    width="w-fit"
                    classNames="rounded-[9px] px-5"
                    color={cn(
                      activeTab === 'home'
                        ? 'text-dark-300'
                        : 'text-dark-gray-250',
                    )}
                    bgColor={cn(
                      activeTab === 'home'
                        ? 'bg-light-gray-250 focus:bg-light-gray-250'
                        : 'bg-white',
                    )}
                    border={cn(
                      activeTab === 'home'
                        ? 'border-mid-gray-250'
                        : 'border-light-gray-200',
                    )}
                    fontWeight="semibold"
                    label="Home"
                  />
                )}
                <CustomButton
                  variant="plain"
                  fontSize="text-base"
                  onClick={() => handleTabClick('truck-request')}
                  height="h-11"
                  width="w-fit"
                  classNames="rounded-[9px] px-5"
                  color={cn(
                    activeTab === 'truck-request'
                      ? 'text-dark-300'
                      : 'text-dark-gray-250',
                  )}
                  bgColor={cn(
                    activeTab === 'truck-request'
                      ? 'bg-light-gray-250 focus:bg-light-gray-250'
                      : 'bg-white',
                  )}
                  border={cn(
                    activeTab === 'truck-request'
                      ? 'border-mid-gray-250'
                      : 'border-light-gray-200',
                  )}
                  fontWeight="semibold"
                  label="Truck Request"
                />
                {role === 'transporter' && (
                  <CustomButton
                    variant="plain"
                    fontSize="text-base"
                    onClick={() => handleTabClick('trucks')}
                    height="h-11"
                    width="w-fit"
                    classNames="rounded-[9px] px-5"
                    color={cn(
                      activeTab === 'trucks'
                        ? 'text-dark-300'
                        : 'text-dark-gray-250',
                    )}
                    bgColor={cn(
                      activeTab === 'trucks' ? 'bg-light-gray-250' : 'bg-white',
                    )}
                    border={cn(
                      activeTab === 'trucks'
                        ? 'border-mid-gray-250'
                        : 'border-light-gray-200',
                    )}
                    fontWeight="semibold"
                    label="Trucks"
                  />
                )}

                <CustomButton
                  variant="plain"
                  onClick={() => handleTabClick('settings')}
                  width="w-fit"
                  classNames="rounded-[9px] ml-auto gap-1"
                  color={cn(
                    activeTab === 'settings'
                      ? 'text-dark-300'
                      : 'text-dark-gray-250',
                  )}
                  bgColor={cn(
                    activeTab === 'settings'
                      ? 'bg-light-gray-250 focus:bg-light-gray-250'
                      : 'bg-white',
                  )}
                  border={cn(
                    activeTab === 'settings'
                      ? 'border-mid-gray-250'
                      : 'border-light-gray-200',
                  )}
                  fontWeight="semibold"
                  leftIcon={<Cog />}
                  label="Settings"
                />
              </div>
              <div className="px-9 max-lg:px-4">
                {activeTab === 'home' && <Home />}
                {activeTab === 'truck-request' && <TruckRequest />}
                {activeTab === 'trucks' && <Trucks />}
                {activeTab === 'settings' && <Settings />}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default CoreDashboard;
