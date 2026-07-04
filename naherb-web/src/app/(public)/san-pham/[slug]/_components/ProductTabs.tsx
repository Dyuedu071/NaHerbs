"use client";

import { useState } from 'react';

interface ProductTabsProps {
  detailDescription?: string;
  usageInstruction?: string;
  safetyNote?: string;
}

export default function ProductTabs({ detailDescription, usageInstruction, safetyNote }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'detail' | 'usage' | 'safety'>('detail');

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

      <div className="py-8 prose prose-green max-w-none text-gray-600">
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
    </div>
  );
}
