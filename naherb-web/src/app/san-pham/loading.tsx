import React from 'react';

export default function LoadingProducts() {
  return (
    <main className="pt-[120px] pb-xl px-sm md:px-gutter max-w-container-max mx-auto min-h-screen bg-surface-container-lowest">
      <div className="text-center mb-xl mt-md">
        <h1 className="font-display-lg-mobile md:font-display-lg text-primary mb-sm font-bold opacity-0 animate-pulse bg-surface-variant w-64 h-10 mx-auto rounded-lg">
          Sản phẩm Thảo dược
        </h1>
        <div className="opacity-0 animate-pulse bg-surface-variant w-3/4 max-w-2xl h-16 mx-auto rounded-lg mt-4"></div>
      </div>

      <div className="mb-md animate-pulse">
        <div className="w-full h-12 bg-surface-container-low rounded-xl mb-sm"></div>
        <div className="flex gap-2 overflow-hidden">
          <div className="w-24 h-10 bg-surface-container-low rounded-full"></div>
          <div className="w-24 h-10 bg-surface-container-low rounded-full"></div>
          <div className="w-24 h-10 bg-surface-container-low rounded-full"></div>
          <div className="w-24 h-10 bg-surface-container-low rounded-full"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-md">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-surface-container-lowest rounded-xl p-sm shadow-[0_4px_20px_-2px_rgba(46,77,57,0.12)] block h-full flex flex-col">
            <div className="relative mb-sm overflow-hidden rounded-xl bg-surface-container-low aspect-square flex-shrink-0 animate-pulse"></div>
            
            <div className="space-y-xs flex flex-col flex-grow">
              <div className="h-5 bg-surface-container-low rounded w-3/4 animate-pulse"></div>
              <div className="h-5 bg-surface-container-low rounded w-1/2 animate-pulse mt-1"></div>
              
              <div className="flex gap-1 flex-wrap mt-2">
                 <div className="h-4 w-16 bg-surface-container-low rounded-full animate-pulse"></div>
                 <div className="h-4 w-12 bg-surface-container-low rounded-full animate-pulse"></div>
              </div>
              
              <div className="flex items-center justify-between pt-sm mt-auto">
                <div className="h-6 w-24 bg-surface-container-low rounded animate-pulse"></div>
                <div className="w-10 h-10 rounded-full bg-surface-container-low animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
