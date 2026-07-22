"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { ProductCategorySummary } from "@/services/generated/model";
import { buildProductListingHref, categoryPath } from "@/lib/product-listing";

interface ProductFilterProps {
  categories: ProductCategorySummary[];
  basePath?: string;
  categoryInPath?: boolean;
  activeCategorySlugs?: string[];
}

export default function ProductFilter({
  categories,
  basePath = "/san-pham",
  categoryInPath = false,
  activeCategorySlugs,
}: ProductFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const queryCategorySlugs = searchParams.getAll("categorySlugs");
  const currentCategorySlugs =
    activeCategorySlugs ??
    (categoryInPath && basePath.startsWith("/san-pham/danh-muc/")
      ? [decodeURIComponent(basePath.replace("/san-pham/danh-muc/", ""))]
      : queryCategorySlugs);

  const inStockOnly = searchParams.get("inStockOnly") === "true";
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";

  const [minPrice, setMinPrice] = useState(currentMinPrice);
  const [maxPrice, setMaxPrice] = useState(currentMaxPrice);

  const pushListing = useCallback(
    (opts: {
      keyword?: string;
      categorySlugs?: string[];
      minPrice?: string;
      maxPrice?: string;
      inStockOnly?: boolean;
    }) => {
      const nextCategories = opts.categorySlugs ?? currentCategorySlugs;
      const nextKeyword =
        opts.keyword !== undefined ? opts.keyword : searchParams.get("keyword") || "";
      const nextMin =
        opts.minPrice !== undefined
          ? opts.minPrice
          : searchParams.get("minPrice") || "";
      const nextMax =
        opts.maxPrice !== undefined
          ? opts.maxPrice
          : searchParams.get("maxPrice") || "";
      const nextStock =
        opts.inStockOnly !== undefined
          ? opts.inStockOnly
          : searchParams.get("inStockOnly") === "true";
      const sort = searchParams.get("sort") || undefined;

      let targetBase = "/san-pham";
      let categoryInPathNext = false;

      if (nextCategories.length === 1) {
        targetBase = categoryPath(nextCategories[0]);
        categoryInPathNext = true;
      }

      const href = buildProductListingHref(targetBase, {
        keyword: nextKeyword || undefined,
        categorySlugs: nextCategories,
        minPrice: nextMin || undefined,
        maxPrice: nextMax || undefined,
        inStockOnly: nextStock,
        sort,
        page: 0,
        categoryInPath: categoryInPathNext,
      });

      router.push(href, { scroll: false });
    },
    [router, searchParams, currentCategorySlugs],
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    pushListing({ keyword });
  };

  const handleCategoryChange = (slug: string, checked: boolean) => {
    let newSlugs = [...currentCategorySlugs];
    if (checked) {
      if (!newSlugs.includes(slug)) newSlugs.push(slug);
    } else {
      newSlugs = newSlugs.filter((s) => s !== slug);
    }
    pushListing({ categorySlugs: newSlugs });
  };

  const handlePriceApply = () => {
    pushListing({ minPrice, maxPrice });
  };

  return (
    <div className="space-y-md">
      <form onSubmit={handleSearch} className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-[20px]">
          search
        </span>
        <input
          type="text"
          className="w-full h-10 pl-10 pr-4 rounded-lg bg-surface-container-low border border-surface-variant focus:ring-2 focus:ring-primary/20 text-body-md placeholder:text-text-muted transition-all"
          placeholder="Tìm sản phẩm..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </form>

      <div className="bg-surface-container-low rounded-xl p-md border border-surface-variant">
        <div className="flex items-center justify-between mb-sm border-b border-border-warm pb-2">
          <h3 className="font-label-md text-label-md text-primary">Danh mục</h3>
          {currentCategorySlugs.length > 0 && (
            <Link
              href={buildProductListingHref("/san-pham", {
                keyword: searchParams.get("keyword") || undefined,
                minPrice: searchParams.get("minPrice") || undefined,
                maxPrice: searchParams.get("maxPrice") || undefined,
                inStockOnly,
                sort: searchParams.get("sort") || undefined,
                page: 0,
              })}
              className="font-caption text-caption text-secondary hover:text-primary"
              scroll={false}
            >
              Tất cả
            </Link>
          )}
        </div>
        <ul className="space-y-sm max-h-[300px] overflow-y-auto custom-scrollbar">
          {categories.map((cat) => {
            const slug = cat.slug || "";
            const isChecked = currentCategorySlugs.includes(slug);
            return (
              <li key={cat.id}>
                <label className="flex items-center gap-xs cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => handleCategoryChange(slug, e.target.checked)}
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

      <div className="bg-surface-container-low rounded-xl p-md border border-surface-variant">
        <h3 className="font-label-md text-label-md text-primary mb-sm border-b border-border-warm pb-2">
          Khoảng giá
        </h3>
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
            type="button"
            onClick={handlePriceApply}
            className="w-full mt-2 py-1 px-3 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded text-sm font-medium transition-colors"
          >
            Áp dụng
          </button>
        </div>
      </div>

      <div className="bg-surface-container-low rounded-xl p-md border border-surface-variant">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => pushListing({ inStockOnly: e.target.checked })}
            className="rounded border-outline text-primary focus:ring-primary w-5 h-5 transition-colors"
          />
          <span className="font-label-md text-on-surface select-none">
            Chỉ hiện sản phẩm còn hàng
          </span>
        </label>
      </div>
    </div>
  );
}
