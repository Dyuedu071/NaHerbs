import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/services/generated/model';
import { getProductsSlug } from '@/services/generated/public-products/public-products';
import ProductInteractive from './_components/ProductInteractive';
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
    let product: ProductDetail | undefined = undefined;
    if (rawData) {
      if ('id' in rawData) {
        product = rawData as unknown as ProductDetail;
      } else if (typeof rawData === 'object' && 'data' in rawData && rawData.data) {
        product = rawData.data as ProductDetail;
      }
    }

    if (!product) {
      return {
        title: 'Sản phẩm không tồn tại | NaHerbs',
      };
    }

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
  
  let product: ProductDetail | undefined = undefined;
  try {
    const rawData = await getProductsSlug(resolvedParams.slug);
    if (rawData) {
      if ('id' in rawData) {
        product = rawData as unknown as ProductDetail;
      } else if (typeof rawData === 'object' && 'data' in rawData && rawData.data) {
        product = rawData.data as ProductDetail;
      }
    }
  } catch (error) {
    notFound();
  }

  if (!product) {
    notFound();
  }

  return (
    <main className="flex-grow pt-24 min-h-screen bg-surface">
      <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

        <ProductInteractive product={product} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
          {/* Keep an empty div to align tabs properly or just place tabs full width */}
          <div className="col-span-1 lg:col-span-2">
            <ProductTabs 
              detailDescription={product.detailDescription ?? undefined}
              usageInstruction={product.usageInstruction ?? undefined}
              safetyNote={product.safetyNote ?? undefined}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
