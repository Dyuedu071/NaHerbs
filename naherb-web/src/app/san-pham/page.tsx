import { Metadata } from 'next';
import { ProductPage, ProductCategorySummary } from '@/services/generated/model';
import { getProducts, getProductCategories } from '@/services/generated/public-products/public-products';
import ProductCard from '@/components/ProductCard';
import ProductFilter from './_components/ProductFilter';

export const metadata: Metadata = {
  title: 'Sản phẩm | NaHerbs',
  description: 'Khám phá các sản phẩm thảo dược chăm sóc sức khỏe từ NaHerbs.',
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await searchParams;

  const keyword = typeof resolvedParams.keyword === 'string' ? resolvedParams.keyword : undefined;
  const categorySlug = typeof resolvedParams.categorySlug === 'string' ? resolvedParams.categorySlug : undefined;
  const need = typeof resolvedParams.need === 'string' ? resolvedParams.need : undefined;
  const inStockOnly = resolvedParams.inStockOnly === 'true';
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 0;

  // Fetch data in parallel
  const [categoriesData, productsDataRaw] = await Promise.all([
    getProductCategories().catch(() => []),
    getProducts({
      keyword,
      categorySlug,
      need,
      inStockOnly,
      page,
      size: 12,
    }).catch(() => ({ items: [], totalPages: 0, page: 0, size: 12, totalItems: 0 })),
  ]);

  // Robustly extract categories (handles direct array or wrapped in response.data)
  let categories: ProductCategorySummary[] = [];
  if (categoriesData) {
    if (Array.isArray(categoriesData)) {
      categories = categoriesData;
    } else if (typeof categoriesData === 'object' && 'data' in categoriesData && Array.isArray((categoriesData as any).data)) {
      categories = (categoriesData as any).data;
    }
  }

  // Robustly extract productsPage (handles direct ProductPage or wrapped in response.data)
  let productsPage: ProductPage | undefined = undefined;
  if (productsDataRaw) {
    if (productsDataRaw && typeof productsDataRaw === 'object' && 'items' in productsDataRaw) {
      productsPage = productsDataRaw as unknown as ProductPage;
    } else if (typeof productsDataRaw === 'object' && 'data' in productsDataRaw) {
      productsPage = (productsDataRaw as any).data as ProductPage;
    }
  }

  const products = productsPage && Array.isArray(productsPage.items) ? productsPage.items : [];
  const totalPages = productsPage?.totalPages || 0;
  const currentPage = productsPage?.page || 0;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-merriweather font-bold text-gray-900 mb-8 text-center">
          Sản phẩm Thảo dược
        </h1>

        <ProductFilter categories={categories} />

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào phù hợp.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <a
                key={i}
                href={`/san-pham?page=${i}${keyword ? `&keyword=${keyword}` : ''}${categorySlug ? `&categorySlug=${categorySlug}` : ''}${need ? `&need=${need}` : ''}${inStockOnly ? '&inStockOnly=true' : ''}`}
                className={`w-10 h-10 flex items-center justify-center rounded-xl font-medium transition ${
                  i === currentPage
                    ? 'bg-green-700 text-white'
                    : 'bg-white text-gray-600 hover:bg-green-50'
                }`}
              >
                {i + 1}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
