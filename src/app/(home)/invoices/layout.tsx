'use client';

import { InvoicesProvider } from './context/invoiceProvider';

export default function InvoicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div >
      <InvoicesProvider>{children}</InvoicesProvider>
    </div>
  );
}
