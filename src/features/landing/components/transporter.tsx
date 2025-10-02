import React, { useContext } from 'react';
import { Sora } from 'next/font/google';
import { Heading } from '@/components/atoms/heading';
import MobilePhone from '@assets/images/Transporter.svg';
import Image from 'next/image';
import Checklist from './checklist';
import CustomButton from '@/components/atoms/custom-button';
import { ChevronRight, Settings, BarChart3, RefreshCw } from 'lucide-react';
import { LandingContext } from '../contexts/LandingContext';
import { DASHBOARD } from '@/routes';
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FGLocation, FGTruckFill, FGUserHeart } from '@fg-icons';

const sora = Sora({ subsets: ['latin'] });

const Transporter = () => {
  const { handleSignIn, handleTransporterSignUp } = useContext(LandingContext);
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
        Gear up with nationwide{" "}
        <span className="text-gold font-semibold">visibility</span>
      </Heading>
      <Heading
        variant="h6"
        classNames="text-center mb-20"
        color="text-dark-gray-400"
      >
        Transform your business with a digital marketplace presence, where cargo & transport business opportunities thrive
      </Heading>

      <div className="grid grid-cols-2 max-lg:grid-cols-1 items-start gap-10 max-sm:gap-2">
        <div className="flex flex-col h-full gap-5 py-5">
          <Checklist
            title="Anytime, anywhere"
            description="Active in Dangote Refinery, depots & truck Parks in Lagos"
            icon={FGLocation}
          />
          <Checklist
            title="Dedicated dashboard"
            description="Reach the market with your brand, deal privately, in real-time"
            icon={BarChart3}
          />
          <Checklist
            title="List & delist anytime"
            description="Update product volumes, prices & trucks at a click"
            icon={RefreshCw}
          />
          <Checklist
            title="Transaction flexibility"
            description="Receive RFQs, send quotes, counteroffer or accept deals"
            icon={FGUserHeart}
          />

          {isLoggedIn ? (
            <CustomButton
              onClick={handleDashboardNavigation}
              variant="glow"
              label="Go to Dashboard"
              width="w-fit"
              height="h-12"
            />
          ) : (
            <div className="flex sm:items-center justify-start mt-auto flex-col sm:flex-row gap-4">
              <CustomButton
                variant="glow"
                onClick={handleTransporterSignUp}
                label="Sign Up as Vendor"
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

export default Transporter;
