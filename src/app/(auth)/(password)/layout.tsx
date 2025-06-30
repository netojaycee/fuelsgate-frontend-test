import type { Metadata } from 'next';
import Image from 'next/image';
import whiteLogo from '@assets/images/logo_white.svg';
import { Text } from '@/components/atoms/text';
import PasswordProgress from '@/features/authentication/components/password-progress';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Fuelsgate | Authentication',
  description: 'A Digital Platform For Bulk Fuel Procurement',
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex items-center gap-3 w-full">
      <div className="relative w-1/2 hidden lg:block h-screen bg-white p-3">
        <div className="relative bg-black h-full w-full rounded-[30px]">
          <div className="relative flex flex-col justify-between gap-5 bg-[url('/images/card.svg')] bg-cover bg-no-repeat bg-top-center h-full w-full p-14 pb-20">
            <Image src={whiteLogo} alt="White Logo" width={99} height={66} />

            <PasswordProgress />

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
      <div className="relative h-full flex flex-col w-full lg:w-1/2 py-10 px-3.5">
        {children}
        <div className="flex items-center justify-end gap-7 mt-14 lg:mr-14">
          <Link className="font-medium text-base text-mid-gray-700" href="/">
            Terms & Condition
          </Link>
          <Link className="font-medium text-base text-mid-gray-700" href="/">
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
