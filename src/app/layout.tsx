import './globals.css';
import AllModals from './modals';
import Providers from './providers';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ModalProvider } from '@/contexts/ModalContext';
import WhatsAppWidget from '@/components/atoms/whatsapp-widget';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fuelsgate',
  description: 'A Digital Platform For Securing Bulk Fuels Deliveries',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <ModalProvider>
        <Providers>
          <html lang="en">
            <head>
              <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
              <Script
                async
                src="https://www.googletagmanager.com/gtag/js?id=G-Q5FPLD9G8Z"
                strategy="afterInteractive"
              ></Script>
              <Script id="google-analytics" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());

                  gtag('config', 'G-Q5FPLD9G8Z');
                `}
              </Script>
            </head>
            <body className={inter.className}>
              <Toaster />
              <AllModals />
              <WhatsAppWidget phoneNumber="+2348117074094" />
              {children}
            </body>
          </html>
        </Providers>
      </ModalProvider>
    </AuthProvider>
  );
}
