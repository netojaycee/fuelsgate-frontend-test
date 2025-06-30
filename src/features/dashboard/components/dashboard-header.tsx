'use client';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { NavLink } from './nav-link';
import { FGBell, FGChat, FGClipboard, FGShip } from '@fg-icons';
import tilesBg from '@assets/images/tilesBg.svg';
import { AuthContext } from '@/contexts/AuthContext';
import whiteLogo from '@assets/images/logo_white.svg';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Roles } from '@/features/authentication/types/authentication.types';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ChevronDown, Home, Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { usePathname, useRouter } from 'next/navigation';
import { CHAT, DASHBOARD, MY_ORDERS, RFQ } from '@/routes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import useTruckOrderHook from '@/hooks/useTruckOrder.hook';
import useOrderHook from '@/hooks/useOrder.hook';
import useOfferHook from '@/hooks/useOffer.hook';
import Marquee from 'react-fast-marquee';
import useBuyerDashboardHook from '../hooks/useBuyerDashboard.hook';
import ProductRenderer from '@/components/atoms/product-renderer';
import { formatNumber } from '@/utils/formatNumber';

const DashboardHeader = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const { user, resetUser, profile } = useContext(AuthContext);
  const router = useRouter();
  const role: Roles | undefined = user?.data?.role;
  const { useFetchTruckOrderAnalytics } = useTruckOrderHook();
  const { data: truckOrderAnalytics, isLoading: truckOrderAnalyticsLoading } =
    useFetchTruckOrderAnalytics(
      `?${role === 'buyer' ? 'buyerId' : 'profileId'}=${
        profile?._id
      }&profileType=${role}`,
    );
  const { useFetchOrderAnalytics } = useOrderHook();
  const { data: orderAnalytics, isLoading: orderAnalyticsLoading } =
    useFetchOrderAnalytics(`?${role?.toLocaleLowerCase()}Id=${profile?._id}`);
  const { useFetchOfferAnalytics } = useOfferHook();
  const { data: offerAnalytics, isLoading: offerAnalyticsLoading } =
    useFetchOfferAnalytics(`?profileId=${user?.data?._id}`);
  const { buyerScrollData, loadingBuyerScrollData } = useBuyerDashboardHook();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSheetToggle = useCallback(() => {
    setOpenSheet((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    resetUser && resetUser();
    router.push('/login');
  }, [resetUser, router]);

  const gotoMyOrders = () => router.push(MY_ORDERS);
  const gotoRFQ = () => router.push(RFQ);
  const gotoChats = () => router.push(CHAT);

  const pathname = usePathname();

  const MobileMenu = () => {
    return (
      <Sheet open={openSheet} onOpenChange={handleSheetToggle}>
        <SheetTrigger className="md:hidden">
          <Menu color="white" height={40} width={40} />
        </SheetTrigger>
        <SheetContent className="w-full px-14 py-28">
          <SheetTitle />
          <SheetDescription />
          <div className="grid grid-cols-1 gap-14">
            <Link
              href={DASHBOARD}
              className="flex justify-start items-center gap-2 text-lg text-gray-600"
              onClick={handleSheetToggle}
            >
              <Home color="black" height={22} width={22} />
              Dashboard
            </Link>
            {role !== 'transporter' && (
              <Link
                href={CHAT}
                className="flex justify-start items-center gap-2 text-lg text-gray-600"
                onClick={handleSheetToggle}
              >
                <FGChat color="black" height={24} width={24} />
                Chats
              </Link>
            )}
            {role === 'buyer' && (
              <Link
                href={RFQ}
                className="flex justify-start items-center gap-2 text-lg text-gray-600"
                onClick={handleSheetToggle}
              >
                <FGClipboard color="black" height={24} width={24} />
                RFQ
              </Link>
            )}
            {role === 'buyer' && (
              <Link
                href={MY_ORDERS}
                className="flex justify-start items-center gap-2 text-lg text-gray-600"
                onClick={handleSheetToggle}
              >
                <FGShip color="black" height={24} width={24} />
                Orders
              </Link>
            )}
            <Link
              href="/dashboard"
              className="flex justify-start items-center gap-2 text-lg text-gray-600"
              onClick={handleSheetToggle}
            >
              <FGBell color="black" height={24} width={24} />
              Notifications
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 justify-start text-lg text-gray-600">
                <div className="relative h-7 w-7 rounded-full overflow-hidden border border-gray-600">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src="" className="object-cover" />
                    <AvatarFallback>
                      {user?.data?.firstName.substring(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                {user?.data?.firstName}
                <ChevronDown />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </SheetContent>
      </Sheet>
    );
  };

  return (
    isMounted && (
      <>
        <div
          className={cn(
            'relative bg-dark-400 pt-10 overflow-hidden max-sm:h-[800px]',
            role === 'buyer' ? 'h-[411px] rounded-b-[30px]' : 'h-[379px]',
          )}
        >
          {role === 'buyer' && (
            <div className="absolute top-0 right-0 bottom-0 h-full w-full">
              <Image
                src={tilesBg}
                fill
                alt="Tiles BG"
                className="object-cover"
              />
            </div>
          )}

          <div className="relative container mx-auto">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link href={DASHBOARD}>
                <Image src={whiteLogo} width={99} height={67} alt="Logo" />
              </Link>

              <MobileMenu />

              <div className="flex flex-wrap items-center gap-2 max-md:hidden">
                {role !== 'transporter' && (
                  <NavLink
                    icon={<FGChat color="#FEFEFE" />}
                    frame="icon"
                    onClick={gotoChats}
                    label="Chats"
                    count={offerAnalytics?.data}
                    loading={offerAnalyticsLoading}
                  />
                )}
                {role === 'buyer' && (
                  <NavLink
                    icon={<FGClipboard color="#FEFEFE" />}
                    frame="icon"
                    onClick={gotoRFQ}
                    label="RFQ"
                    count={truckOrderAnalytics?.data}
                    loading={truckOrderAnalyticsLoading}
                  />
                )}
                {role === 'buyer' && (
                  <NavLink
                    icon={<FGShip color="#FEFEFE" />}
                    label="Orders"
                    frame="icon"
                    onClick={gotoMyOrders}
                    count={orderAnalytics?.data}
                    loading={orderAnalyticsLoading}
                  />
                )}
                <NavLink
                  icon={<FGBell color="#FEFEFE" />}
                  frame="icon"
                  onClick={() => console.log('Hello 3')}
                  // count={1}
                />
                <NavLink
                  icon={
                    <Avatar className="h-full w-full">
                      <AvatarImage src="" className="object-cover" />
                      <AvatarFallback className="text-black">
                        {user?.data?.firstName.substring(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                  }
                  frame="picture"
                  label={user?.data?.firstName}
                  dropdown
                  dropdownOptions={[{ title: 'Logout', action: handleLogout }]}
                />
              </div>
            </div>
          </div>

          {role === 'buyer' &&
            pathname === '/dashboard' &&
            buyerScrollData &&
            !loadingBuyerScrollData &&
            Object.entries(buyerScrollData?.data).filter(
              ([_, value]) => (value as any).count > 0,
            ).length > 0 && (
              <Marquee className="relative bg-gray-400 bg-center bg-cover h-[51px] my-10">
                {Object.entries(buyerScrollData?.data)
                  .filter(([_, value]) => (value as any).count > 0)
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center gap-2 text-white mr-10"
                    >
                      <ProductRenderer product={value as any} />
                      <span>
                        {formatNumber((value as any).count)}{' '}
                        {(value as any).unit}
                      </span>
                    </div>
                  ))}
              </Marquee>
            )}
        </div>
      </>
    )
  );
};

export default DashboardHeader;
