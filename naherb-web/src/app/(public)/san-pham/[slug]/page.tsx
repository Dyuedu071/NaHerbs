import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/seo/JsonLd";
import { ProductDetail } from "@/services/generated/model";
import { getProductsSlug } from "@/services/generated/public-products/public-products";
import {
  buildBreadcrumbJsonLd,
  buildPageMetadata,
  buildProductJsonLd,
} from "@/lib/seo";
import { categoryPath } from "@/lib/product-listing";
import ProductInteractive from "./_components/ProductInteractive";
import ProductTabs from "./_components/ProductTabs";

interface Props {
  params: Promise<{ slug: string }>;
}

async function loadProduct(slug: string): Promise<ProductDetail | undefined> {
  try {
    const rawData = await getProductsSlug(slug);
    if (!rawData) return undefined;
    if ("id" in rawData) return rawData as unknown as ProductDetail;
    if (typeof rawData === "object" && "data" in rawData && rawData.data) {
      return rawData.data as ProductDetail;
    }
  } catch {
    return undefined;
  }
  return undefined;
}

function getProductImage(product: ProductDetail): string | undefined {
  const thumb = product.images?.find((img) => img.isThumbnail)?.url;
  return thumb || product.images?.[0]?.url || undefined;
}

function getOfferPrice(product: ProductDetail): {
  price?: number;
  sku?: string;
  inStock?: boolean;
} {
  const skus =
    product.versions?.flatMap((v) => v.skus || []).filter(Boolean) || [];
  const priced = skus
    .filter((s) => s.salePrice != null)
    .sort((a, b) => (a.salePrice || 0) - (b.salePrice || 0));
  const best = priced[0];
  return {
    price: best?.salePrice ?? undefined,
    sku: best?.skuCode || undefined,
    inStock: best ? best.stockStatus !== "OUT_OF_STOCK" : undefined,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug);

  if (!product) {
    return buildPageMetadata({
      title: "Sản phẩm không tồn tại",
      path: `/san-pham/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: product.seoTitle || product.name,
    description: product.seoDescription || product.shortDescription,
    path: `/san-pham/${product.slug}`,
    image: getProductImage(product),
    absoluteTitle: Boolean(product.seoTitle),
    keywords: product.primaryKeyword,
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) notFound();

  const offer = getOfferPrice(product);
  const image = getProductImage(product);
  const breadcrumbs = [
    { name: "Trang chủ", path: "/" },
    { name: "Sản phẩm", path: "/san-pham" },
    ...(product.category
      ? [
          {
            name: product.category.name || "Danh mục",
            path: categoryPath(product.category.slug || ""),
          },
        ]
      : []),
    { name: product.name || "Chi tiết", path: `/san-pham/${product.slug}` },
  ];

  return (
    <main className="flex-grow pt-24 min-h-screen bg-surface">
      <JsonLd
        data={[
          buildProductJsonLd({
            name: product.name || "Sản phẩm NaHerbs",
            slug: product.slug || slug,
            description: product.seoDescription || product.shortDescription,
            image,
            sku: offer.sku,
            price: offer.price,
            inStock: offer.inStock,
          }),
          buildBreadcrumbJsonLd(breadcrumbs),
        ]}
      />

      <div className="max-w-container-max mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav aria-label="Breadcrumb" className="flex mb-8 text-sm text-gray-500 flex-wrap">
          <Link href="/" className="hover:text-green-700">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link href="/san-pham" className="hover:text-green-700">
            Sản phẩm
          </Link>
          {product.category && (
            <>
              <span className="mx-2">/</span>
              <Link
                href={categoryPath(product.category.slug || "")}
                className="hover:text-green-700"
              >
                {product.category.name}
              </Link>
            </>
          )}
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        <ProductInteractive product={product} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
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
