import type { ProductCategorySummary, ProductPage } from "@/services/generated/model";
import {
  getProductCategories,
  getProducts,
} from "@/services/generated/public-products/public-products";

export type ProductListingSearch = {
  keyword?: string;
  categorySlugs: string[];
  minPrice?: number;
  maxPrice?: number;
  inStockOnly: boolean;
  sort?: string;
  page: number;
};

export function parseProductListingSearch(
  resolvedParams: Record<string, string | string[] | undefined>,
  forcedCategorySlug?: string,
): ProductListingSearch {
  const keyword =
    typeof resolvedParams.keyword === "string" ? resolvedParams.keyword : undefined;

  let categorySlugs: string[] = [];
  if (forcedCategorySlug) {
    categorySlugs = [forcedCategorySlug];
  } else if (Array.isArray(resolvedParams.categorySlugs)) {
    categorySlugs = resolvedParams.categorySlugs.filter(Boolean);
  } else if (typeof resolvedParams.categorySlugs === "string") {
    categorySlugs = [resolvedParams.categorySlugs];
  }

  const minPrice =
    typeof resolvedParams.minPrice === "string"
      ? parseFloat(resolvedParams.minPrice)
      : undefined;
  const maxPrice =
    typeof resolvedParams.maxPrice === "string"
      ? parseFloat(resolvedParams.maxPrice)
      : undefined;
  const inStockOnly = resolvedParams.inStockOnly === "true";
  const sort =
    typeof resolvedParams.sort === "string" ? resolvedParams.sort : undefined;
  const page =
    typeof resolvedParams.page === "string"
      ? parseInt(resolvedParams.page, 10) || 0
      : 0;

  return {
    keyword,
    categorySlugs,
    minPrice: Number.isFinite(minPrice) ? minPrice : undefined,
    maxPrice: Number.isFinite(maxPrice) ? maxPrice : undefined,
    inStockOnly,
    sort,
    page,
  };
}

export function buildProductListingHref(
  basePath: string,
  opts: {
    keyword?: string;
    categorySlugs?: string[];
    minPrice?: number | string;
    maxPrice?: number | string;
    inStockOnly?: boolean;
    sort?: string;
    page?: number;
    /** When true, do not put categorySlugs in query (already in path). */
    categoryInPath?: boolean;
  },
): string {
  const params = new URLSearchParams();
  if (opts.keyword) params.set("keyword", opts.keyword);
  if (!opts.categoryInPath) {
    (opts.categorySlugs || []).forEach((slug) => params.append("categorySlugs", slug));
  }
  if (opts.minPrice !== undefined && opts.minPrice !== "") {
    params.set("minPrice", String(opts.minPrice));
  }
  if (opts.maxPrice !== undefined && opts.maxPrice !== "") {
    params.set("maxPrice", String(opts.maxPrice));
  }
  if (opts.inStockOnly) params.set("inStockOnly", "true");
  if (opts.sort) params.set("sort", opts.sort);
  if (opts.page != null && opts.page > 0) params.set("page", String(opts.page));

  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function categoryPath(slug: string): string {
  return `/san-pham/danh-muc/${encodeURIComponent(slug)}`;
}

export function unwrapCategories(categoriesData: unknown): ProductCategorySummary[] {
  if (!categoriesData) return [];
  if (Array.isArray(categoriesData)) return categoriesData;
  if (
    typeof categoriesData === "object" &&
    "data" in categoriesData &&
    Array.isArray((categoriesData as { data: unknown }).data)
  ) {
    return (categoriesData as { data: ProductCategorySummary[] }).data;
  }
  return [];
}

export function unwrapProductsPage(productsDataRaw: unknown): ProductPage | undefined {
  if (!productsDataRaw || typeof productsDataRaw !== "object") return undefined;
  if ("items" in productsDataRaw) {
    return productsDataRaw as unknown as ProductPage;
  }
  if ("data" in productsDataRaw) {
    return (productsDataRaw as { data: ProductPage }).data;
  }
  return undefined;
}

export async function fetchProductListing(search: ProductListingSearch) {
  const [categoriesData, productsDataRaw] = await Promise.all([
    getProductCategories().catch(() => []),
    getProducts({
      keyword: search.keyword,
      categorySlugs: search.categorySlugs,
      minPrice: search.minPrice,
      maxPrice: search.maxPrice,
      inStockOnly: search.inStockOnly,
      sort: search.sort as
        | "latest"
        | "best_selling"
        | "price_asc"
        | "price_desc"
        | undefined,
      page: search.page,
      size: 12,
    }).catch(() => ({ items: [], totalPages: 0, page: 0, size: 12, totalItems: 0 })),
  ]);

  const categories = unwrapCategories(categoriesData);
  const productsPage = unwrapProductsPage(productsDataRaw);
  const products =
    productsPage && Array.isArray(productsPage.items) ? productsPage.items : [];

  return {
    categories,
    products,
    totalPages: productsPage?.totalPages || 0,
    currentPage: productsPage?.page || 0,
  };
}
