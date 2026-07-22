import Link from "next/link";
import { Suspense } from "react";
import ProductCard from "@/components/ProductCard";
import type { ProductCategorySummary, ProductSummary } from "@/services/generated/model";
import { buildProductListingHref } from "@/lib/product-listing";
import ProductFilter from "../_components/ProductFilter";
import ProductSortBar from "../_components/ProductSortBar";

type ProductsListingViewProps = {
  basePath: string;
  categoryInPath?: boolean;
  activeCategorySlugs: string[];
  categories: ProductCategorySummary[];
  products: ProductSummary[];
  totalPages: number;
  currentPage: number;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly: boolean;
  sort?: string;
  heading: string;
  description: string;
};

export default function ProductsListingView({
  basePath,
  categoryInPath = false,
  activeCategorySlugs,
  categories,
  products,
  totalPages,
  currentPage,
  keyword,
  minPrice,
  maxPrice,
  inStockOnly,
  sort,
  heading,
  description,
}: ProductsListingViewProps) {
  const generatePaginationUrl = (pageIndex: number) =>
    buildProductListingHref(basePath, {
      keyword,
      categorySlugs: activeCategorySlugs,
      minPrice,
      maxPrice,
      inStockOnly,
      sort,
      page: pageIndex,
      categoryInPath,
    });

  return (
    <main className="flex-grow pt-24 pb-xl px-gutter max-w-container-max mx-auto w-full min-h-screen">
      <div className="mb-lg border-b border-border-warm pb-md">
        <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
          {heading}
        </h1>
        <p className="font-body-md text-body-md text-text-muted mt-2 max-w-2xl">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
        <aside className="md:col-span-3 space-y-md sticky top-32">
          <Suspense fallback={<div>Đang tải bộ lọc...</div>}>
            <ProductFilter
              categories={categories}
              basePath={basePath}
              categoryInPath={categoryInPath}
              activeCategorySlugs={activeCategorySlugs}
            />
          </Suspense>
        </aside>

        <div className="md:col-span-9">
          <Suspense fallback={<div>Đang tải...</div>}>
            <ProductSortBar basePath={basePath} categoryInPath={categoryInPath} />
          </Suspense>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={index < 4}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-surface-container-lowest rounded-2xl shadow-[0_4px_20px_-2px_rgba(46,77,57,0.12)] border border-border-warm flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-[64px] text-text-muted opacity-40 mb-sm">
                inventory_2
              </span>
              <p className="text-on-surface-variant font-label-md text-label-md">
                Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.
              </p>
              <Link
                href="/san-pham"
                scroll={false}
                className="mt-md text-primary hover:underline font-label-md transition-colors"
              >
                Xóa bộ lọc
              </Link>
            </div>
          )}

          {totalPages > 0 && (
            <div className="mt-xl flex justify-center items-center gap-2">
              <Link
                href={currentPage > 0 ? generatePaginationUrl(currentPage - 1) : "#"}
                scroll={false}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                  currentPage > 0
                    ? "text-text-main hover:bg-surface-variant hover:text-primary"
                    : "text-text-muted opacity-50 cursor-default pointer-events-none"
                }`}
                aria-label="Trang trước"
                aria-disabled={currentPage === 0}
              >
                <span className="material-symbols-outlined text-[20px]">
                  chevron_left
                </span>
              </Link>

              {Array.from({ length: totalPages }).map((_, i) => (
                <Link
                  key={i}
                  href={generatePaginationUrl(i)}
                  scroll={false}
                  className={`w-10 h-10 flex items-center justify-center rounded-full font-label-md transition-colors ${
                    i === currentPage
                      ? "bg-primary text-white shadow-md"
                      : "text-text-main hover:bg-surface-variant hover:text-primary"
                  }`}
                >
                  {i + 1}
                </Link>
              ))}

              <Link
                href={
                  currentPage < totalPages - 1
                    ? generatePaginationUrl(currentPage + 1)
                    : "#"
                }
                scroll={false}
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${
                  currentPage < totalPages - 1
                    ? "text-text-main hover:bg-surface-variant hover:text-primary"
                    : "text-text-muted opacity-50 cursor-default pointer-events-none"
                }`}
                aria-label="Trang sau"
                aria-disabled={currentPage === totalPages - 1}
              >
                <span className="material-symbols-outlined text-[20px]">
                  chevron_right
                </span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
