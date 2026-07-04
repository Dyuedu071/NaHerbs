import { Metadata } from 'next';
import Link from 'next/link';
import { ProductPage, ProductCategorySummary } from '@/services/generated/model';
import { getProducts, getProductCategories } from '@/services/generated/public-products/public-products';
import ProductCard from '@/components/ProductCard';
import ProductFilter from './_components/ProductFilter';
import ProductSortBar from './_components/ProductSortBar';

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
  
  let categorySlugs: string[] = [];
  if (Array.isArray(resolvedParams.categorySlugs)) {
    categorySlugs = resolvedParams.categorySlugs;
  } else if (typeof resolvedParams.categorySlugs === 'string') {
    categorySlugs = [resolvedParams.categorySlugs];
  }

  const minPrice = typeof resolvedParams.minPrice === 'string' ? parseFloat(resolvedParams.minPrice) : undefined;
  const maxPrice = typeof resolvedParams.maxPrice === 'string' ? parseFloat(resolvedParams.maxPrice) : undefined;
  const inStockOnly = resolvedParams.inStockOnly === 'true';
  const sort = typeof resolvedParams.sort === 'string' ? (resolvedParams.sort as any) : undefined;
  const page = typeof resolvedParams.page === 'string' ? parseInt(resolvedParams.page, 10) : 0;

  // Fetch data in parallel
  const [categoriesData, productsDataRaw] = await Promise.all([
    getProductCategories().catch(() => []),
    getProducts({
      keyword,
      categorySlugs,
      minPrice,
      maxPrice,
      inStockOnly,
      sort,
      page,
      size: 12,
    }).catch(() => ({ items: [], totalPages: 0, page: 0, size: 12, totalItems: 0 })),
  ]);

  let categories: ProductCategorySummary[] = [];
  if (categoriesData) {
    if (Array.isArray(categoriesData)) {
      categories = categoriesData;
    } else if (typeof categoriesData === 'object' && 'data' in categoriesData && Array.isArray((categoriesData as any).data)) {
      categories = (categoriesData as any).data;
    }
  }

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

  const generatePaginationUrl = (pageIndex: number) => {
    const params = new URLSearchParams();
    if (keyword) params.set('keyword', keyword);
    categorySlugs.forEach(slug => params.append('categorySlugs', slug));
    if (minPrice) params.set('minPrice', minPrice.toString());
    if (maxPrice) params.set('maxPrice', maxPrice.toString());
    if (inStockOnly) params.set('inStockOnly', 'true');
    if (sort) params.set('sort', sort);
    params.set('page', pageIndex.toString());
    return `/san-pham?${params.toString()}`;
  };

  return (
    <>
      <main className="flex-grow pt-24 pb-xl px-gutter max-w-container-max mx-auto w-full min-h-screen">
        {/* Hero Title */}
        <div className="mb-lg border-b border-border-warm pb-md">
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">Sản phẩm NaHerbs</h1>
            <p className="font-body-md text-body-md text-text-muted mt-2 max-w-2xl">Khám phá các dòng sản phẩm chăm sóc sức khỏe và sắc đẹp từ thiên nhiên, được tinh chế với công nghệ hiện đại để giữ trọn tinh túy dược liệu.</p>
        </div>

        {/* Layout Grid: Sidebar + Products */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-start">
            {/* Sidebar Filters */}
            <aside className="md:col-span-3 space-y-md sticky top-32">
                <ProductFilter categories={categories} />
            </aside>

            {/* Product Grid Area */}
            <div className="md:col-span-9">
              <ProductSortBar />

              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
                  {products.map((product, index) => (
                    <ProductCard key={product.id} product={product} priority={index < 4} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 bg-surface-container-lowest rounded-2xl shadow-[0_4px_20px_-2px_rgba(46,77,57,0.12)] border border-border-warm flex flex-col items-center justify-center">
                  <span className="material-symbols-outlined text-[64px] text-text-muted opacity-40 mb-sm">inventory_2</span>
                  <p className="text-on-surface-variant font-label-md text-label-md">Không tìm thấy sản phẩm nào phù hợp với bộ lọc hiện tại.</p>
                  <Link href="/san-pham" scroll={false} className="mt-md text-primary hover:underline font-label-md transition-colors">
                    Xóa bộ lọc
                  </Link>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 0 && (
                <div className="mt-xl flex justify-center items-center gap-2">
                  <Link 
                    href={currentPage > 0 ? generatePaginationUrl(currentPage - 1) : '#'} 
                    scroll={false}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${currentPage > 0 ? 'text-text-main hover:bg-surface-variant hover:text-primary' : 'text-text-muted opacity-50 cursor-default pointer-events-none'}`}
                    aria-label="Trang trước"
                    aria-disabled={currentPage === 0}
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                  </Link>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <Link
                      key={i}
                      href={generatePaginationUrl(i)}
                      scroll={false}
                      className={`w-10 h-10 flex items-center justify-center rounded-full font-label-md transition-colors ${
                        i === currentPage
                          ? 'bg-primary text-white shadow-md'
                          : 'text-text-main hover:bg-surface-variant hover:text-primary'
                      }`}
                    >
                      {i + 1}
                    </Link>
                  ))}

                  <Link 
                    href={currentPage < totalPages - 1 ? generatePaginationUrl(currentPage + 1) : '#'} 
                    scroll={false}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors ${currentPage < totalPages - 1 ? 'text-text-main hover:bg-surface-variant hover:text-primary' : 'text-text-muted opacity-50 cursor-default pointer-events-none'}`}
                    aria-label="Trang sau"
                    aria-disabled={currentPage === totalPages - 1}
                  >
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </Link>
                </div>
              )}
            </div>
        </div>
      </main>
    </>
  );
}
