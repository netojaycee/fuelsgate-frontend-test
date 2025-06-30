import './globals.css';
import AllModals from './modals';
import Providers from './providers';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { ModalProvider } from '@/contexts/ModalContext';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fuelsgate',
  description: 'A Digital Platform For Bulk Fuel Procurement',
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
              {children}
            </body>
          </html>
        </Providers>
      </ModalProvider>
    </AuthProvider>
  );
}
