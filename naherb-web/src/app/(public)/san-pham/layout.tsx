import React from 'react';
export default function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-surface-container-lowest flex flex-col">
      
      <div className="flex-grow">
        {children}
      </div>
      
    </div>
  );
}
