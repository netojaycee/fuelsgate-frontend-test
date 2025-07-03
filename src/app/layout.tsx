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
              <WhatsAppWidget
                phoneNumber="+2348117074094"
                message="Hello! I would like to make an enquiry about Fuelsgate services. I'm interested in learning more about your fuel products and how I can get started."
              />
              {children}
            </body>
          </html>
        </Providers>
      </ModalProvider>
    </AuthProvider>
  );
}
