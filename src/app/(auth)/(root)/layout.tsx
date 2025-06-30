import type { Metadata } from 'next';
import Image from 'next/image';
import whiteLogo from '@assets/images/logo_white.svg';
import GoldLogo from '@assets/images/logo_gold.svg';
import { Text } from '@/components/atoms/text';
import { Sora } from 'next/font/google';
import Link from 'next/link';
import { Heading } from '@/components/atoms/heading';

export const metadata: Metadata = {
  title: 'Fuelsgate | Authentication',
  description: 'A Digital Platform For Bulk Fuel Procurement',
};

const sora = Sora({ subsets: ['latin'] });

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex items-center gap-3 w-full">
      <div className="relative w-1/2 hidden lg:block h-full bg-white p-3">
        <div className="relative bg-[url('/images/AuthBg.svg')] bg-cover bg-no-repeat bg-top-center h-fit min-h-full w-full rounded-[30px]">
          <div className="relative flex flex-col gap-5 bg-[url('/images/card.svg')] bg-cover bg-no-repeat bg-top-center h-fit !min-h-screen w-full p-14 pb-10">
            <Image src={whiteLogo} alt="White Logo" width={99} height={66} />

            <div className="max-w-[562px] mt-20">
              <Heading
                variant="dl"
                fontWeight="semibold"
                color="text-white"
                lineHeight="leading-[62px]"
                fontFamily={sora.className}
                classNames="mb-8"
              >
                A Digital Platform For Bulk Fuel Procurement
              </Heading>
              <Text
                variant="pl"
                lineHeight="leading-[26px]"
                color="text-mid-gray-650"
                fontFamily={sora.className}
                classNames="max-w-[440px]"
              >
                Our comprehensive design system offers you an unparalleled range
                of components, sparking creativity and boosting efficiency.
              </Text>
            </div>

            <div className="flex items-center gap-[16px] bg-dark-400 rounded-[20px] p-6 mt-auto">
              <Image src={GoldLogo} alt="Gold Logo" width={60} height={40} />
              <Text
                variant="pm"
                color="text-mid-gray-700"
                lineHeight="leading-[21px]"
              >
                &copy;2024, BG Labs Limited. All Right Reserved
              </Text>
            </div>
          </div>
        </div>
      </div>
      <div className="relative h-full flex flex-col w-full lg:w-1/2 py-10 px-3.5">
        {children}
        <div className="flex items-center justify-end gap-7 mt-14 lg:mr-14">
          <Link
            className="font-medium text-base text-mid-gray-700"
            href="/login"
          >
            Terms & Condition
          </Link>
          <Link
            className="font-medium text-base text-mid-gray-700"
            href="/login"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
