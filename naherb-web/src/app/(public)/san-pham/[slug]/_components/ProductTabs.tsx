"use client";

import { useState } from 'react';

interface ProductTabsProps {
  detailDescription?: string;
  usageInstruction?: string;
  safetyNote?: string;
}

export default function ProductTabs({ detailDescription, usageInstruction, safetyNote }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'detail' | 'usage' | 'safety'>('detail');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Xử lý click vào hình ảnh trong nội dung HTML
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'IMG') {
      setLightboxImage((target as HTMLImageElement).src);
    }
  };

  return (
    <div className="mt-16">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex gap-8">
          <button
            onClick={() => setActiveTab('detail')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-lg transition-colors ${
              activeTab === 'detail'
                ? 'border-green-600 text-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Mô tả chi tiết
          </button>
          <button
            onClick={() => setActiveTab('usage')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-lg transition-colors ${
              activeTab === 'usage'
                ? 'border-green-600 text-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Hướng dẫn sử dụng
          </button>
          <button
            onClick={() => setActiveTab('safety')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-lg transition-colors ${
              activeTab === 'safety'
                ? 'border-green-600 text-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Lưu ý an toàn
          </button>
        </nav>
      </div>

      <div 
        className="py-8 prose prose-green max-w-none text-gray-600 prose-img:!rounded-2xl prose-img:!shadow-md prose-img:!max-w-[120px] prose-img:!h-auto prose-img:!block prose-img:!mx-auto prose-img:cursor-zoom-in hover:prose-img:opacity-95 transition-opacity"
        onClick={handleContentClick}
      >
        {activeTab === 'detail' && (
          <div dangerouslySetInnerHTML={{ __html: detailDescription || 'Đang cập nhật...' }} />
        )}
        {activeTab === 'usage' && (
          <div dangerouslySetInnerHTML={{ __html: usageInstruction || 'Đang cập nhật...' }} />
        )}
        {activeTab === 'safety' && (
          <div dangerouslySetInnerHTML={{ __html: safetyNote || 'Đang cập nhật...' }} />
        )}
      </div>

      {/* Lightbox / Modal xem ảnh phóng to */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <button 
            className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={lightboxImage} 
            alt="Phóng to" 
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl scale-in-center"
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
  );
}
