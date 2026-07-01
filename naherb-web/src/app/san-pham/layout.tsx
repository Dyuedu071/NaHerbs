import React from 'react';
import PublicHeader from '@/components/common/PublicHeader';

export default function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <PublicHeader />
      <div className="pt-20 flex-grow">
        {children}
      </div>
    </div>
  );
}
