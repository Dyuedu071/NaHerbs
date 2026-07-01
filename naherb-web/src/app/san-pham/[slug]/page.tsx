import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/services/generated/model';
import { getProductsSlug } from '@/services/generated/public-products/public-products';
import ProductGallery from './_components/ProductGallery';
import ProductSelection from './_components/ProductSelection';
import ProductTabs from './_components/ProductTabs';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const rawData = await getProductsSlug(resolvedParams.slug);
    const product = rawData as unknown as ProductDetail;
    return {
      title: product.seoTitle || `${product.name} | NaHerbs`,
      description: product.seoDescription || product.shortDescription,
    };
  } catch (error) {
    return {
      title: 'Sản phẩm không tồn tại | NaHerbs',
    };
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const resolvedParams = await params;
  
  let product: ProductDetail;
  try {
    const rawData = await getProductsSlug(resolvedParams.slug);
    product = rawData as unknown as ProductDetail;
  } catch (error) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="flex mb-8 text-sm text-gray-500">
          <a href="/" className="hover:text-green-700">Trang chủ</a>
          <span className="mx-2">/</span>
          <a href="/san-pham" className="hover:text-green-700">Sản phẩm</a>
          {product.category && (
            <>
              <span className="mx-2">/</span>
              <a href={`/san-pham?categorySlug=${product.category.slug}`} className="hover:text-green-700">
                {product.category.name}
              </a>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gallery Column */}
          <div className="lg:sticky lg:top-8 h-fit">
            <ProductGallery images={product.images || []} />
          </div>

          {/* Info Column */}
          <div className="pt-2">
            <h1 className="text-4xl font-merriweather font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {product.shortDescription}
            </p>

            <ProductSelection versions={product.versions || []} />
          </div>
        </div>

        <ProductTabs 
          detailDescription={product.detailDescription ?? undefined}
          usageInstruction={product.usageInstruction ?? undefined}
          safetyNote={product.safetyNote ?? undefined}
        />
      </div>
    </div>
  );
}
