import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
import ProductsListingView from "./_components/ProductsListingView";
import {
  buildProductListingHref,
  categoryPath,
  fetchProductListing,
  parseProductListingSearch,
} from "@/lib/product-listing";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Sản phẩm thảo dược",
  description:
    "Khám phá các sản phẩm thảo dược chăm sóc sức khỏe từ NaHerbs.",
  path: "/san-pham",
});

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const search = parseProductListingSearch(resolvedParams);

  // Legacy query → clean URL when đúng 1 danh mục
  if (search.categorySlugs.length === 1) {
    permanentRedirect(
      buildProductListingHref(categoryPath(search.categorySlugs[0]), {
        keyword: search.keyword,
        minPrice: search.minPrice,
        maxPrice: search.maxPrice,
        inStockOnly: search.inStockOnly,
        sort: search.sort,
        page: search.page,
        categoryInPath: true,
      }),
    );
  }

  const { categories, products, totalPages, currentPage } =
    await fetchProductListing(search);

  return (
    <ProductsListingView
      basePath="/san-pham"
      activeCategorySlugs={search.categorySlugs}
      categories={categories}
      products={products}
      totalPages={totalPages}
      currentPage={currentPage}
      keyword={search.keyword}
      minPrice={search.minPrice}
      maxPrice={search.maxPrice}
      inStockOnly={search.inStockOnly}
      sort={search.sort}
      heading="Sản phẩm NaHerbs"
      description="Khám phá các dòng sản phẩm chăm sóc sức khỏe và sắc đẹp từ thiên nhiên, được tinh chế với công nghệ hiện đại để giữ trọn tinh túy dược liệu."
    />
  );
}
