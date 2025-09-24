import { Text } from '@/components/atoms/text';
import Image from 'next/image';
import React from 'react';
import GoldLogo from '@assets/images/logo_gold.png';
import whiteLogo from '@assets/images/logo_white.svg';
import Link from 'next/link';

export default function Logo({ white, link }: { white?: boolean, link?: string }) {
  return (
    <Link href={link || '/'} className="flex items-baseline gap-2 mb-5">
      <Image
        src={white ? whiteLogo : GoldLogo}
        width={99}
        height={66}
        alt="Logo"
      />
      <Text variant="ps" classNames="italic" color={'text-dark-gray-100'}>
        ...smart up
      </Text>
    </Link>
  );
}
