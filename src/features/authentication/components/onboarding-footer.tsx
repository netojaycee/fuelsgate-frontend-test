import React from 'react';
import { Text } from '@/components/atoms/text';
import { Sora } from 'next/font/google';
import Link from 'next/link';

const sora = Sora({ subsets: ['latin'] });

const OnboardingFooter = () => {
  return (
    <div className="mt-auto border-t border-mid-gray-250">
      <div className="container mx-auto py-10 max-sm:px-2.5">
        <div className="flex lg:gap-7 gap-3 flex-wrap items-center">
          <Text
            variant="pm"
            lineHeight="leading-[21px]"
            fontFamily={sora.className}
            color="text-dark-gray-100"
            classNames="mr-auto"
          >
            &copy;2024, BG Labs Limited. All Right Reserved{' '}
          </Text>
          <Link href="/">
            <Text
              variant="pm"
              lineHeight="leading-[21px]"
              fontFamily={sora.className}
              fontWeight="semibold"
              color="text-deep-gray-150"
            >
              Terms & Conditions
            </Text>
          </Link>
          <Link href="/">
            <Text
              variant="pm"
              lineHeight="leading-[21px]"
              fontFamily={sora.className}
              fontWeight="semibold"
              color="text-deep-gray-150"
            >
              Privacy Policy
            </Text>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFooter;
