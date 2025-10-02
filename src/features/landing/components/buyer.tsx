import React, { useContext } from 'react';
import { Sora } from 'next/font/google';
import { Heading } from '@/components/atoms/heading';
import MobilePhone from '@assets/images/Buyer.svg';
import Image from 'next/image';
import Checklist from './checklist';
import CustomButton from '@/components/atoms/custom-button';
import { ChevronRight, FileText, Search, Users } from 'lucide-react';
import { LandingContext } from '../contexts/LandingContext';
import Link from 'next/link';
import { DASHBOARD } from '@/routes';
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FGTruckFill, FGLocation, FGUserHeart } from '@fg-icons';

const sora = Sora({ subsets: ['latin'] });

const Buyer = () => {
  const { handleBuyerSignUp, handleSignIn } = useContext(LandingContext);
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const isLoggedIn = !!user?.data?._id;

  const handleDashboardNavigation = () => {
    router.push(DASHBOARD);
  };
  return (
    <div className="container mx-auto">
      <Heading
        variant="h2"
        fontFamily={sora.className}
        classNames="max-w-[1192px] mb-5 mx-auto text-center max-sm:text-[28px]"
        fontWeight="regular"
        lineHeight="leading-[45px]"
      >
        Don&apos;t wait. Load out{" "}
        <span className="text-gold font-semibold">fast</span>.
      </Heading>
      <Heading
        variant="h6"
        classNames="text-center mb-20"
        color="text-dark-gray-400"
      >
       Connect directly to Dangote Refinery fuel supply vendors, fuel importers and vetted trucks of all types
      </Heading>

      <div className="grid grid-cols-2 max-lg:grid-cols-1 items-start gap-10 max-sm:gap-2">
        <div className="flex flex-col h-full gap-5 py-5">
          <Checklist
            title="Bypass procurement barrier"
            description="You cannot pay for 500,000ltrs at Dangote Refinery? Unlock access to smaller product volumes"
            icon={FGUserHeart}
          />
          <Checklist
            title="Comprehensive Marketers"
            description="Select from a list of approved marketers"
            icon={Users}
          />
          <Checklist
            title="Negotiate Directly"
            description="Request For Quote; receive quotes; accept/counteroffer"
            icon={FGUserHeart}
          />
          <Checklist
            title="Digital Ticket"
            description="'Smart Contract' with terms for volume & truck claims reconciliation"
            icon={FileText}
          />
          <Checklist
            title="Comprehensive Trucks"
            description="Search & book from #1 database of vetted trucks of all types"
            icon={FGTruckFill}
          />
          <div>
            <Link
              href="https://www.youtube.com/watch?v=QSqK5nzQR0o"
              className="text-gold text-md font-semibold flex items-center gap-2"
              target="_blank"
            >
              Watch Demo
            </Link>
          </div>
          {isLoggedIn ? (
            <CustomButton
              onClick={handleDashboardNavigation}
              variant="glow"
              label="Go to Dashboard"
              width="w-fit"
              height="h-12"
            />
          ) : (
            // <div className="flex items-center justify-start mt-auto">
            <div className="flex sm:items-center justify-start mt-auto flex-col sm:flex-row gap-4">
              <CustomButton
                variant="glow"
                onClick={handleBuyerSignUp}
                label="Sign Up as Customer"
                width="w-fit"
                height="h-12"
              />
              <CustomButton
                variant="plain"
                onClick={handleSignIn}
                label="Sign In"
                width="w-[142px]"
                color="text-black hover:text-black/50"
                rightIcon={<ChevronRight color="black" />}
                height="h-13"
              />
            </div>
          )}
        </div>
        <div className="relative">
          <Image src={MobilePhone} className="mx-auto" alt="Mobile Phone" />
        </div>
      </div>
    </div>
  );
};

export default Buyer;
