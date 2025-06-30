import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FGEmail, FGLinkedIn, FGPhone, FGTwitterX } from '@fg-icons';
import { Text } from '@/components/atoms/text';
import GoldLogo from '@assets/images/logo_gold.svg';
import { Youtube } from 'lucide-react';
import { Sora } from 'next/font/google';

const sora = Sora({ subsets: ['latin'] });

const DashboardFooter = () => {
  return (
    <>
      <div className="relative bg-white border-t border-mid-gray-200">
        <div className="container mx-auto">
          <div className="flex flex-wrap items-end gap-20 py-14">
            <div className="mr-auto">
              <div className="inline-flex items-end gap-4 mb-5">
                <Image src={GoldLogo} width={99} height={66} alt="Logo" />
                <Text variant="ps" classNames="italic">
                  .. smart up
                </Text>
              </div>
              <Text variant="ps" classNames="flex items-center gap-3">
                Follow us on our socials
                <Link
                  href="https://www.linkedin.com/company/fuels-gate-resources/"
                  target="_blank"
                >
                  <FGLinkedIn />
                </Link>
                <Link href="https://x.com/FUELSGATE" target="_blank">
                  <FGTwitterX />
                </Link>
                <Link href="https://www.youtube.com/@fuelsgate" target="_blank">
                  <Youtube />
                </Link>
              </Text>
            </div>

            <div>
              <Text
                variant="pl"
                fontFamily={sora.className}
                fontWeight="semibold"
                lineHeight="leading-[25px]"
                classNames="mb-6"
                color="text-gold"
              >
                Contact Support
              </Text>
              <div className="flex items-start gap-2 mb-3">
                <FGEmail color="#89939E" />
                <Link href="mailto:info@fuelsgate.com">
                  <Text variant="ps" color="text-blue-tone-500">
                    info@fuelsgate.com
                  </Text>
                </Link>
              </div>
              <div className="flex items-start gap-2 mb-3">
                <FGPhone color="#89939E" />
                <Link href="tel:+2348117074094">
                  <Text variant="ps" color="text-blue-tone-500">
                    +234 811 707 4094
                  </Text>
                </Link>
              </div>
            </div>
            {/* <div>
              <Text
                variant="pl"
                fontFamily={sora.className}
                fontWeight="semibold"
                lineHeight="leading-[25px]"
                classNames="mb-6"
                color="text-gold"
              >
                Office Address
              </Text>
              <div className="flex items-start gap-2 mb-3">
                <FGLocation color="#89939E" />
                <Text variant="ps" color="text-blue-tone-500">
                  55B, Redwood Street, Northern Foreshore Estate, <br />
                  Chevron Drive, Lekki-Lagos, Nigeria.
                </Text>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      <div className="bg-black">
        <div className="container mx-auto py-10 max-sm:px-2.5">
          <div className="flex lg:gap-7 gap-3 flex-wrap items-center">
            <Text
              variant="pm"
              lineHeight="leading-[21px]"
              color="text-mid-gray-700"
              classNames="mr-auto"
            >
              &copy;2024, BG Labs Limited. All Right Reserved{' '}
            </Text>
            <Link href="/">
              <Text
                variant="pm"
                lineHeight="leading-[21px]"
                fontWeight="medium"
                color="text-mid-gray-700"
              >
                Terms & Conditions
              </Text>
            </Link>
            <Link href="/">
              <Text
                variant="pm"
                lineHeight="leading-[21px]"
                fontWeight="medium"
                color="text-mid-gray-700"
              >
                Privacy Policy
              </Text>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardFooter;
