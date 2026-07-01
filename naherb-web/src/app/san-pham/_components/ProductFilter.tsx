"use client";

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { ProductCategorySummary } from '@/services/generated/model';

interface ProductFilterProps {
  categories: ProductCategorySummary[];
}

export default function ProductFilter({ categories }: ProductFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [need, setNeed] = useState(searchParams.get('need') || '');
  const currentCategory = searchParams.get('categorySlug') || '';
  const inStockOnly = searchParams.get('inStockOnly') === 'true';

  const updateFilters = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.set('page', '0'); // reset page on filter
      router.push(`/san-pham?${params.toString()}`);
    },
    [router, searchParams]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters('keyword', keyword);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 space-y-6">
      <form onSubmit={handleSearch} className="flex gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1 rounded-xl border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
        />
        <button
          type="submit"
          className="bg-green-700 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-800 transition"
        >
          Tìm
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
          <select
            value={currentCategory}
            onChange={(e) => updateFilters('categorySlug', e.target.value)}
            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.slug}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nhu cầu</label>
          <select
            value={need}
            onChange={(e) => {
              setNeed(e.target.value);
              updateFilters('need', e.target.value);
            }}
            className="w-full rounded-xl border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
          >
            <option value="">Tất cả nhu cầu</option>
            <option value="co-vai-gay">Cổ vai gáy</option>
            <option value="lung">Lưng / Cột sống</option>
            <option value="mat">Mắt / Thư giãn</option>
            <option value="khop">Xương khớp</option>
          </select>
        </div>

        <div className="flex items-center pt-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => updateFilters('inStockOnly', e.target.checked ? 'true' : '')}
              className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <span className="text-sm font-medium text-gray-700">Chỉ hiện sản phẩm còn hàng</span>
          </label>
        </div>
      </div>
    </div>
  );
}
