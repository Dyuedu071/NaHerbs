"use client";

import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductSortBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'latest';

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    params.set('page', '0');
    
    const newQueryString = params.toString();
    if (newQueryString !== searchParams.toString()) {
      router.push(`/san-pham?${newQueryString}`, { scroll: false });
    }
  };

  return (
    <div className="flex flex-wrap justify-between items-center mb-md gap-sm">
      <div className="flex items-center gap-xs flex-wrap">
        {/* We can map active filters here if needed, but for now just show a label or keep it simple */}
      </div>
      <div className="flex items-center gap-xs">
          <span className="font-caption text-caption text-text-muted">Sắp xếp theo:</span>
          <select
              value={currentSort}
              onChange={handleSortChange}
              className="bg-transparent border-none font-label-md text-label-md text-primary cursor-pointer focus:ring-0 p-0"
          >
              <option value="latest">Mới nhất</option>
              <option value="best_selling">Bán chạy nhất</option>
              <option value="price_asc">Giá thấp đến cao</option>
              <option value="price_desc">Giá cao đến thấp</option>
          </select>
      </div>
    </div>
  );
}
