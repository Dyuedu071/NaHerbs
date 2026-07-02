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
  const currentCategorySlugs = searchParams.getAll('categorySlugs');
  const inStockOnly = searchParams.get('inStockOnly') === 'true';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';

  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);

  const updateFilters = useCallback(
    (key: string, value: string | string[] | boolean) => {
      const params = new URLSearchParams(searchParams.toString());
      
      if (key === 'categorySlugs') {
        params.delete('categorySlugs');
        if (Array.isArray(value)) {
          value.forEach(v => params.append('categorySlugs', v));
        }
      } else if (typeof value === 'boolean') {
        if (value) params.set(key, 'true');
        else params.delete(key);
      } else if (typeof value === 'string') {
        if (value) params.set(key, value);
        else params.delete(key);
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

  const handleCategoryChange = (slug: string, checked: boolean) => {
    let newSlugs = [...currentCategorySlugs];
    if (checked) {
      if (!newSlugs.includes(slug)) newSlugs.push(slug);
    } else {
      newSlugs = newSlugs.filter(s => s !== slug);
    }
    updateFilters('categorySlugs', newSlugs);
  };

  const handlePriceApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');
    
    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');
    
    params.set('page', '0');
    router.push(`/san-pham?${params.toString()}`);
  };

  return (
    <div className="space-y-md">
      {/* Search */}
      <form onSubmit={handleSearch} className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[20px]">search</span>
        <input 
          type="text"
          className="w-full h-10 pl-10 pr-4 rounded-lg bg-surface-container-low border border-surface-variant focus:ring-2 focus:ring-primary/20 text-body-md placeholder:text-text-muted transition-all" 
          placeholder="Tìm sản phẩm..." 
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </form>

      {/* Category Filter */}
      <div className="bg-surface-container-low rounded-xl p-md border border-surface-variant">
        <h3 className="font-label-md text-label-md text-primary mb-sm border-b border-border-warm pb-2">Danh mục</h3>
        <ul className="space-y-sm max-h-[300px] overflow-y-auto custom-scrollbar">
          {categories.map((cat) => {
             const isChecked = currentCategorySlugs.includes(cat.slug || '');
             return (
               <li key={cat.id}>
                 <label className="flex items-center gap-xs cursor-pointer group">
                   <input 
                     type="checkbox"
                     checked={isChecked}
                     onChange={(e) => handleCategoryChange(cat.slug || '', e.target.checked)}
                     className="form-checkbox text-primary focus:ring-primary rounded border-outline w-4 h-4" 
                   />
                   <span className="font-body-md text-body-md text-text-main group-hover:text-primary transition-colors">
                     {cat.name}
                   </span>
                 </label>
               </li>
             );
          })}
        </ul>
      </div>

      {/* Price Filter */}
      <div className="bg-surface-container-low rounded-xl p-md border border-surface-variant">
        <h3 className="font-label-md text-label-md text-primary mb-sm border-b border-border-warm pb-2">Khoảng giá</h3>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <input 
              type="number"
              placeholder="Từ"
              className="w-full px-2 py-1 text-sm border border-surface-variant rounded focus:ring-primary focus:border-primary"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span className="text-text-muted">-</span>
            <input 
              type="number"
              placeholder="Đến"
              className="w-full px-2 py-1 text-sm border border-surface-variant rounded focus:ring-primary focus:border-primary"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <button 
            onClick={handlePriceApply}
            className="w-full mt-2 py-1 px-3 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded text-sm font-medium transition-colors"
          >
            Áp dụng
          </button>
        </div>
      </div>

      {/* In Stock Toggle */}
      <div className="bg-surface-container-low rounded-xl p-md border border-surface-variant">
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            checked={inStockOnly} 
            onChange={(e) => updateFilters('inStockOnly', e.target.checked)}
            className="rounded border-outline text-primary focus:ring-primary w-5 h-5 transition-colors" 
          />
          <span className="font-label-md text-on-surface select-none">Chỉ hiện sản phẩm còn hàng</span>
        </label>
      </div>
    </div>
  );
}
