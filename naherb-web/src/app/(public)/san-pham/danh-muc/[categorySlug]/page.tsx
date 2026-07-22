import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import ProductsListingView from "../../_components/ProductsListingView";
import {
  categoryPath,
  fetchProductListing,
  parseProductListingSearch,
} from "@/lib/product-listing";
import {
  buildBreadcrumbJsonLd,
  buildPageMetadata,
} from "@/lib/seo";

type Props = {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorySlug } = await params;
  const { categories } = await fetchProductListing({
    categorySlugs: [categorySlug],
    inStockOnly: false,
    page: 0,
  });
  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) {
    return buildPageMetadata({
      title: "Danh mục không tồn tại",
      path: categoryPath(categorySlug),
      noIndex: true,
    });
  }

  const title = category.name || categorySlug;
  const description =
    category.description?.trim() ||
    `Khám phá sản phẩm ${title} từ thảo dược thiên nhiên NaHerbs.`;

  return buildPageMetadata({
    title,
    description,
    path: categoryPath(categorySlug),
    image: category.imageUrl,
  });
}

export default async function ProductCategoryPage({
  params,
  searchParams,
}: Props) {
  const { categorySlug } = await params;
  const resolvedParams = await searchParams;
  const search = parseProductListingSearch(resolvedParams, categorySlug);

  const { categories, products, totalPages, currentPage } =
    await fetchProductListing(search);

  const category = categories.find((c) => c.slug === categorySlug);
  if (!category) notFound();

  const heading = category.name || "Danh mục sản phẩm";
  const description =
    category.description?.trim() ||
    `Khám phá các sản phẩm thuộc danh mục ${heading} tại NaHerbs.`;

  return (
    <>
      <JsonLd
        data={buildBreadcrumbJsonLd([
          { name: "Trang chủ", path: "/" },
          { name: "Sản phẩm", path: "/san-pham" },
          { name: heading, path: categoryPath(categorySlug) },
        ])}
      />
      <ProductsListingView
        basePath={categoryPath(categorySlug)}
        categoryInPath
        activeCategorySlugs={[categorySlug]}
        categories={categories}
        products={products}
        totalPages={totalPages}
        currentPage={currentPage}
        keyword={search.keyword}
        minPrice={search.minPrice}
        maxPrice={search.maxPrice}
        inStockOnly={search.inStockOnly}
        sort={search.sort}
        heading={heading}
        description={description}
      />
    </>
  );
}
