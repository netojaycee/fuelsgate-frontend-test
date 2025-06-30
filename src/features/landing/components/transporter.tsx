import React, { useContext } from 'react';
import { Sora } from 'next/font/google';
import { Heading } from '@/components/atoms/heading';
import MobilePhone from '@assets/images/Transporter.svg';
import Image from 'next/image';
import Checklist from './checklist';
import CustomButton from '@/components/atoms/custom-button';
import { ChevronRight } from 'lucide-react';
import { LandingContext } from '../contexts/LandingContext';
import { DASHBOARD } from '@/routes';
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

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
        Trucks <span className="text-gold font-semibold">spend less</span> idle
        time on Fuelsgate
      </Heading>
      <Heading
        variant="h6"
        classNames="text-center mb-20"
        color="text-dark-gray-400"
      >
        Discharge and immediately load at the nearest depot to you, because we
        always have cargo transport business opportunities for you in depots
        nationwide.
      </Heading>

      <div className="grid grid-cols-2 max-lg:grid-cols-1 items-start gap-10 max-sm:gap-2">
        <div className="flex flex-col h-full gap-5 py-5">
          <Checklist
            title="Your unique channel to list daily available trucks"
            description="Reach the market in real-time"
          />
          <Checklist
            title="List & delist trucks anytime at any depot nationwide"
            description="Load from the closest depot to you"
          />
          <Checklist
            title="Receive RFQs, send quotes & bid privately"
            description="Flexibility for every negotiation"
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
            <div className="flex items-center justify-start mt-auto">
              <CustomButton
                variant="glow"
                onClick={handleTransporterSignUp}
                label="Sign Up as Transporter"
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
