import React from 'react';
import PublicHeader from '@/components/common/PublicHeader';
import PublicFooter from '@/components/common/PublicFooter';

export default function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col">
      <PublicHeader />
      <div className="flex-grow">
        {children}
      </div>
      <PublicFooter />
    </div>
  );
}
