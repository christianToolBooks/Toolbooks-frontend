import React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import QueryClientProvider from '@/src/app/QueryClientProvider';

import { Toaster } from '@/src/components/ui/sonner';

import './globals.css';
import { ReduxProvider } from '../components/providers/ReduxProvider';
import PdfSetup from '../components/PdfSetup';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Bookkeeping App',
  description: 'Bookkeeping App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider>
          <ReduxProvider>
            <PdfSetup />
            {children}
            </ReduxProvider>
        </QueryClientProvider>

        <Toaster />
      </body>
    </html>
  );
}
