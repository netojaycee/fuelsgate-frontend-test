import React, { useContext } from 'react';
import { Sora } from 'next/font/google';
import { Heading } from '@/components/atoms/heading';
import MobilePhone from '@assets/images/Seller.svg';
import Image from 'next/image';
import Checklist from './checklist';
import CustomButton from '@/components/atoms/custom-button';
import { ChevronRight, Play, Youtube, YoutubeIcon } from 'lucide-react';
import { LandingContext } from '../contexts/LandingContext';
import Link from 'next/link';
import { DASHBOARD } from '@/routes';
import { AuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const sora = Sora({ subsets: ['latin'] });

const Supplier = () => {
  const { handleSellerSignUp, handleSignIn } = useContext(LandingContext);
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
        <span className="font-semibold text-gold">Supercharge</span> depot sales
        & marketing fast.
      </Heading>
      <Heading
        variant="h6"
        classNames="text-center mb-20"
        color="text-dark-gray-400"
      >
        Discover the power of Fuelsgate, the nationwide productivity tool that
        connects you with your ideal customers. Showcase your products,
        consolidate sales, and unlock new growth opportunities.
      </Heading>

      <div className="grid grid-cols-2 max-lg:grid-cols-1 items-start gap-10 max-sm:gap-2">
        <div className="flex flex-col h-full gap-5 py-5">
          <Checklist
            title="Your unique channel to post products & prices daily"
            description="Reach the market in real-time"
          />
          <Checklist
            title="Post products at any depot nationwide"
            description="Seize the power of target market reach"
          />
          <Checklist
            title="Update prices anytime of the day"
            description="Quickly react to market changes at a click"
          />
          <Checklist
            title="Bargain customer offers privately"
            description="Flexibility in every transaction"
          />
          <div>
            <Link
              href="https://www.youtube.com/watch?v=x5490OwEq8k"
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
            <div className="flex items-center justify-start mt-auto">
              <CustomButton
                onClick={handleSellerSignUp}
                variant="glow"
                label="Sign Up as Supplier"
                width="w-fit"
                height="h-12"
              />
              <CustomButton
                onClick={handleSignIn}
                variant="plain"
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

export default Supplier;
