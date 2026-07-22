"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { buildProductListingHref } from "@/lib/product-listing";

type ProductSortBarProps = {
  basePath?: string;
  categoryInPath?: boolean;
};

export default function ProductSortBar({
  basePath,
  categoryInPath = false,
}: ProductSortBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "latest";
  const resolvedBase = basePath || pathname || "/san-pham";

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = Object.fromEntries(searchParams.entries());
    const href = buildProductListingHref(resolvedBase, {
      keyword: params.keyword,
      categorySlugs: categoryInPath ? [] : searchParams.getAll("categorySlugs"),
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      inStockOnly: params.inStockOnly === "true",
      sort: e.target.value,
      page: 0,
      categoryInPath,
    });
    router.push(href, { scroll: false });
  };

  return (
    <div className="flex flex-wrap justify-between items-center mb-md gap-sm">
      <div className="flex items-center gap-xs flex-wrap" />
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
