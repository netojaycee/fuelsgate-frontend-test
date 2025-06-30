'use client';
import Image from 'next/image';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Text } from '@/components/atoms/text';
import Pattern from '@assets/images/Pattern_landing.svg';
import GlowingBackground from '@assets/images/Background.svg';
import FuelsGateBrand from '@assets/images/Fuelgate.svg';
import { Heading } from '@/components/atoms/heading';
import { Sora } from 'next/font/google';
import Marquee from 'react-fast-marquee';
import Logo from '@assets/images/logo_gold.svg';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LandingContext } from '../contexts/LandingContext';
import CustomButton from '@/components/atoms/custom-button';
import { ArrowDown, ArrowUp, Menu, Search } from 'lucide-react';
import { Roles } from '@/features/authentication/types/authentication.types';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import usePricingHook from '@/hooks/usePricing.hook';
import ProductRenderer from '@/components/atoms/product-renderer';
import { formatNumber } from '@/utils/formatNumber';

const sora = Sora({ subsets: ['latin'] });

const Hero = () => {
  const { setActiveTab, handleSelectRole } = useContext(LandingContext);
  const [navbarBg, setNavbarBg] = useState<string>('bg-transparent');
  const [openSheet, setOpenSheet] = useState(false);
  const { useFetchPricing } = usePricingHook();
  const { data: pricing } = useFetchPricing();

  const handleSheetToggle = useCallback(() => {
    setOpenSheet((prev) => !prev);
  }, []);

  const MobileMenu = () => {
    return (
      <Sheet open={openSheet} onOpenChange={handleSheetToggle}>
        <SheetTrigger className="sm:hidden">
          <Menu
            color={navbarBg === 'bg-light-gradient' ? 'black' : 'white'}
            height={40}
            width={40}
          />
        </SheetTrigger>
        <SheetContent className="w-full px-14 py-28">
          <SheetTitle />
          <SheetDescription />
          <div className="grid grid-cols-1 gap-14">
            <Link
              href="#roles"
              onClick={() => handleActiveTab('seller')}
              className="flex justify-start items-center gap-2 text-lg text-gray-600"
            >
              Supplier
            </Link>
            <Link
              href="/#roles"
              className="flex justify-start items-center gap-2 text-lg text-gray-600"
              onClick={() => handleActiveTab('transporter')}
            >
              Transporter
            </Link>
            <Link
              href="/#roles"
              className="flex justify-start items-center gap-2 text-lg text-gray-600"
              onClick={() => handleActiveTab('buyer')}
            >
              Trader
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    );
  };

  const handleActiveTab = useCallback(
    (payload: Roles) => {
      setActiveTab && setActiveTab(payload);
      setOpenSheet(false);
    },
    [setActiveTab],
  );

  const handleScroll = useCallback(() => {
    if (window.scrollY > 50 && window.scrollY < 1200) {
      setNavbarBg('bg-dark-gradient');
    } else if (window.scrollY > 1200) {
      setNavbarBg('bg-light-gradient');
    } else {
      setNavbarBg('bg-transparent');
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="relative h-[968px] w-full bg-dark-400 pt-32">
      <div className="absolute h-full w-full top-0 left-0">
        <Image src={Pattern} fill alt="Pattern" objectFit="cover" />
      </div>
      <div className="absolute h-[334px] w-full bottom-0 left-0">
        <Image
          src={GlowingBackground}
          fill
          alt="Glowing Background"
          objectFit="cover"
        />
      </div>
      <div
        className={cn(
          'fixed top-0 left-0 pb-6 pt-7 w-full z-50 duration-500 ease-in-out transition-all',
          navbarBg,
        )}
      >
        <div className="group/navbar container mx-auto flex justify-between items-center gap-3">
          <Image src={Logo} width={99} height={67} alt="Logo" />

          <MobileMenu />

          <div className="bg-white/10 sm:flex items-center justify-evenly rounded-full h-[66px] w-[359px] hidden">
            <Link
              href="#roles"
              onClick={() => handleActiveTab('seller')}
              className={cn(
                'text-sm font-normal text-dark-gray-50 animate hover:text-gray-600',
                sora.className,
              )}
            >
              Supplier
            </Link>
            <Link
              href="#roles"
              onClick={() => handleActiveTab('transporter')}
              className={cn(
                'text-sm font-normal text-dark-gray-50 animate hover:text-gray-600',
                sora.className,
              )}
            >
              Transporter
            </Link>
            <Link
              href="#roles"
              onClick={() => handleActiveTab('buyer')}
              className={cn(
                'text-sm font-normal text-dark-gray-50 animate hover:text-gray-600',
                sora.className,
              )}
            >
              Trader
            </Link>
          </div>
        </div>
      </div>

      {/* bg-[url(/images/scrollBg.svg)] */}
      {pricing?.data?.pricings?.length > 0 && (
        <Marquee className="relative bg-transparent bg-center py-4 bg-cover h-fit mb-14">
          {pricing?.data?.pricings?.map((pricing: any) => (
            <div key={pricing._id} className="text-white mr-40">
              <p className="text-xs text-center">
                {pricing.depot}, {pricing.depotHubId.name}
              </p>
              <div
                className={cn(
                  'flex items-center justify-center text-xs gap-2',
                  pricing.positive ? 'text-green-500' : 'text-red-500',
                )}
              >
                <ProductRenderer product={pricing.productId} />
                &#8358;{formatNumber(pricing.price)}
                {pricing.positive ? (
                  <ArrowUp size={16} />
                ) : (
                  <ArrowDown size={16} />
                )}
              </div>
            </div>
          ))}
          {/* <Text
          variant="pm"
          color="text-white"
          fontWeight="semibold"
          classNames=""
        >
          Technology Platform for Suppliers, Transporters &amp; Traders of
          Petroleum Products &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp; ✱ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp; Transact online, Pay offline. &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; ✱ &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
          &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
        </Text> */}
        </Marquee>
      )}

      <div className="relative container mx-auto flex flex-col text-center min-h-screen">
        <Heading
          variant="h1"
          fontFamily={sora.className}
          color="text-white"
          lineHeight="leading-12"
          classNames="max-w-[850px] mx-auto mb-2 max-sm:text-[30px]"
        >
          Search, Find &amp; Negotiate Deals at{' '}
          <span className="text-gold">Depots Nationwide</span>
        </Heading>
        <Text
          variant="pm"
          classNames="max-w-[786px] mx-auto mb-10"
          color="text-mid-gray-175"
        >
          Save time, money &amp; effort on the Fuelsgate productivity tool that
          directly connect suppliers, transporters &amp; buyers of bulk
          petroleum products: PMS (Petrol), AGO (Diesel), ATK (Jet Fuel), LPG
          (Cooking Gas), CNG (Automobile Gas) and Trucks, Anywhere, Anytime.
        </Text>
        <div className="flex items-center justify-center mb-14 max-sm:mb-6">
          <CustomButton
            variant="glow"
            onClick={handleSelectRole}
            leftIcon={<Search />}
            label="Search..."
            width="w-[250px]"
            height="h-12"
          />
          {/* <CustomButton
            variant="plain"
            onClick={handleSignIn}
            label="Sign In"
            width="w-[142px]"
            color="text-white hover:text-white/50"
            rightIcon={<ChevronRight color="white" />}
            height="h-13"
          /> */}
        </div>
        <div className="relative w-full h-[473px] max-sm:h-[273px] mx-auto overflow-visible">
          <Image
            src={FuelsGateBrand}
            fill
            alt="fuelsgate"
            objectFit="contain"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
